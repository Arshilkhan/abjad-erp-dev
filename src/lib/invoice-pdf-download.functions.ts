import { createServerFn } from '@tanstack/react-start'
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'

/**
 * Returns the invoice PDF (base64) built with the exact same renderer used
 * for the emailed invoice, so downloads and emails always match.
 */
export const downloadInvoicePdf = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { invoiceId: string; kind?: string }) => {
    if (!input?.invoiceId) throw new Error('invoiceId is required')
    return input
  })
  .handler(async ({ data, context }) => {
    const { supabase } = context

    const { fetchSalesDocument } = await import('./sales-document-fetch.server')
    const doc = await fetchSalesDocument(supabase, data.invoiceId, data.kind)
    if (!doc) throw new Error('Document not found')
    const { invoice, items, company } = doc

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
