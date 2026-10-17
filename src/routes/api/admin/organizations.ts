
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

const requiredFields = [
  "companyName",
  "city",
  "pinCode",
  "state",
  "stateCode",
  "mobile",
  "email",
  "gstNumber",
  "panNumber",
  "adminFullName",
  "adminEmail",
];

export const Route = createFileRoute("/api/admin/organizations")({
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

      GET: async ({ request }) => {
        try {
          const headers = getAdminApiHeaders(request);
          await requirePlatformSuperAdmin(request);

          const { supabaseAdmin } = await import(
            "@/integrations/supabase/client.server"
          );

          const { data, error } = await supabaseAdmin
            .from("organizations")
            .select("id, name, slug, status, created_at, updated_at")
            .order("created_at", { ascending: false });

          if (error) throw new Error("Could not load organizations");

          return Response.json({ organizations: data ?? [] }, { headers });
        } catch (error) {
          return apiErrorResponse(request, error);
        }
      },

      POST: async ({ request }) => {
        try {
          const headers = getAdminApiHeaders(request);
          await requirePlatformSuperAdmin(request);

          if (!request.headers.get("content-type")?.includes("application/json")) {
            return Response.json(
              { error: "Content-Type must be application/json" },
              { status: 415, headers },
            );
          }

          let body: unknown;
          try {
            body = await request.json();
          } catch {
            throw new PlatformAdminApiError("Invalid request body", 400);
          }

          if (!body || typeof body !== "object" || Array.isArray(body)) {
            throw new PlatformAdminApiError("Invalid request body", 400);
          }

          const input = body as Record<string, unknown>;

          if (
            typeof input.requestId !== "string" ||
            !UUID_PATTERN.test(input.requestId)
          ) {
            throw new PlatformAdminApiError("A valid requestId UUID is required", 400);
          }

          const value = (field: string) =>
            typeof input[field] === "string"
              ? (input[field] as string).trim()
              : "";

          for (const field of requiredFields) {
            if (!value(field)) {
              throw new PlatformAdminApiError(`${field} is required`, 400);
            }
          }

          const companyEmail = value("email").toLowerCase();
          const adminEmail = value("adminEmail").toLowerCase();
          const adminFullName = value("adminFullName");

          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

          if (!emailPattern.test(companyEmail)) {
            throw new PlatformAdminApiError(
              "Enter a valid company contact email",
              400,
            );
          }

          if (!emailPattern.test(adminEmail)) {
            throw new PlatformAdminApiError(
              "Enter a valid administrator login email",
              400,
            );
          }

          if (adminFullName.length > 150) {
            throw new PlatformAdminApiError(
              "Administrator name must be 150 characters or fewer",
              400,
            );
          }

          const companyName = value("companyName");
          const slugBase =
            companyName
              .toLowerCase()
              .normalize("NFKD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "") || "organization";

          const normalized = {
            companyName,
            website: value("website"),
            address: value("address"),
            city: value("city"),
            pinCode: value("pinCode"),
            state: value("state"),
            stateCode: value("stateCode"),
            mobile: value("mobile"),
            altMobile: value("altMobile"),
            email: companyEmail,
            gstNumber: value("gstNumber"),
            panNumber: value("panNumber"),
            bankName: value("bankName"),
            branch: value("branch"),
            accountNumber: value("accountNumber"),
            ifscCode: value("ifscCode"),
            adminFullName,
            adminEmail,
          };

          const profile = {
            website: normalized.website,
            address: normalized.address,
            city: normalized.city,
            pincode: normalized.pinCode,
            state: normalized.state,
            state_code: normalized.stateCode,
            mobile: normalized.mobile,
            alt_mobile: normalized.altMobile,
            email: normalized.email,
            gst_number: normalized.gstNumber,
            pan_number: normalized.panNumber,
            bank_name: normalized.bankName,
            bank_branch: normalized.branch,
            bank_account: normalized.accountNumber,
            bank_ifsc: normalized.ifscCode,
          };

          const { supabaseAdmin } = await import(
            "@/integrations/supabase/client.server"
          );

          let rpcResult: any = null;
          let rpcError: any = null;

          // A slug collision rolls back the RPC transaction, so it is safe
          // to retry that transaction with another slug.
          for (let attempt = 0; attempt < 5; attempt++) {
            const slug =
              attempt === 0
                ? slugBase
                : `${slugBase}-${crypto.randomUUID().slice(0, 8)}`;

            const result = await (supabaseAdmin as any).rpc(
              "create_organization_onboarding",
              {
                p_request_id: input.requestId,
                p_request_payload: normalized,
                p_admin_full_name: adminFullName,
                p_admin_email: adminEmail,
                p_organization_name: companyName,
                p_slug: slug,
                p_company_profile: profile,
              },
            );

            rpcResult = result.data;
            rpcError = result.error;

            if (!rpcError) break;

            if (rpcError.code === "23505") continue;

            if (rpcError.code === "22023") {
              throw new PlatformAdminApiError(
                "The request ID was reused with different data or the request is invalid.",
                409,
              );
            }

            console.error("[organization-onboarding] Database operation failed");
            throw new Error("Could not initialize organization onboarding");
          }

          if (rpcError || !rpcResult?.organization_id) {
            throw new Error("Could not create organization");
          }

          const organizationId = String(rpcResult.organization_id);

          const { data: organization, error: orgError } = await supabaseAdmin
            .from("organizations")
            .select("id, name, slug, status")
            .eq("id", organizationId)
            .single();

          if (orgError || !organization) {
            throw new Error("Could not load created organization");
          }

          const provisionResult = await provisionOrganizationOnboarding(
            organizationId,
            input.requestId,
          );

          const status = rpcResult.existing ? 200 : 201;

          return Response.json(
            {
              organization,
              onboarding: {
                status: provisionResult.status,
                emailSent: provisionResult.status === "email_sent",
              },
            },
            { status, headers },
          );
        } catch (error) {
          return apiErrorResponse(request, error);
        }
      },
    },
  },
});
