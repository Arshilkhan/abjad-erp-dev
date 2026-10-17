
import { createFileRoute } from "@tanstack/react-router";
import {
  apiErrorResponse,
  getAdminApiHeaders,
  PlatformAdminApiError,
  requirePlatformSuperAdmin,
} from "@/lib/platform-admin-api.server";
import { provisionOrganizationOnboarding } from "@/lib/organization-onboarding.server";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const Route = createFileRoute(
  "/api/admin/organizations/$id/onboarding",
)({
  server: {
    handlers: {
      OPTIONS: async ({ request }) => {
        try {
          return new Response(null, {
            status: 204,
            headers: getAdminApiHeaders(request),
          });
        } catch (error) {
          return apiErrorResponse(request, error);
        }
      },

      POST: async ({ request, params }) => {
        try {
          const headers = getAdminApiHeaders(request);
          await requirePlatformSuperAdmin(request);

          if (!UUID_PATTERN.test(params.id)) {
            throw new PlatformAdminApiError("Invalid organization ID", 400);
          }

          const { supabaseAdmin } = await import(
            "@/integrations/supabase/client.server"
          );

          const { data: onboarding, error } = await (supabaseAdmin as any)
            .from("organization_onboarding")
            .select("request_id, status")
            .eq("organization_id", params.id)
            .maybeSingle();

          if (error) throw new Error("Could not load onboarding record");

          if (!onboarding) {
            throw new PlatformAdminApiError(
              "No onboarding record exists for this organization",
              404,
            );
          }

          const result = await provisionOrganizationOnboarding(
            params.id,
            onboarding.request_id,
          );

          return Response.json(
            {
              organizationId: params.id,
              onboarding: result,
            },
            { headers },
          );
        } catch (error) {
          return apiErrorResponse(request, error);
        }
      },
    },
  },
});
