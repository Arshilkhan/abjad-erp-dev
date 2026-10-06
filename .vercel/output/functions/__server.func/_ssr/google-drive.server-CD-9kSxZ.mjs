import { supabaseAdmin } from "./client.server-KzwUIAkW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/google-drive.server-CD-9kSxZ.js
/**
* Google Drive helpers for the ERP backup feature.
* Server-only: reads client credentials from process.env and the stored
* refresh token from the privileged Supabase client.
*/
var FOLDER_NAME = "ABJAD ERP Backups";
var OAUTH_SCOPE = "https://www.googleapis.com/auth/drive.file";
function googleClient() {
	const clientId = process.env["GOOGLE_CLIENT_ID"];
	const clientSecret = process.env["GOOGLE_CLIENT_SECRET"];
	if (!clientId || !clientSecret) throw new Error("Google Drive is not configured on the server (missing client ID/secret).");
	return {
		clientId,
		clientSecret
	};
}
function redirectUri(origin) {
	return process.env["GOOGLE_REDIRECT_URI"] || `${origin}/api/google-drive/callback`;
}
function stateKey() {
	const key = process.env["BACKUP_STATE_SECRET"] || process.env["SUPABASE_SERVICE_ROLE_KEY"] || process.env["GOOGLE_CLIENT_SECRET"];
	if (!key) throw new Error("Missing signing secret for the Google connection.");
	return key;
}
async function hmac(payload) {
	const enc = new TextEncoder();
	const cryptoKey = await crypto.subtle.importKey("raw", enc.encode(stateKey()), {
		name: "HMAC",
		hash: "SHA-256"
	}, false, ["sign"]);
	const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(payload));
	return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/[+/=]/g, (m) => ({
		"+": "-",
		"/": "_",
		"=": ""
	})[m]);
}
async function signState(userId) {
	const payload = `${userId}.${Date.now()}`;
	return `${payload}.${await hmac(payload)}`;
}
async function verifyState(state) {
	const parts = state.split(".");
	if (parts.length !== 3) return null;
	const [userId, ts, sig] = parts;
	if (await hmac(`${userId}.${ts}`) !== sig) return null;
	if (Date.now() - Number(ts) > 9e5) return null;
	return userId;
}
async function buildConsentUrl(origin, userId) {
	const { clientId } = googleClient();
	return `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
		client_id: clientId,
		redirect_uri: redirectUri(origin),
		response_type: "code",
		scope: OAUTH_SCOPE,
		access_type: "offline",
		prompt: "consent",
		include_granted_scopes: "true",
		state: await signState(userId)
	}).toString()}`;
}
async function tokenRequest(body) {
	const res = await fetch("https://oauth2.googleapis.com/token", {
		method: "POST",
		headers: { "content-type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams(body).toString()
	});
	const text = await res.text();
	if (!res.ok) throw new Error(`Google token request failed [${res.status}]: ${text}`);
	return JSON.parse(text);
}
function emailFromIdToken(idToken) {
	if (!idToken) return null;
	try {
		const payload = idToken.split(".")[1];
		const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
		return JSON.parse(json).email ?? null;
	} catch {
		return null;
	}
}
async function exchangeCodeAndStore(code, origin, userId) {
	const { clientId, clientSecret } = googleClient();
	const tokens = await tokenRequest({
		code,
		client_id: clientId,
		client_secret: clientSecret,
		redirect_uri: redirectUri(origin),
		grant_type: "authorization_code"
	});
	if (!tokens.refresh_token) throw new Error("Google did not return a refresh token. Remove the app from your Google account permissions and connect again.");
	await supabaseAdmin.from("google_drive_credentials").delete().neq("id", "00000000-0000-0000-0000-000000000000");
	const { error } = await supabaseAdmin.from("google_drive_credentials").insert({
		refresh_token: tokens.refresh_token,
		access_token: tokens.access_token,
		access_token_expires_at: new Date(Date.now() + (tokens.expires_in - 60) * 1e3).toISOString(),
		account_email: emailFromIdToken(tokens.id_token),
		connected_by: userId
	});
	if (error) throw new Error(error.message);
}
async function getCredentials() {
	const { data } = await supabaseAdmin.from("google_drive_credentials").select("id, refresh_token, access_token, access_token_expires_at, folder_id, account_email").limit(1).maybeSingle();
	return data ?? null;
}
async function disconnectDrive() {
	await supabaseAdmin.from("google_drive_credentials").delete().neq("id", "00000000-0000-0000-0000-000000000000");
}
async function accessToken(cred) {
	if (cred.access_token && cred.access_token_expires_at && new Date(cred.access_token_expires_at) > /* @__PURE__ */ new Date()) return cred.access_token;
	const { clientId, clientSecret } = googleClient();
	const tokens = await tokenRequest({
		client_id: clientId,
		client_secret: clientSecret,
		refresh_token: cred.refresh_token,
		grant_type: "refresh_token"
	});
	await supabaseAdmin.from("google_drive_credentials").update({
		access_token: tokens.access_token,
		access_token_expires_at: new Date(Date.now() + (tokens.expires_in - 60) * 1e3).toISOString()
	}).eq("id", cred.id);
	return tokens.access_token;
}
async function ensureFolder(cred, token) {
	if (cred.folder_id) return cred.folder_id;
	const res = await fetch("https://www.googleapis.com/drive/v3/files", {
		method: "POST",
		headers: {
			authorization: `Bearer ${token}`,
			"content-type": "application/json"
		},
		body: JSON.stringify({
			name: FOLDER_NAME,
			mimeType: "application/vnd.google-apps.folder"
		})
	});
	const text = await res.text();
	if (!res.ok) throw new Error(`Could not create the Drive folder [${res.status}]: ${text}`);
	const folderId = JSON.parse(text).id;
	await supabaseAdmin.from("google_drive_credentials").update({ folder_id: folderId }).eq("id", cred.id);
	return folderId;
}
/** Uploads a ZIP to the backup folder and returns the Drive file id + link. */
async function uploadZip(fileName, bytes) {
	const cred = await getCredentials();
	if (!cred) throw new Error("Google Drive is not connected.");
	const token = await accessToken(cred);
	const folderId = await ensureFolder(cred, token);
	const boundary = `abjad${Math.random().toString(36).slice(2)}`;
	const enc = new TextEncoder();
	const head = enc.encode(`--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n` + JSON.stringify({
		name: fileName,
		parents: [folderId]
	}) + `\r\n--${boundary}\r\nContent-Type: application/zip\r\n\r\n`);
	const tail = enc.encode(`\r\n--${boundary}--`);
	const body = new Uint8Array(head.length + bytes.length + tail.length);
	body.set(head, 0);
	body.set(bytes, head.length);
	body.set(tail, head.length + bytes.length);
	const res = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink", {
		method: "POST",
		headers: {
			authorization: `Bearer ${token}`,
			"content-type": `multipart/related; boundary=${boundary}`
		},
		body
	});
	const text = await res.text();
	if (!res.ok) throw new Error(`Drive upload failed [${res.status}]: ${text}`);
	const json = JSON.parse(text);
	return {
		id: json.id,
		link: json.webViewLink ?? `https://drive.google.com/file/d/${json.id}/view`
	};
}
//#endregion
export { buildConsentUrl, disconnectDrive, exchangeCodeAndStore, getCredentials, uploadZip, verifyState };
