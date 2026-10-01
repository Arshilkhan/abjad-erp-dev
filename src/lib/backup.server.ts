/**
 * Builds the ERP backup ZIP (invoice PDFs + CSV data exports) and uploads it
 * to the connected Google Drive account. Server-only.
 */
import { zipSync } from 'fflate'
import { supabaseAdmin } from '@/integrations/supabase/client.server'
import { buildInvoicePdf } from './invoice-pdf-build.server'
import { uploadZip } from './google-drive.server'

type Row = Record<string, any>

const safe = (s: unknown, fallback = 'unknown') =>
  String(s ?? '')
    .replace(/[^A-Za-z0-9._ -]/g, '')
    .trim()
    .slice(0, 60) || fallback

function toCsv(rows: Row[]): string {
  if (!rows.length) return ''
  const cols = Object.keys(rows[0]!)
  const cell = (v: unknown) => {
    if (v === null || v === undefined) return ''
    const s = typeof v === 'object' ? JSON.stringify(v) : String(v)
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
  }
  return [cols.join(','), ...rows.map((r) => cols.map((c) => cell(r[c])).join(','))].join('\n')
}

async function fetchAll(table: string): Promise<Row[]> {
  const out: Row[] = []
  const page = 1000
  for (let from = 0; ; from += page) {
    const { data, error } = await supabaseAdmin.from(table as any).select('*').range(from, from + page - 1)
    if (error) throw new Error(`${table}: ${error.message}`)
    out.push(...((data as Row[]) ?? []))
    if (!data || data.length < page) break
  }
  return out
}

const CSV_TABLES = [
  'invoices',
  'invoice_items',
  'performa',
  'performa_items',
  'quotation',
  'quotation_items',
  'challan',
  'challan_items',
  'customers',
  'products',
  'payments',
  'purchase_orders',
  'purchase_order_items',
  'vendors',
]

export async function runBackup(opts: { trigger: 'manual' | 'scheduled'; userId?: string }) {
  const startedAt = new Date()
  const { data: historyRow } = await supabaseAdmin
    .from('backup_history')
    .insert({
      status: 'running',
      trigger_source: opts.trigger,
      created_by: opts.userId ?? null,
      started_at: startedAt.toISOString(),
    })
    .select('id')
    .single()
  const historyId = (historyRow as { id: string } | null)?.id

  const fail = async (message: string) => {
    if (historyId) {
      await supabaseAdmin
        .from('backup_history')
        .update({ status: 'failed', finished_at: new Date().toISOString(), error: message.slice(0, 2000) })
        .eq('id', historyId)
    }
    throw new Error(message)
  }

  try {
    const files: Record<string, Uint8Array> = {}
    const enc = new TextEncoder()

    // CSV exports
    const tableData: Record<string, Row[]> = {}
    for (const t of CSV_TABLES) {
      const rows = await fetchAll(t)
      tableData[t] = rows
      files[`data/${t}.csv`] = enc.encode(toCsv(rows))
    }

    // Invoice PDFs
    const { data: company } = await supabaseAdmin.from('company_profile').select('*').limit(1).maybeSingle()
    let pdfCount = 0
    const docSets = [
      ['invoices', 'invoice_items', 'invoices'],
      ['performa', 'performa_items', 'proformas'],
      ['quotation', 'quotation_items', 'quotations'],
      ['challan', 'challan_items', 'challans'],
    ] as const
    for (const [table, itemsTable, dir] of docSets) {
      const itemsByDoc = new Map<string, Row[]>()
      for (const it of tableData[itemsTable] ?? []) {
        const list = itemsByDoc.get(it['invoice_id']) ?? []
        list.push(it)
        itemsByDoc.set(it['invoice_id'], list)
      }
      for (const inv of tableData[table] ?? []) {
        const items = (itemsByDoc.get(inv['id']) ?? []).sort(
          (a, b) => Number(a['sr_no'] ?? 0) - Number(b['sr_no'] ?? 0),
        )
        try {
          const bytes = await buildInvoicePdf(inv, items, (company as Row | null) ?? null)
          const folder = safe(inv['customer_name_snapshot'], 'no-customer')
          const name = safe(inv['invoice_number'] ?? inv['id'], String(inv['id']))
          files[`${dir}/${folder}/${name}.pdf`] = bytes
          pdfCount++
        } catch (e) {
          console.error('[backup] pdf failed for', table, inv['id'], e)
        }
      }
    }

    files['manifest.json'] = enc.encode(
      JSON.stringify(
        {
          generated_at: new Date().toISOString(),
          trigger: opts.trigger,
          invoice_pdfs: pdfCount,
          counts: Object.fromEntries(Object.entries(tableData).map(([k, v]) => [k, v.length])),
        },
        null,
        2,
      ),
    )

    const zipped = zipSync(files, { level: 6 })
    const stamp = new Date()
      .toISOString()
      .replace(/[:T]/g, '-')
      .slice(0, 16)
    const fileName = `abjad-erp-backup-${stamp}.zip`

    const uploaded = await uploadZip(fileName, zipped)

    if (historyId) {
      await supabaseAdmin
        .from('backup_history')
        .update({
          status: 'success',
          finished_at: new Date().toISOString(),
          invoice_count: pdfCount,
          file_name: fileName,
          file_size: zipped.length,
          drive_file_id: uploaded.id,
          drive_link: uploaded.link,
        })
        .eq('id', historyId)
    }

    return { fileName, size: zipped.length, invoiceCount: pdfCount, link: uploaded.link }
  } catch (e) {
    await fail(e instanceof Error ? e.message : String(e))
    throw e
  }
}
