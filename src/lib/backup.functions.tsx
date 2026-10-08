import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'

async function assertAdmin(
  context: { supabase: any; userId: string },
  organizationId: string,
) {
  const { data, error } = await context.supabase.rpc('is_org_admin', {
    _organization_id: organizationId,
    _user_id: context.userId,
  })

  if (error) throw new Error(error.message)
  if (!data) throw new Error('Only organization administrators can manage backups.')
}

function originFromRequest() {
  const url = new URL(getRequest().url)
  return `${url.protocol}//${url.host}`
}

export const getGoogleDriveAuthUrl = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { organizationId: string }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context as any, data.organizationId)

    const { buildConsentUrl } = await import('./google-drive.server')

    return {
      url: await buildConsentUrl(
        originFromRequest(),
        context.userId,
        data.organizationId,
      ),
    }
  })

export const getBackupStatus = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { organizationId: string }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context as any, data.organizationId)

    const { getCredentials } = await import('./google-drive.server')
    const cred = await getCredentials(data.organizationId)

    const [{ data: settings }, { data: history }] = await Promise.all([
      context.supabase
        .from('backup_settings')
        .select('*')
        .eq('organization_id', data.organizationId)
        .limit(1)
        .maybeSingle(),

      context.supabase
        .from('backup_history')
        .select('*')
        .eq('organization_id', data.organizationId)
        .order('started_at', { ascending: false })
        .limit(20),
    ])

    return {
      connected: !!cred,
      accountEmail: cred?.account_email ?? null,
      settings: settings ?? null,
      history: history ?? [],
    }
  })

export const saveBackupSettings = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      organizationId: string
      frequency: string
      hour_utc: number
    }) => {
      if (!['off', 'daily', 'weekly', 'monthly'].includes(input?.frequency)) {
        throw new Error('Invalid backup frequency.')
      }

      const hour = Number(input.hour_utc)

      if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
        throw new Error('Invalid backup hour.')
      }

      return {
        organizationId: input.organizationId,
        frequency: input.frequency,
        hour_utc: hour,
      }
    },
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as any, data.organizationId)

    const { data: existing } = await context.supabase
      .from('backup_settings')
      .select('id')
      .eq('organization_id', data.organizationId)
      .limit(1)
      .maybeSingle()

    if (existing) {
      const { error } = await context.supabase
        .from('backup_settings')
        .update({
          frequency: data.frequency,
          hour_utc: data.hour_utc,
        })
        .eq('id', (existing as any).id)
        .eq('organization_id', data.organizationId)

      if (error) throw new Error(error.message)
    } else {
      const { error } = await context.supabase
        .from('backup_settings')
        .insert({
          organization_id: data.organizationId,
          frequency: data.frequency,
          hour_utc: data.hour_utc,
        })

      if (error) throw new Error(error.message)
    }

    return { ok: true }
  })

export const disconnectGoogleDrive = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { organizationId: string }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context as any, data.organizationId)

    const { disconnectDrive } = await import('./google-drive.server')
    await disconnectDrive(data.organizationId)

    return { ok: true }
  })

export const runBackupNow = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { organizationId: string }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context as any, data.organizationId)

    const { enforceRateLimit } = await import('./rate-limit.server')
    await enforceRateLimit('backup-run', context.userId, 5, 3600)

    const { runBackup } = await import('./backup.server')

    return await runBackup({
      trigger: 'manual',
      userId: context.userId,
      organizationId: data.organizationId,
    })
  })
