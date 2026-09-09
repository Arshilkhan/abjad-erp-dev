# Run the backup-tables migration directly on abjad-erp-live

## Goal
Create the three backup tables (`google_drive_credentials`, `backup_settings`, `backup_history`) in your own Supabase project (`abjad-erp-live`) so the live Backups page can save the Google Drive connection and backup history.

## How we'll do it securely

I won't ask you to paste credentials in chat. Instead:

1. You add two secrets to this Lovable project through the secure secret form:
   - `LIVE_SUPABASE_URL` — your abjad-erp-live project URL
   - `LIVE_SUPABASE_SERVICE_ROLE_KEY` — the service-role key for that project
2. I create a one-time server-side migration runner that reads those secrets and connects directly to abjad-erp-live.
3. The runner executes the same backup-tables SQL that was already prepared.
4. I verify the tables exist by querying the live database.
5. I delete the temporary runner file so the secret isn't used by any ongoing code.

## What will be created in abjad-erp-live

- `public.google_drive_credentials` — stores the Google refresh/access token and Drive folder ID. No app-user access; server-only via service role.
- `public.backup_settings` — single row for backup frequency and last run time. Readable/editable by admins.
- `public.backup_history` — record of each backup run. Readable by admins.
- GRANT statements, RLS policies, updated-at triggers, and one seed row for `backup_settings`.

## Important notes

- The existing project secrets (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) must keep pointing to the Lovable Cloud backend so the workspace preview keeps working. We'll use different names (`LIVE_*`).
- After the tables exist, go to the live Backups page, connect Google Drive with `ajkhan902@gmail.com`, and try "Back up now".
- The temporary migration runner will be removed immediately after verification.
