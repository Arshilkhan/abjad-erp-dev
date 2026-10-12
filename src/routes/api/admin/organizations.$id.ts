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
            Object.keys(body).length !== 1
          ) {
            throw new PlatformAdminApiError(
              'Provide exactly one supported field: status or name',
              400,
            )
          }

          const input = body as Record<string, unknown>
          const { supabaseAdmin } = await import(
            '@/integrations/supabase/client.server'
          )

          let update: { status?: 'active' | 'suspended' | 'cancelled'; name?: string }

          if ('status' in input) {
            if (
              typeof input.status !== 'string' ||
              !['active', 'suspended', 'cancelled'].includes(input.status)
            ) {
              throw new PlatformAdminApiError(
                'Status must be active, suspended, or cancelled',
                400,
              )
            }

            update = {
              status: input.status as 'active' | 'suspended' | 'cancelled',
            }
          } else if ('name' in input) {
            if (
              typeof input.name !== 'string' ||
              !input.name.trim() ||
              input.name.trim().length > 150
            ) {
              throw new PlatformAdminApiError(
                'Organization name must be between 1 and 150 characters',
                400,
              )
            }

            update = { name: input.name.trim() }
          } else {
            throw new PlatformAdminApiError(
              'Only status or name updates are supported',
              400,
            )
          }

          const { data, error } = await supabaseAdmin
            .from('organizations')
            .update({ ...update, updated_at: new Date().toISOString() })
            .eq('id', params.id)
            .select('id, name, slug, status, created_at, updated_at')
            .maybeSingle()

          if (error) {
            throw new Error('Could not update organization')
          }

          if (!data) {
            throw new PlatformAdminApiError('Organization not found', 404)
          }

          return Response.json({ organization: data }, { headers })
        } catch (error) {
          return apiErrorResponse(request, error)
        }
      },

    },
  },
})
