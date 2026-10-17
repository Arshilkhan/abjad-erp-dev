
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { sendResendHtmlEmail } from "@/lib/email-templates/send-email-resend";

const db = supabaseAdmin as any;

export class OnboardingError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "OnboardingError";
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[char]!;
  });
}

async function findUserCreatedForRequest(
  email: string,
  requestId: string,
): Promise<string | null> {
  // This is an exceptional recovery path, used when Auth creation
  // succeeded but the API crashed before storing auth_user_id.
  for (let page = 1; page <= 100; page++) {
    const { data, error } = await db.auth.admin.listUsers({
      page,
      perPage: 100,
    });

    if (error) {
      throw new Error("Could not verify an existing Auth account");
    }

    const users = data?.users ?? [];
    const user = users.find(
      (candidate: any) =>
        candidate.email?.toLowerCase() === email.toLowerCase(),
    );

    if (user) {
      if (
        user.app_metadata?.organization_onboarding_request_id !== requestId
      ) {
        throw new OnboardingError(
          "This login email already belongs to another account.",
          409,
        );
      }

      return user.id;
    }

    if (users.length < 100) return null;
  }

  throw new Error("Could not safely reconcile the Auth account");
}

export async function provisionOrganizationOnboarding(
  organizationId: string,
  requestId: string,
) {
  const { data: onboarding, error: loadError } = await db
    .from("organization_onboarding")
    .select("*")
    .eq("request_id", requestId)
    .eq("organization_id", organizationId)
    .maybeSingle();

  if (loadError) throw new Error("Could not load onboarding record");

  if (!onboarding) {
    throw new OnboardingError("Onboarding record not found.", 404);
  }

  if (onboarding.status === "email_sent") {
    return { status: "email_sent", alreadyCompleted: true };
  }

  let stage = "auth_user";

  try {
    let authUserId: string | null = onboarding.auth_user_id;

    if (!authUserId) {
      const existingId = await findUserCreatedForRequest(
        onboarding.admin_email,
        requestId,
      );

      if (existingId) {
        authUserId = existingId;
      } else {
        const { data, error } = await db.auth.admin.createUser({
          email: onboarding.admin_email,
          email_confirm: true,
          app_metadata: {
            organization_onboarding_request_id: requestId,
          },
          user_metadata: {
            full_name: onboarding.admin_full_name,
          },
        });

        if (error || !data?.user?.id) {
          // Check whether another attempt created the account concurrently.
          const recoveredId = await findUserCreatedForRequest(
            onboarding.admin_email,
            requestId,
          );

          if (!recoveredId) {
            if (
              error?.code === "email_exists" ||
              /already registered|already exists/i.test(error?.message ?? "")
            ) {
              throw new OnboardingError(
                "This login email already belongs to another account.",
                409,
              );
            }

            throw new Error("Could not create the administrator account");
          }

          authUserId = recoveredId;
        } else {
          authUserId = data.user.id;
        }
      }

      const { error: saveUserError } = await db
        .from("organization_onboarding")
        .update({
          auth_user_id: authUserId,
          status: "auth_user_created",
          updated_at: new Date().toISOString(),
        })
        .eq("id", onboarding.id);

      if (saveUserError) {
        throw new Error("Could not save administrator account association");
      }
    }

    stage = "profile";

    const { error: profileError } = await db.from("profiles").upsert(
      {
        id: authUserId,
        full_name: onboarding.admin_full_name,
        email: onboarding.admin_email,
      },
      { onConflict: "id" },
    );

    if (profileError) {
      throw new Error("Could not save administrator profile");
    }

    stage = "membership";

    const { data: membership, error: membershipReadError } = await db
      .from("organization_members")
      .select("id, role")
      .eq("organization_id", organizationId)
      .eq("user_id", authUserId)
      .maybeSingle();

    if (membershipReadError) {
      throw new Error("Could not verify organization membership");
    }

    if (membership && membership.role !== "admin") {
      throw new OnboardingError(
        "The existing membership needs administrator review.",
        409,
      );
    }

    if (!membership) {
      const { error: membershipInsertError } = await db
        .from("organization_members")
        .insert({
          organization_id: organizationId,
          user_id: authUserId,
          role: "admin",
        });

      if (membershipInsertError) {
        // A concurrent request may have inserted the same membership.
        const { data: check } = await db
          .from("organization_members")
          .select("id, role")
          .eq("organization_id", organizationId)
          .eq("user_id", authUserId)
          .maybeSingle();

        if (!check || check.role !== "admin") {
          throw new Error("Could not assign organization administrator role");
        }
      }
    }

    const { error: membershipStatusError } = await db
      .from("organization_onboarding")
      .update({
        status: "membership_created",
        last_error: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", onboarding.id);

    if (membershipStatusError) {
      throw new Error("Could not update onboarding status");
    }

    stage = "email";

    const publicUrl = process.env["ERP_PUBLIC_URL"]?.replace(/\/+$/, "");
    if (!publicUrl) {
      throw new Error("ERP_PUBLIC_URL is not configured");
    }

    const { data: linkData, error: linkError } =
      await db.auth.admin.generateLink({
        type: "recovery",
        email: onboarding.admin_email,
        options: {
          redirectTo: `${publicUrl}/reset-password`,
        },
      });

    const actionLink = linkData?.properties?.action_link;

    if (linkError || !actionLink) {
      throw new Error("Could not generate password setup link");
    }

    const { data: organization, error: organizationError } = await db
      .from("organizations")
      .select("name")
      .eq("id", organizationId)
      .single();

    if (organizationError || !organization) {
      throw new Error("Could not load organization details for email");
    }

    const name = escapeHtml(onboarding.admin_full_name);
    const company = escapeHtml(organization.name);
    const email = escapeHtml(onboarding.admin_email);
    const safeLink = escapeHtml(actionLink);

    await sendResendHtmlEmail({
      to: onboarding.admin_email,
      subject: `Set up your ABJAD ERP account — ${organization.name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
          <h2>Welcome to ABJAD ERP</h2>
          <p>Hello ${name},</p>
          <p>Your administrator account for <strong>${company}</strong>
             has been created.</p>
          <p>Login email: <strong>${email}</strong></p>
          <p>
            <a href="${safeLink}"
               style="display:inline-block;padding:12px 20px;
                      background:#1d4ed8;color:#fff;text-decoration:none;
                      border-radius:6px">
              Set up your password
            </a>
          </p>
          <p>If you were not expecting this invitation, contact your platform administrator.</p>
        </div>
      `,
      text:
        `Hello ${onboarding.admin_full_name},\n\n` +
        `Your administrator account for ${organization.name} has been created.\n` +
        `Login email: ${onboarding.admin_email}\n\n` +
        `Set up your password here: ${actionLink}`,
    });

    const { error: emailStatusError } = await db
      .from("organization_onboarding")
      .update({
        status: "email_sent",
        setup_email_sent_at: new Date().toISOString(),
        last_error: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", onboarding.id);

    if (emailStatusError) {
      // The email may already have been sent. Do not blindly resend it.
      throw new Error(
        "Email was submitted, but its delivery status could not be recorded",
      );
    }

    return { status: "email_sent", alreadyCompleted: false };
  } catch (error) {
    const safeMessage =
      error instanceof OnboardingError
        ? error.message
        : `Provisioning failed during ${stage}`;

    await db
      .from("organization_onboarding")
      .update({
        status: "failed",
        last_error: safeMessage,
        updated_at: new Date().toISOString(),
      })
      .eq("id", onboarding.id);

    throw error;
  }
}
