import { createFileRoute } from '@tanstack/react-router'
import {
  apiErrorResponse,
  getAdminApiHeaders,
  PlatformAdminApiError,
  requirePlatformSuperAdmin,
} from '@/lib/platform-admin-api.server'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export const Route = createFileRoute('/api/admin/organizations/$id')({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        try {
          return new Response(null, { status: 204, headers: getAdminApiHeaders(request) })
        } catch (error) {
          return apiErrorResponse(request, error)
        }
      },
      GET: async ({ request, params }) => {
        try {
          const headers = getAdminApiHeaders(request)
          await requirePlatformSuperAdmin(request)

          if (!UUID_PATTERN.test(params.id)) {
            throw new PlatformAdminApiError('Invalid organization ID', 400)
          }

          const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
          const { data, error } = await supabaseAdmin
            .from('organizations')
            .select('id, name, slug, status, created_at, updated_at')
            .eq('id', params.id)
            .maybeSingle()

          if (error) throw new Error('Could not load organization')
          if (!data) throw new PlatformAdminApiError('Organization not found', 404)

          return Response.json({ organization: data }, { headers })
        } catch (error) {
          return apiErrorResponse(request, error)
        }
      },
      PATCH: async ({ request, params }) => {
        try {
          const headers = getAdminApiHeaders(request)
          await requirePlatformSuperAdmin(request)

          if (!UUID_PATTERN.test(params.id)) {
            throw new PlatformAdminApiError('Invalid organization ID', 400)
          }

          let body: unknown
          try {
            body = await request.json()
          } catch {
            throw new PlatformAdminApiError('Invalid request body', 400)
          }


          if (
            !body ||
            typeof body !== 'object' ||
            Array.isArray(body) ||
            Object.keys(body).length !== 1 ||
            !('status' in body) ||
            typeof body.status !== 'string' ||
            !['active', 'suspended', 'cancelled'].includes(body.status)
          ) {
            throw new PlatformAdminApiError(
              'Status must be active, suspended, or cancelled',
              400,
            )
          }

          const newStatus = body.status as 'active' | 'suspended' | 'cancelled'


          const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
          const { data, error } = await supabaseAdmin
            .from('organizations')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', params.id)
            .select('id, name, slug, status, created_at, updated_at')
            .maybeSingle()

          if (error) throw new Error('Could not update organization status')
          if (!data) throw new PlatformAdminApiError('Organization not found', 404)

          return Response.json({ organization: data }, { headers })
        } catch (error) {
          return apiErrorResponse(request, error)
        }
      },
    },
  },
})
