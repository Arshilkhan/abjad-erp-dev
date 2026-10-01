import { salesDocumentConfig, isSalesDocumentKind, type SalesDocumentKind } from './sales-documents'

/** Loads a sales document and its items from the table pair that owns its kind. */
export async function fetchSalesDocument(supabase: any, id: string, kind?: string) {
  const k: SalesDocumentKind = kind && isSalesDocumentKind(kind) ? kind : 'tax_invoice'
  const cfg = salesDocumentConfig(k)
  const { data: invoice, error } = await supabase.from(cfg.table).select('*').eq('id', id).single()
  if (error || !invoice) return null
  const [{ data: items }, { data: company }] = await Promise.all([
    supabase.from(cfg.itemsTable).select('*').eq('invoice_id', id).order('sr_no', { ascending: true }),
    supabase.from('company_profile').select('*').limit(1).maybeSingle(),
  ])
  return { kind: k, invoice, items: (items ?? []) as any[], company: company ?? null }
}
