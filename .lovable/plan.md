# Persistent agent access to your own Supabase project (abjad-erp-live)

## Goal
Set up a secure, reusable way for the agent to run SQL and migrations directly on your live Supabase project, similar to how the GitHub connector works.

## Important context

- Lovable does **not** offer a managed Supabase App connector like it does for GitHub.
- The workspace is currently connected to Lovable Cloud (Supabase project `uvesdhqhvaxrpsjenznd`). Your live deployment uses your own project (`abjad-erp-live`).
- The equivalent mechanism is **Lovable secrets**: your live project's URL and service-role key are stored encrypted, then read by server-side code only.

## What we'll do

1. Add two Lovable secrets through the secure form (values never pass through chat):
   - `LIVE_SUPABASE_URL` — e.g. `https://<project-ref>.supabase.co`
   - `LIVE_SUPABASE_SERVICE_ROLE_KEY` — the service-role key from your Supabase project settings
2. Create a reusable, admin-gated server function that can execute read-only or DDL SQL against `abjad-erp-live` using those secrets.
3. Run a test query (e.g. `SELECT current_database()`) to confirm the connection works.
4. Document how future migrations will be run: you approve each migration, and the agent runs it server-side against the live project instead of asking you to paste SQL.

## Security

- The service-role key stays server-only and is never exposed to the browser.
- Any migration runner will be gated behind `requireSupabaseAuth` plus your existing `is_admin` check, so only admin users in the app can trigger it.
- The key is scoped to your project; Lovable secrets are encrypted at rest.

## What this does not change

- Existing app code continues to use the Lovable Cloud backend for the workspace preview.
- Live deployment env vars in Vercel stay as they are.
- No changes to database schema or migration files until you approve a future migration.
