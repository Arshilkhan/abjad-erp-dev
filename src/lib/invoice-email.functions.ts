import { createServerFn } from '@tanstack/react-start'
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'

/**
 * Emails an invoice summary to the customer on file.
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

    const { data: invoice, error } = await supabase
      .from('invoices')
      .select(
        'id, invoice_number, invoice_date, grand_total, customer_name_snapshot, contact_person, customer_id',
      )
      .eq('id', data.invoiceId)
      .single()
    if (error || !invoice) return { sent: false as const, reason: 'invoice_not_found' }

    let email: string | null = null
    let customerName: string | null = null
    let companyName: string | null = null
    if (invoice.customer_id) {
      const { data: cust } = await supabase
        .from('customers')
        .select('email, company_name, customer_name, contact_person')
        .eq('id', invoice.customer_id)
        .single()
      email = cust?.email ?? null
      customerName = cust?.contact_person || cust?.customer_name || null
      companyName = cust?.company_name || invoice.customer_name_snapshot || null
    }
    if (!email) return { sent: false as const, reason: 'no_email' }

    const { sendTemplateEmail } = await import('@/lib/email-templates/send-email')
    const amount = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(Number(invoice.grand_total ?? 0))

    const result = await sendTemplateEmail('invoice-sent', email, {
      idempotencyKey: `invoice-sent-${invoice.id}`,
      templateData: {
        invoiceNumber: invoice.invoice_number,
        invoiceDate: invoice.invoice_date,
        companyName,
        customerName: customerName ?? invoice.contact_person ?? null,
        grandTotal: amount,
      },
    })

    if (!result.sent) return { sent: false as const, reason: result.reason, email }
    return { sent: true as const, email }
  })
