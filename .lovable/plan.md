# Fix "Google Drive connection failed (failed)"

## What the code is telling us

The word `failed` is the app's catch-all: Google accepted the sign-in and sent you back, but the final step on our side threw an error. That means no Google setting is at fault, and no Google variable is missing — the ones on your Vercel list (client ID, client secret, redirect URI) are all there and were used successfully to get this far.

Two things can throw at that final step:

1. The three backup tables (`google_drive_credentials`, `backup_settings`, `backup_history`) were created in the development database, but may not exist in the live `abjad-erp-live` database. Saving the connection then fails.
2. Google returned no long-term permission because the account had already approved the app before. In that case it must be removed from the account's app permissions and connected again.

Right now the page hides which one it is, so the first job is to stop swallowing the message.

## Plan

1. Show the real reason instead of the word "failed": pass a short, safe error message back to the Backups page and display it in the toast, and log the full detail on the server.
2. Check the live database for the three backup tables. If they are missing, apply the same migration there (tables, grants, row-level security, admin-only policies) — no changes to existing ERP tables.
3. Add a clear message for the "no long-term permission" case telling you to remove ABJAD ERP from the backup account's Google permissions page and press Connect again.
4. Reconnect on the live site and confirm the page flips to Connected, then run "Back up now" once to confirm the ZIP lands in the "ABJAD ERP Backups" folder.

## Technical notes

- Files touched: `src/routes/api/google-drive/callback.ts` (forward `reason` in the redirect query), `src/routes/_authenticated/backups.tsx` (render the reason), `src/lib/google-drive.server.ts` (clearer thrown messages only).
- Reason strings stay generic; no token, secret, or database detail is ever put in a URL or shown in the browser.
- Migration for the live project, only if the tables are absent — `CREATE TABLE` + `GRANT ... TO service_role` + `ENABLE ROW LEVEL SECURITY` + admin-read policies for settings/history; credentials table stays service-role only.
- No schema changes to invoices or any existing table.
