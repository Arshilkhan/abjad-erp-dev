# Add backup tables to your own database

## Why the Drive connection failed

The Google sign-in worked, but the last step saves the connection into three tables that only exist in Lovable's cloud — not in your own database (abjad-erp-live). Since your live site uses your own database, the save fails.

## Fix: run one SQL script in your database

1. Create a ready-to-run SQL file, `erp-migration/backup-tables.sql`, containing the exact table definitions for:
   - **google_drive_credentials** — stores the Google connection (server-only, not readable by any app user)
   - **backup_settings** — your backup schedule (admins can read/change)
   - **backup_history** — list of past backups (admins can read)
   - Access rules matching the rest of your ERP (admin-only via your existing `is_admin` function) and the standard updated-at triggers
2. You open your Supabase project → SQL Editor → paste the script → Run. (I can't run it for you because I don't have access to your own project — it's outside Lovable's cloud.)
3. No manual records to add — the script seeds the single settings row itself.

## After running it

- Go to the live site → Backups → Connect Google Drive → approve with ajkhan902@gmail.com.
- The connection should now save and show as connected.
- Then try "Back up now" once to confirm the ZIP lands in Google Drive.

## Technical details

- SQL is identical to the migration already applied to Lovable's cloud (`supabase/migrations/20260909112247_....sql`): 3 tables, GRANTs, RLS policies, triggers, one seed row.
- No changes to app code, and nothing else in your database is touched.
- If the connection still fails after this, the next step is to surface the real error message on the Backups page instead of "(failed)" — small follow-up change.
