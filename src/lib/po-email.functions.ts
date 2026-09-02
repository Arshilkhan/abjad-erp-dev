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

    const { buildPOHtml } = await import('./po-print')
    const html = buildPOHtml(po, items ?? [], company ?? null, vendor)

    const { sendResendHtmlEmail } = await import('@/lib/email-templates/send-email-resend')
    await sendResendHtmlEmail({
      to: email,
      subject: `Purchase Order ${po.po_number}${company?.name ? ` — ${company.name}` : ''}`,
      html,
    })

    if (po.status === 'draft') {
      await supabase.from('purchase_orders').update({ status: 'sent' }).eq('id', po.id)
    }

    return { sent: true as const, email }
  })
