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
      POST: async ({ request }) => {
        let organizationId: string | undefined

        try {
          const headers = getAdminApiHeaders(request)
          await requirePlatformSuperAdmin(request)

          if (!request.headers.get('content-type')?.includes('application/json')) {
            return Response.json(
              { error: 'Content-Type must be application/json' },
              { status: 415, headers },
            )
          }

          const body: unknown = await request.json()

          if (!body || typeof body !== 'object' || Array.isArray(body)) {
            return Response.json(
              { error: 'Invalid request body' },
              { status: 400, headers },
            )
          }

          const input = body as Record<string, unknown>
          const requiredFields = [
            'companyName',
            'city',
            'pinCode',
            'state',
            'stateCode',
            'mobile',
            'email',
            'gstNumber',
            'panNumber',
          ]

          for (const field of requiredFields) {
            if (
              typeof input[field] !== 'string' ||
              !(input[field] as string).trim()
            ) {
              return Response.json(
                { error: `${field} is required` },
                { status: 400, headers },
              )
            }
          }

          const value = (field: string) =>
            typeof input[field] === 'string'
              ? (input[field] as string).trim() || null
              : null

          const companyName = value('companyName')!

          const email = value('email')!
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return Response.json(
              { error: 'Enter a valid email address' },
              { status: 400, headers },
            )
          }

          const slugBase =
            companyName
              .toLowerCase()
              .normalize('NFKD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '') || 'organization'

          const { supabaseAdmin } = await import(
            '@/integrations/supabase/client.server'
          )

          // Retry with a suffix if the organization slug already exists.
          let organization: { id: string; slug: string } | null = null

          for (let attempt = 0; attempt < 5; attempt++) {
            const slug =
              attempt === 0
                ? slugBase
                : `${slugBase}-${crypto.randomUUID().slice(0, 8)}`

            const { data, error } = await supabaseAdmin
              .from('organizations')
              .insert({
                name: companyName,
                slug,
                status: 'active',
              })
              .select('id, slug')
              .single()

            if (!error && data) {
              organization = data
              organizationId = data.id
              break
            }

            // Retry only when the unique slug constraint caused the failure.
            if (error?.code !== '23505') {
              throw new Error('Could not create organization')
            }
          }

          if (!organization || !organizationId) {
            throw new Error('Could not generate a unique organization slug')
          }

          const { error: profileError } = await supabaseAdmin
            .from('company_profile')
            .insert({
              organization_id: organizationId,
              name: companyName,
              website: value('website'),
              address: value('address'),
              city: value('city'),
              pincode: value('pinCode'),
              state: value('state'),
              state_code: value('stateCode'),
              mobile: value('mobile'),
              alt_mobile: value('altMobile'),
              email,
              gst_number: value('gstNumber'),
              pan_number: value('panNumber'),
              bank_name: value('bankName'),
              bank_branch: value('branch'),
              bank_account: value('accountNumber'),
              bank_ifsc: value('ifscCode'),
            })

          if (profileError) {
            // Compensate for the failed second insert.
            const { error: rollbackError } = await supabaseAdmin
              .from('organizations')
              .delete()
              .eq('id', organizationId)

            if (rollbackError) {
              console.error(
                '[organization-create] Rollback failed for organization:',
                organizationId,
              )
            }

            throw new Error('Could not save company profile')
          }

          return Response.json(
            {
              organization: {
                id: organization.id,
                name: companyName,
                slug: organization.slug,
                status: 'active',
              },
            },
            { status: 201, headers },
          )
        } catch (error) {
          return apiErrorResponse(request, error)
        }
      },
    },
  },
})
