# Google Drive Backup for ABJAD ERP

Add a Backup section where invoices are packaged into a ZIP and uploaded to the dedicated Google Drive account, either on demand or automatically on a daily / weekly / monthly schedule, with a visible history of every backup run.

## What you will see

- A new **Backup** item in the sidebar (admin only).
- **Connect Google Drive** button. You sign in once as ajkhan902@gmail.com and approve access; the app only ever touches the folder it creates ("ABJAD ERP Backups").
- **Back up now** button that builds the ZIP and uploads it, with progress and a link to the file in Drive.
- **Automatic backup**: off / daily / weekly / monthly, plus a preferred hour.
- **History table**: date, what was included, file size, status, Drive link, error message if a run failed.

## What goes in the ZIP

- `invoices/<company>/<bill-no>.pdf` — a PDF for every invoice, quotation and challan, generated with the same renderer used for emailing and downloading.
- `data/*.csv` — plain spreadsheet exports of invoices, invoice items, customers, products, payments, purchase orders and vendors, so the numbers are readable without the app.
- `manifest.json` — timestamp, counts, app version.

Naming: `abjad-erp-backup-YYYY-MM-DD-HHmm.zip`.

## Technical plan

**Dependency:** add `fflate` (pure-JS zip, works in the Vercel/Worker runtime). No native modules.

**Database migration** (new tables in the user-owned Supabase project, with GRANTs + RLS, admin-only via `public.is_admin()`):
- `google_drive_credentials` — single row: refresh token, access token, expiry, connected account email, drive folder id. No policies for `anon`/`authenticated`; written and read only by the service-role client on the server, so the refresh token never reaches the browser.
- `backup_settings` — single row: `frequency` (off|daily|weekly|monthly), `hour_utc`, `last_run_at`, `next_run_at`.
- `backup_history` — id, started_at, finished_at, status (running|success|failed), invoice_count, file_size, drive_file_id, drive_link, error.
History and settings are readable by admins; credentials are not.

**OAuth flow** (matches the redirect URI already registered):
- `src/routes/api/google-drive/start.ts` — authenticated admin only; redirects to Google's consent screen with `scope=drive.file`, `access_type=offline`, `prompt=consent`, and a signed `state` value.
- `src/routes/api/google-drive/callback.ts` — verifies `state`, exchanges the code for tokens, stores the refresh token via the service-role client, redirects back to `/backups`.
- `src/lib/google-drive.server.ts` — refresh-token → access-token exchange with caching, folder lookup/creation, and resumable multipart upload of the ZIP.

**Backup job**
- `src/lib/backup.server.ts` — gathers rows, renders PDFs with `buildInvoicePdf`, zips with fflate, uploads, writes `backup_history`. Streams in batches so memory stays bounded.
- `src/lib/backup.functions.ts` — `runBackupNow`, `getBackupStatus`, `saveBackupSettings`, `disconnectGoogleDrive`, all behind `requireSupabaseAuth` + admin role check.

**Scheduling**
- `vercel.json` cron hitting `src/routes/api/public/backup-cron.ts` once an hour.
- The handler requires a `BACKUP_CRON_SECRET` header (stored as a Vercel env var), reads `backup_settings`, and runs the backup only when the schedule is due. Prevents double runs via `last_run_at`.

**UI**
- `src/routes/_authenticated/backups.tsx` + registration in `src/lib/panels.ts` and `src/components/app-sidebar.tsx`.

**Secrets used:** `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (already in Vercel), plus a new `BACKUP_CRON_SECRET` and `GOOGLE_REDIRECT_URI`. Nothing Google-related is exposed to browser code.

## Notes

- While the OAuth app stays in "Testing", Google's refresh token expires after 7 days, so the connection will need re-approving weekly. Publishing the app (or moving to an Internal/Workspace project) removes that limit; the UI will show a clear "reconnect" prompt if a token stops working.
- Local preview can't complete the OAuth round trip because the redirect URI points at the live domain; connecting Drive must be done once on the live site. Everything else is testable locally.
