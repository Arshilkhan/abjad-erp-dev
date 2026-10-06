//#region node_modules/.nitro/vite/services/ssr/assets/rate-limit.server-CsurkmPq.js
/**
* Simple fixed-window rate limiter backed by the `rate_limits` table.
* Throws when the caller exceeded `limit` hits inside `windowSeconds`.
* Fails open when the privileged client is unavailable (e.g. no service-role
* key in a self-hosted deployment) so core features keep working.
*/
async function enforceRateLimit(bucket, identifier, limit, windowSeconds) {
	if (!process.env["SUPABASE_SERVICE_ROLE_KEY"] || !process.env["SUPABASE_URL"]) {
		console.warn("[rate-limit] privileged client unavailable, skipping limit check");
		return;
	}
	let supabaseAdmin;
	try {
		({supabaseAdmin} = await import("./client.server-KzwUIAkW.mjs"));
	} catch (e) {
		console.error("[rate-limit] admin client unavailable", e);
		return;
	}
	const since = (/* @__PURE__ */ new Date(Date.now() - windowSeconds * 1e3)).toISOString();
	const { count, error } = await supabaseAdmin.from("rate_limits").select("id", {
		count: "exact",
		head: true
	}).eq("bucket", bucket).eq("identifier", identifier).gte("created_at", since);
	if (error) {
		console.error("[rate-limit] lookup failed", error.message);
		return;
	}
	if ((count ?? 0) >= limit) throw new Error("Too many requests. Please wait a few minutes and try again.");
	await supabaseAdmin.from("rate_limits").insert({
		bucket,
		identifier
	});
	if (Math.random() < .05) await supabaseAdmin.from("rate_limits").delete().lt("created_at", (/* @__PURE__ */ new Date(Date.now() - 864e5)).toISOString());
}
//#endregion
export { enforceRateLimit };
