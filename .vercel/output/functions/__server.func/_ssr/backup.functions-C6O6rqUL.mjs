import { o as getRequest, r as createServerFn } from "./server-CLqueqhS.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-BBJ7eSG_.mjs";
import { t as createServerRpc } from "./createServerRpc-Bi8PNwoH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/backup.functions-C6O6rqUL.js
async function assertAdmin(context) {
	const { data, error } = await context.supabase.rpc("is_admin", { _user_id: context.userId });
	if (error) throw new Error(error.message);
	if (!data) throw new Error("Only administrators can manage backups.");
}
function originFromRequest() {
	const url = new URL(getRequest().url);
	return `${url.protocol}//${url.host}`;
}
/** Returns the Google consent URL so the browser can start the OAuth flow. */
var getGoogleDriveAuthUrl_createServerFn_handler = createServerRpc({
	id: "542bac49ba76ab09cb0065d62a06ab00cbe50264811ab2b20b6c5f92dc57cc7c",
	name: "getGoogleDriveAuthUrl",
	filename: "src/lib/backup.functions.ts"
}, (opts) => getGoogleDriveAuthUrl.__executeServer(opts));
var getGoogleDriveAuthUrl = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(getGoogleDriveAuthUrl_createServerFn_handler, async ({ context }) => {
	await assertAdmin(context);
	const { buildConsentUrl } = await import("./google-drive.server-CD-9kSxZ.mjs");
	return { url: await buildConsentUrl(originFromRequest(), context.userId) };
});
var getBackupStatus_createServerFn_handler = createServerRpc({
	id: "a654e0a991f0ac01d980ee9a5a1c08772630ad6a14d76cdbeb7effc83e137285",
	name: "getBackupStatus",
	filename: "src/lib/backup.functions.ts"
}, (opts) => getBackupStatus.__executeServer(opts));
var getBackupStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(getBackupStatus_createServerFn_handler, async ({ context }) => {
	await assertAdmin(context);
	const { getCredentials } = await import("./google-drive.server-CD-9kSxZ.mjs");
	const cred = await getCredentials();
	const [{ data: settings }, { data: history }] = await Promise.all([context.supabase.from("backup_settings").select("*").limit(1).maybeSingle(), context.supabase.from("backup_history").select("*").order("started_at", { ascending: false }).limit(20)]);
	return {
		connected: !!cred,
		accountEmail: cred?.account_email ?? null,
		settings: settings ?? null,
		history: history ?? []
	};
});
var saveBackupSettings_createServerFn_handler = createServerRpc({
	id: "bf4abba475811682a8057b5ebf678bd3a1fab8e82e6876576317d7a2aa71b1e9",
	name: "saveBackupSettings",
	filename: "src/lib/backup.functions.ts"
}, (opts) => saveBackupSettings.__executeServer(opts));
var saveBackupSettings = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((input) => {
	if (![
		"off",
		"daily",
		"weekly",
		"monthly"
	].includes(input?.frequency)) throw new Error("Invalid backup frequency.");
	const hour = Number(input.hour_utc);
	if (!Number.isInteger(hour) || hour < 0 || hour > 23) throw new Error("Invalid backup hour.");
	return {
		frequency: input.frequency,
		hour_utc: hour
	};
}).handler(saveBackupSettings_createServerFn_handler, async ({ data, context }) => {
	await assertAdmin(context);
	const { data: existing } = await context.supabase.from("backup_settings").select("id").limit(1).maybeSingle();
	if (existing) {
		const { error } = await context.supabase.from("backup_settings").update(data).eq("id", existing.id);
		if (error) throw new Error(error.message);
	} else {
		const { error } = await context.supabase.from("backup_settings").insert(data);
		if (error) throw new Error(error.message);
	}
	return { ok: true };
});
var disconnectGoogleDrive_createServerFn_handler = createServerRpc({
	id: "58f26b0f771388c458e0971fde192b1c3280fa298a10058c360853fe4215cd06",
	name: "disconnectGoogleDrive",
	filename: "src/lib/backup.functions.ts"
}, (opts) => disconnectGoogleDrive.__executeServer(opts));
var disconnectGoogleDrive = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(disconnectGoogleDrive_createServerFn_handler, async ({ context }) => {
	await assertAdmin(context);
	const { disconnectDrive } = await import("./google-drive.server-CD-9kSxZ.mjs");
	await disconnectDrive();
	return { ok: true };
});
var runBackupNow_createServerFn_handler = createServerRpc({
	id: "3ddd903848bf4ee03371baed83c1338cb47560614b318b4d506c768e9bb81ac4",
	name: "runBackupNow",
	filename: "src/lib/backup.functions.ts"
}, (opts) => runBackupNow.__executeServer(opts));
var runBackupNow = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(runBackupNow_createServerFn_handler, async ({ context }) => {
	await assertAdmin(context);
	const { enforceRateLimit } = await import("./rate-limit.server-CsurkmPq.mjs");
	await enforceRateLimit("backup-run", context.userId, 5, 3600);
	const { runBackup } = await import("./backup.server-DUAOmWO7.mjs");
	return await runBackup({
		trigger: "manual",
		userId: context.userId
	});
});
//#endregion
export { disconnectGoogleDrive_createServerFn_handler, getBackupStatus_createServerFn_handler, getGoogleDriveAuthUrl_createServerFn_handler, runBackupNow_createServerFn_handler, saveBackupSettings_createServerFn_handler };
