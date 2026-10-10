import { createFileRoute } from '@tanstack/react-router'
import {
  apiErrorResponse,
  getAdminApiHeaders,
  requirePlatformSuperAdmin,
} from '@/lib/platform-admin-api.server'

export const Route = createFileRoute('/api/admin/organizations')({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        try {
          return new Response(null, { status: 204, headers: getAdminApiHeaders(request) })
        } catch (error) {
          return apiErrorResponse(request, error)
        }
      },
      GET: async ({ request }) => {
        try {
          const headers = getAdminApiHeaders(request)
          await requirePlatformSuperAdmin(request)

          const { supabaseAdmin } = await import('@/integrations/supabase/client.server')
          const { data, error } = await supabaseAdmin
            .from('organizations')
            .select('id, name, slug, status, created_at, updated_at')
            .order('created_at', { ascending: false })

          if (error) throw new Error('Could not load organizations')
          return Response.json({ organizations: data ?? [] }, { headers })
        } catch (error) {
          return apiErrorResponse(request, error)
        }
      },
    },
  },
})
