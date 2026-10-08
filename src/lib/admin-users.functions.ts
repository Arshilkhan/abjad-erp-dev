import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(
  context: { supabase: any; userId: string },
  organizationId: string,
) {
  const { data, error } = await context.supabase.rpc("is_org_admin", {
    _organization_id: organizationId,
    _user_id: context.userId,
  });

  if (error || !data) {
    throw new Error("Forbidden: organization admin access required");
  }
}

export const listAppUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { organizationId: string }) => input)
  .handler(async ({ data, context }) => {
    await assertAdmin(context as any, data.organizationId);

    const { supabase } = context;

    const [{ data: profiles }, { data: members }, { data: perms }] =
      await Promise.all([
        supabase
          .from("profiles")
          .select("id, full_name, email, created_at")
          .order("created_at"),

        supabase
          .from("organization_members")
          .select("user_id, role")
          .eq("organization_id", data.organizationId),

        supabase
          .from("user_panel_permissions")
          .select("user_id, panel")
          .eq("organization_id", data.organizationId),
      ]);

    return (profiles ?? [])
      .filter((p) => (members ?? []).some((m) => m.user_id === p.id))
      .map((p) => ({
        id: p.id,
        full_name: p.full_name,
        email: p.email,
        created_at: p.created_at,
        roles: (members ?? [])
          .filter((m) => m.user_id === p.id)
          .map((m) => m.role as string),
        panels: (perms ?? [])
          .filter((r) => r.user_id === p.id)
          .map((r) => r.panel as string),
      }));
  });

export const createAppUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      organizationId: string;
      email: string;
      password: string;
      fullName: string;
      panels: string[];
    }) => {
      if (!input.email?.includes("@")) {
        throw new Error("Valid email required");
      }

      if (!input.password || input.password.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }

      return input;
    },
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as any, data.organizationId);

    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    const { data: created, error } =
      await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
        user_metadata: {
          full_name: data.fullName || data.email,
        },
      });

    if (error) throw new Error(error.message);

    const uid = created.user!.id;

    await supabaseAdmin.from("profiles").upsert({
      id: uid,
      email: data.email,
      full_name: data.fullName || data.email,
    });

    await supabaseAdmin.from("organization_members").upsert(
      {
        user_id: uid,
        organization_id: data.organizationId,
        role: "viewer",
      },
      {
        onConflict: "user_id,organization_id",
      },
    );

    if (data.panels.length) {
      await supabaseAdmin.from("user_panel_permissions").insert(
        data.panels.map((panel) => ({
          user_id: uid,
          organization_id: data.organizationId,
          panel,
        })),
      );
    }

    return { id: uid };
  });

export const setUserPanels = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      organizationId: string;
      userId: string;
      panels: string[];
    }) => input,
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as any, data.organizationId);

    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    await supabaseAdmin
      .from("user_panel_permissions")
      .delete()
      .eq("user_id", data.userId)
      .eq("organization_id", data.organizationId);

    if (data.panels.length) {
      await supabaseAdmin.from("user_panel_permissions").insert(
        data.panels.map((panel) => ({
          user_id: data.userId,
          organization_id: data.organizationId,
          panel,
        })),
      );
    }

    return { ok: true };
  });

export const deleteAppUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: { organizationId: string; userId: string }) => input,
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as any, data.organizationId);

    if (data.userId === context.userId) {
      throw new Error("You cannot delete your own account");
    }

    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    await supabaseAdmin
      .from("organization_members")
      .delete()
      .eq("user_id", data.userId)
      .eq("organization_id", data.organizationId);

    await supabaseAdmin
      .from("user_panel_permissions")
      .delete()
      .eq("user_id", data.userId)
      .eq("organization_id", data.organizationId);

    return { ok: true };
  });
