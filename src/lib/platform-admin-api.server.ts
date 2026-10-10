import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/integrations/supabase/types'

const jsonHeaders = {
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json; charset=utf-8',
  Vary: 'Origin',
}

export class PlatformAdminApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'PlatformAdminApiError'
  }
}

export function getAdminApiHeaders(request: Request): Headers {
  const headers = new Headers(jsonHeaders)
  const origin = request.headers.get('origin')

  if (origin) {
    const allowedOrigins = (process.env['ADMIN_ALLOWED_ORIGINS'] ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)

    if (!allowedOrigins.includes(origin)) {
      throw new PlatformAdminApiError('Origin is not allowed', 403)
    }

    headers.set('Access-Control-Allow-Origin', origin)
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
    headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type')
    headers.set('Access-Control-Max-Age', '600')
  }

  return headers
}

export function apiErrorResponse(
  request: Request,
  error: unknown,
): Response {
  let headers: Headers
  try {
    headers = getAdminApiHeaders(request)
  } catch {
    headers = new Headers(jsonHeaders)
  }

  if (error instanceof PlatformAdminApiError) {
    return Response.json({ error: error.message }, { status: error.status, headers })
  }

  console.error('[platform-admin-api]', error)
  return Response.json(
    { error: 'Internal server error' },
    { status: 500, headers },
  )
}

export async function requirePlatformSuperAdmin(request: Request): Promise<void> {
  const authorization = request.headers.get('authorization')
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1]

  if (!token || token.split('.').length !== 3) {
    throw new PlatformAdminApiError('Unauthorized', 401)
  }

  const supabaseUrl = process.env['SUPABASE_URL']
  const supabaseKey = process.env['SUPABASE_PUBLISHABLE_KEY']
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase server configuration is missing')
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token)
  const userId = claimsData?.claims?.sub
  if (claimsError || typeof userId !== 'string') {
    throw new PlatformAdminApiError('Unauthorized', 401)
  }

  const { data: isPlatformSuperAdmin, error: roleError } = await supabase.rpc(
    'has_role',
    { _user_id: userId, _role: 'super_admin' },
  )

  if (roleError) {
    throw new Error('Could not verify platform administrator role')
  }
  if (!isPlatformSuperAdmin) {
    throw new PlatformAdminApiError('Forbidden', 403)
  }

}
