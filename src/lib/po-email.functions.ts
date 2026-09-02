import { createServerFn } from '@tanstack/react-start'
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'

/**
 * Emails a purchase order to the vendor on file.
 * The PO document is rendered as the HTML email body.
 */
export const sendPoEmail = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { poId: string }) => {
    if (!input?.poId) throw new Error('poId is required')
    return input
  })
  .handler(async ({ data, context }) => {
    const { supabase } = context

    const { enforceRateLimit } = await import('./rate-limit.server')
    await enforceRateLimit('po-email', context.userId, 60, 3600)
    await enforceRateLimit('po-email-doc', data.poId, 5, 3600)

    const { data: po, error } = await supabase
      .from('purchase_orders')
      .select('*')
      .eq('id', data.poId)
      .single()
    if (error || !po) return { sent: false as const, reason: 'po_not_found' }

    const [{ data: items }, { data: company }, vendorRes] = await Promise.all([
      supabase
        .from('purchase_order_items')
        .select('*')
        .eq('purchase_order_id', po.id)
        .order('sr_no', { ascending: true }),
      supabase.from('company_profile').select('*').limit(1).maybeSingle(),
      po.vendor_id
        ? supabase.from('vendors').select('*').eq('id', po.vendor_id).maybeSingle()
        : Promise.resolve({ data: null }),
    ])

    const vendor = (vendorRes as any)?.data ?? null
    const email: string | null = vendor?.email ?? null
    if (!email) return { sent: false as const, reason: 'no_email' }

    const { buildPoPdf } = await import('./po-pdf-build.server')
    const pdfBytes = await buildPoPdf(po, items ?? [], company ?? null, vendor)

    let binary = ''
    const bytes = new Uint8Array(pdfBytes)
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!)
    const pdfBase64 = btoa(binary)

    const vendorName = po.vendor_name_snapshot ?? vendor?.vendor_name ?? 'Supplier'
    const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111827">
      <p>Dear ${vendorName},</p>
      <p>Please find attached our Purchase Order <strong>${po.po_number}</strong>.</p>
      <p>Regards,<br/>${company?.name ?? 'ABJAD Engineering Works'}</p>
    </div>`

    const { sendResendHtmlEmail } = await import('@/lib/email-templates/send-email-resend')
    await sendResendHtmlEmail({
      to: email,
      subject: `Purchase Order ${po.po_number}${company?.name ? ` - ${company.name}` : ''}`,
      html,
      attachments: [
        {
          filename: `PO-${String(po.po_number ?? po.id).replace(/[^A-Za-z0-9._-]/g, '_')}.pdf`,
          content: pdfBase64,
          contentType: 'application/pdf',
        },
      ],
    })

    if (po.status === 'draft') {
      await supabase.from('purchase_orders').update({ status: 'sent' }).eq('id', po.id)
    }

    return { sent: true as const, email }
  })
