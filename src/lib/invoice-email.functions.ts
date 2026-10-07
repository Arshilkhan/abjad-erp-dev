import { createServerFn } from '@tanstack/react-start'
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'

export const sendInvoiceEmail = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { invoiceId: string; kind?: string }) => {
    if (!input?.invoiceId) throw new Error('invoiceId is required')
    return input
  })
  .handler(async ({ data, context }) => {
    const { supabase } = context

    const { enforceRateLimit } = await import('./rate-limit.server')
    await enforceRateLimit('invoice-email', context.userId, 60, 3600)
    await enforceRateLimit('invoice-email-doc', data.invoiceId, 5, 3600)

    const { fetchSalesDocument } = await import('./sales-document-fetch.server')
    const doc = await fetchSalesDocument(supabase, data.invoiceId, data.kind)

    if (!doc) {
      return { sent: false as const, reason: 'invoice_not_found' }
    }

    const { invoice, items, company } = doc

    let email: string | null = null
    let companyName: string | null = null

    if (invoice.customer_id) {
      const { data: cust } = await supabase
        .from('customers')
        .select('email, company_name')
        .eq('id', invoice.customer_id)
        .single()

      email = cust?.email ?? null
      companyName =
        cust?.company_name || invoice.customer_name_snapshot || null
    } else {
      companyName = invoice.customer_name_snapshot || null
    }

    if (!email) {
      return { sent: false as const, reason: 'no_email' }
    }

    const kind = data.kind ?? 'tax_invoice'

    const documentLabel =
      kind === 'delivery_challan'
        ? 'Delivery Challan'
        : kind === 'quotation'
          ? 'Quotation'
          : kind === 'proforma'
            ? 'Proforma Invoice'
            : 'Tax Invoice'

    // Build the correct PDF for the document type.
    let pdfBytes: Uint8Array

    if (kind === 'delivery_challan') {
      const { buildChallanPdf } = await import('./challan-pdf-build.server')
      pdfBytes = await buildChallanPdf(
        invoice,
        items ?? [],
        company ?? null,
      )
    } else {
      const { buildInvoicePdf } = await import('./invoice-pdf-build.server')
      pdfBytes = await buildInvoicePdf(
        invoice,
        items ?? [],
        company ?? null,
      )
    }

    let binary = ''
    const bytes = new Uint8Array(pdfBytes)

    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]!)
    }

    const pdfBase64 = btoa(binary)

    const { sendResendEmail } =
      await import('@/lib/email-templates/send-email-resend')

    await sendResendEmail('invoice-sent', email, {
      templateData: {
        documentLabel,
        documentNumber: invoice.invoice_number,
        documentDate: invoice.invoice_date,
        companyName,
      },
      attachments: [
        {
          filename: `${invoice.invoice_number || invoice.id}.pdf`,
          content: pdfBase64,
          contentType: 'application/pdf',
        },
      ],
    })

    return {
      sent: true as const,
      email,
    }
  })