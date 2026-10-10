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
    },
  },
})
