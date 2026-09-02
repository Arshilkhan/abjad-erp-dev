import { createServerFn } from '@tanstack/react-start'
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'

/**
 * Returns the invoice PDF (base64) built with the exact same renderer used
 * for the emailed invoice, so downloads and emails always match.
 */
export const downloadInvoicePdf = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { invoiceId: string }) => {
    if (!input?.invoiceId) throw new Error('invoiceId is required')
    return input
  })
  .handler(async ({ data, context }) => {
    const { supabase } = context

    const { data: invoice, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', data.invoiceId)
      .single()
    if (error || !invoice) throw new Error('Invoice not found')

    const [{ data: items }, { data: company }] = await Promise.all([
      supabase
        .from('invoice_items')
        .select('*')
        .eq('invoice_id', invoice.id)
        .order('sr_no', { ascending: true }),
      supabase.from('company_profile').select('*').limit(1).maybeSingle(),
    ])

    const { buildInvoicePdf } = await import('./invoice-pdf-build.server')
    const pdfBytes = await buildInvoicePdf(invoice, items ?? [], company ?? null)

    let binary = ''
    const bytes = new Uint8Array(pdfBytes)
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!)

    return {
      filename: `${String(invoice.invoice_number ?? invoice.id).replace(/[^A-Za-z0-9._-]/g, '_')}.pdf`,
      base64: btoa(binary),
    }
  })
