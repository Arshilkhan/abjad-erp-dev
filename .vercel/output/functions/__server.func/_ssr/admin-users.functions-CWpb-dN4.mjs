import { r as createServerFn } from "./server-CLqueqhS.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BBJ7eSG_.mjs";
import { t as createServerRpc } from "./createServerRpc-Bi8PNwoH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-users.functions-CWpb-dN4.js
async function assertAdmin(context) {
	const [sa, a] = await Promise.all([context.supabase.rpc("has_role", {
		_user_id: context.userId,
		_role: "super_admin"
	}), context.supabase.rpc("has_role", {
		_user_id: context.userId,
		_role: "admin"
	})]);
	if (!sa.data && !a.data) throw new Error("Forbidden: admin access required");
}
var listAppUsers_createServerFn_handler = createServerRpc({
	id: "18a52846064de54c02432e991eea4ab62b183a1fc1a48d39461c93e573f06611",
	name: "listAppUsers",
	filename: "src/lib/admin-users.functions.ts"
}, (opts) => listAppUsers.__executeServer(opts));
var listAppUsers = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(listAppUsers_createServerFn_handler, async ({ context }) => {
	await assertAdmin(context);
	const { supabase } = context;
	const [{ data: profiles }, { data: roles }, { data: perms }] = await Promise.all([
		supabase.from("profiles").select("id, full_name, email, created_at").order("created_at"),
		supabase.from("user_roles").select("user_id, role"),
		supabase.from("user_panel_permissions").select("user_id, panel")
	]);
	return (profiles ?? []).map((p) => ({
		id: p.id,
		full_name: p.full_name,
		email: p.email,
		created_at: p.created_at,
		roles: (roles ?? []).filter((r) => r.user_id === p.id).map((r) => r.role),
		panels: (perms ?? []).filter((r) => r.user_id === p.id).map((r) => r.panel)
	}));
});
var createAppUser_createServerFn_handler = createServerRpc({
	id: "7b8416df0fd9a1185a3b3b6c3d25ed708f1df63619f4a7ca60cd46eb64a2b574",
	name: "createAppUser",
	filename: "src/lib/admin-users.functions.ts"
}, (opts) => createAppUser.__executeServer(opts));
var createAppUser = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (!input.email?.includes("@")) throw new Error("Valid email required");
	if (!input.password || input.password.length < 8) throw new Error("Password must be at least 8 characters");
	return input;
}).handler(createAppUser_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context);
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
		email: data.email,
		password: data.password,
		email_confirm: true,
		user_metadata: { full_name: data.fullName || data.email }
	});
	if (error) throw new Error(error.message);
	const uid = created.user.id;
	await supabaseAdmin.from("profiles").upsert({
		id: uid,
		email: data.email,
		full_name: data.fullName || data.email
	});
	await supabaseAdmin.from("user_roles").upsert({
		user_id: uid,
		role: "viewer"
	}, { onConflict: "user_id,role" });
	if (data.panels.length) await supabaseAdmin.from("user_panel_permissions").insert(data.panels.map((panel) => ({
		user_id: uid,
		panel
	})));
	return { id: uid };
});
var setUserPanels_createServerFn_handler = createServerRpc({
	id: "9d6bea1cdb986fde31b1304b57fac68d867957f36203da9e477eeb7a78160b81",
	name: "setUserPanels",
	filename: "src/lib/admin-users.functions.ts"
}, (opts) => setUserPanels.__executeServer(opts));
var setUserPanels = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(setUserPanels_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context);
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	await supabaseAdmin.from("user_panel_permissions").delete().eq("user_id", data.userId);
	if (data.panels.length) await supabaseAdmin.from("user_panel_permissions").insert(data.panels.map((panel) => ({
		user_id: data.userId,
		panel
	})));
	return { ok: true };
});
var deleteAppUser_createServerFn_handler = createServerRpc({
	id: "5cae714715f87171e2dbb8b1145a1dc86bf08436993e0fe73a425c03bd929f59",
	name: "deleteAppUser",
	filename: "src/lib/admin-users.functions.ts"
}, (opts) => deleteAppUser.__executeServer(opts));
var deleteAppUser = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => input).handler(deleteAppUser_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context);
	if (data.userId === context.userId) throw new Error("You cannot delete your own account");
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	const { error } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
	if (error) throw new Error(error.message);
	return { ok: true };
});
//#endregion
export { createAppUser_createServerFn_handler, deleteAppUser_createServerFn_handler, listAppUsers_createServerFn_handler, setUserPanels_createServerFn_handler };
