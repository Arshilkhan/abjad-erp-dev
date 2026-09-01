/**
 * Simple fixed-window rate limiter backed by the `rate_limits` table.
 * Throws when the caller exceeded `limit` hits inside `windowSeconds`.
 * Fails open when the privileged client is unavailable (e.g. no service-role
 * key in a self-hosted deployment) so core features keep working.
 */
export async function enforceRateLimit(
  bucket: string,
  identifier: string,
  limit: number,
  windowSeconds: number,
): Promise<void> {
  if (!process.env['SUPABASE_SERVICE_ROLE_KEY'] || !process.env['SUPABASE_URL']) {
    console.warn('[rate-limit] privileged client unavailable, skipping limit check')
    return
  }

  let supabaseAdmin: typeof import('@/integrations/supabase/client.server')['supabaseAdmin']
  try {
    ;({ supabaseAdmin } = await import('@/integrations/supabase/client.server'))
  } catch (e) {
    console.error('[rate-limit] admin client unavailable', e)
    return
  }

  const since = new Date(Date.now() - windowSeconds * 1000).toISOString()

  const { count, error } = await supabaseAdmin

    .from('rate_limits')
    .select('id', { count: 'exact', head: true })
    .eq('bucket', bucket)
    .eq('identifier', identifier)
    .gte('created_at', since)

  if (error) {
    // Fail open on infrastructure errors rather than blocking legitimate work.
    console.error('[rate-limit] lookup failed', error.message)
    return
  }

  if ((count ?? 0) >= limit) {
    throw new Error('Too many requests. Please wait a few minutes and try again.')
  }

  await supabaseAdmin.from('rate_limits').insert({ bucket, identifier })

  // Opportunistic cleanup of rows older than a day.
  if (Math.random() < 0.05) {
    await supabaseAdmin
      .from('rate_limits')
      .delete()
      .lt('created_at', new Date(Date.now() - 86_400_000).toISOString())
  }
}
