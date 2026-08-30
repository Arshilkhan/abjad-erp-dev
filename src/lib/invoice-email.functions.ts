import { createServerFn } from '@tanstack/react-start'
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'

/**
 * Emails an invoice PDF to the customer on file.
 * Returns a reason instead of throwing when there is nothing to send to.
 */
export const sendInvoiceEmail = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { invoiceId: string }) => {
    if (!input?.invoiceId) throw new Error('invoiceId is required')
    return input
  })
  .handler(async ({ data, context }) => {
    const { supabase } = context

    const { enforceRateLimit } = await import('./rate-limit.server')
    await enforceRateLimit('invoice-email', context.userId, 60, 3600)
    await enforceRateLimit('invoice-email-doc', data.invoiceId, 5, 3600)


    const { data: invoice, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', data.invoiceId)
      .single()
    if (error || !invoice) return { sent: false as const, reason: 'invoice_not_found' }

    let email: string | null = null
    let companyName: string | null = null
    if (invoice.customer_id) {
      const { data: cust } = await supabase
        .from('customers')
        .select('email, company_name')
        .eq('id', invoice.customer_id)
        .single()
      email = cust?.email ?? null
      companyName = cust?.company_name || invoice.customer_name_snapshot || null
    } else {
      companyName = invoice.customer_name_snapshot || null
    }
    if (!email) return { sent: false as const, reason: 'no_email' }

    const [{ data: items }, { data: company }] = await Promise.all([
      supabase
        .from('invoice_items')
        .select('*')
        .eq('invoice_id', invoice.id)
        .order('sr_no', { ascending: true }),
      supabase.from('company_profile').select('*').limit(1).maybeSingle(),
    ])

    // Build the PDF and upload it (privileged write to the private bucket)
    const { buildInvoicePdf } = await import('./invoice-pdf-build.server')
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
    const pdfBytes = await buildInvoicePdf(invoice, items ?? [], company ?? null)

    const path = `${invoice.id}.pdf`
    const { error: uploadError } = await supabaseAdmin.storage
      .from('invoice-pdfs')
      .upload(path, pdfBytes, { contentType: 'application/pdf', upsert: true })
    if (uploadError) return { sent: false as const, reason: 'pdf_upload_failed', email }

    const { data: signed, error: signError } = await supabaseAdmin.storage
      .from('invoice-pdfs')
      .createSignedUrl(path, 60 * 60 * 24 * 30) // 30 days
    if (signError || !signed?.signedUrl) {
      return { sent: false as const, reason: 'pdf_url_failed', email }
    }

    const { sendTemplateEmail } = await import('@/lib/email-templates/send-email')
    const result = await sendTemplateEmail('invoice-sent', email, {
      idempotencyKey: `invoice-sent-${invoice.id}`,
      templateData: {
        invoiceNumber: invoice.invoice_number,
        invoiceDate: invoice.invoice_date,
        companyName,
        pdfUrl: signed.signedUrl,
      },
    })

    if (!result.sent) return { sent: false as const, reason: result.reason, email }
    return { sent: true as const, email }
  })
