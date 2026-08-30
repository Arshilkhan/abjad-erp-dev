import { supabaseAdmin } from '@/integrations/supabase/client.server'

/**
 * Simple fixed-window rate limiter backed by the `rate_limits` table.
 * Throws when the caller exceeded `limit` hits inside `windowSeconds`.
 */
export async function enforceRateLimit(
  bucket: string,
  identifier: string,
  limit: number,
  windowSeconds: number,
): Promise<void> {
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
