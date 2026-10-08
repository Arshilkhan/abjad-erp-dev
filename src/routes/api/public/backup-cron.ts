import { createFileRoute } from '@tanstack/react-router'

/**
 * Hourly cron entry point. Runs the Drive backup only when the configured
 * schedule is due. Protected by a shared secret header / bearer token.
 */
export const Route = createFileRoute('/api/public/backup-cron')({
  server: {
    handlers: {
      GET: async ({ request }) => handle(request),
      POST: async ({ request }) => handle(request),
    },
  },
})

async function handle(request: Request): Promise<Response> {
  // Vercel Cron sends `Authorization: Bearer $CRON_SECRET`; both names are accepted.
  const secret = process.env['BACKUP_CRON_SECRET'] || process.env['CRON_SECRET']
  if (!secret) return Response.json({ error: 'Cron secret not configured' }, { status: 500 })

  const provided =
    request.headers.get('x-backup-secret') ??
    (request.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '')
  if (provided !== secret) return new Response('Unauthorized', { status: 401 })

  const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
  const { data: settings } = await supabaseAdmin
    .from('backup_settings')
    .select('id, frequency, hour_utc, last_run_at')
    .limit(1)
    .maybeSingle()

  const s = settings as { id: string; frequency: string; hour_utc: number; last_run_at: string | null } | null
  if (!s || s.frequency === 'off') return Response.json({ skipped: 'disabled' })

  const now = new Date()
  // Vercel Hobby allows only one cron run per day (within the hour), so the
  // stored hour is ignored; the frequency gap decides whether today is a run day.
  const last = s.last_run_at ? new Date(s.last_run_at) : null
  const minGapMs =
    s.frequency === 'daily' ? 40 * 3600_000 : s.frequency === 'weekly' ? 6.5 * 86_400_000 : 27 * 86_400_000
  if (last && now.getTime() - last.getTime() < minGapMs) return Response.json({ skipped: 'too_soon' })

  await supabaseAdmin.from('backup_settings').update({ last_run_at: now.toISOString() }).eq('id', s.id)

  try {
    const { runBackup } = await import('@/lib/backup.server')
    const { data: organizations, error: orgError } = await supabaseAdmin
      .from('organizations')
      .select('id')

    if (orgError) {
      throw new Error(orgError.message)
    }

    const results = []

    for (const organization of organizations ?? []) {
      results.push(
        await runBackup({
          trigger: 'scheduled',
          organizationId: organization.id,
        }),
      )
    }

    const result = results
    return Response.json({ ok: true, ...result })
  } catch (e) {
    console.error('[backup-cron]', e)
    return Response.json({ ok: false, error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}
