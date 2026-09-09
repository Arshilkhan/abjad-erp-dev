# Fix the failed deployment caused by the backup schedule

The deployment fails because the automatic backup is set to check every hour, and your Vercel Hobby plan only allows a once-a-day scheduled job. Any more frequent schedule is rejected at deploy time.

## Recommended workaround (no plan upgrade needed)

Switch the Vercel schedule to once a day, and let the backup itself decide whether today is a backup day.

- Change the scheduled job to run once daily (at 00:00 UTC, Vercel may fire it any time within that hour).
- The backup checker stops requiring an exact hour match. The frequency choices on the Backups page become: Off / Every 2 days / Every week / Every month. A backup runs when the job fires and the previous backup is old enough:
  - Every 2 days: run if the last backup was 40+ hours ago.
  - Every week: run if the last backup was 6.5+ days ago.
  - Every month: run if the last backup was 27+ days ago.
- On the Backups page, the "Hour (UTC)" picker becomes informational only. It will be replaced with a short note: "Automatic backups run once a day, at a time chosen by the host." The saved value is kept in the database so nothing breaks if you later move to a paid plan.
- You can still press "Back up now" at any moment for an immediate backup.

## Alternative if you want a specific time of day

Keep the hourly logic and drive it from the database scheduler in your own Supabase project (pg_cron) instead of Vercel: an hourly job calls the same backup address with the shared secret. This keeps the exact-hour setting and does not touch Vercel limits, but it needs the scheduler extension enabled and the secret stored in the database.

If you prefer this, say so and I will plan that instead.

## Technical details

- `vercel.json`: `schedule` changes from `0 * * * *` to `0 0 * * *`.
- `src/routes/api/public/backup-cron.ts`: remove the `now.getUTCHours() !== s.hour_utc` early return; keep the secret check, the `frequency === 'off'` skip, and the minimum-gap guard (thresholds: 40h / 6.5d / 27d so a drifting trigger is never skipped early). The existing `daily` setting value is relabelled "Every 2 days" in the UI and uses the 40h gap — no database change needed.
- `src/routes/_authenticated/backups.tsx`: replace the hour `Select` with static help text; `saveBackupSettings` keeps sending the stored `hour_utc` unchanged.
- No database migration, no change to the Google Drive connection, and no change to any other part of the ERP.
