-- Google Drive connection (server-only)
CREATE TABLE public.google_drive_credentials (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account_email text,
  refresh_token text NOT NULL,
  access_token text,
  access_token_expires_at timestamptz,
  folder_id text,
  connected_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.google_drive_credentials TO service_role;
ALTER TABLE public.google_drive_credentials ENABLE ROW LEVEL SECURITY;
-- No policies: only the service-role server client may touch this table.

CREATE TRIGGER trg_gdrive_updated BEFORE UPDATE ON public.google_drive_credentials
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Backup schedule settings (single row)
CREATE TABLE public.backup_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  frequency text NOT NULL DEFAULT 'off' CHECK (frequency IN ('off','daily','weekly','monthly')),
  hour_utc integer NOT NULL DEFAULT 20 CHECK (hour_utc BETWEEN 0 AND 23),
  last_run_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.backup_settings TO authenticated;
GRANT ALL ON public.backup_settings TO service_role;
ALTER TABLE public.backup_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read backup settings" ON public.backup_settings
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins write backup settings" ON public.backup_settings
  FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE TRIGGER trg_backup_settings_updated BEFORE UPDATE ON public.backup_settings
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

INSERT INTO public.backup_settings (frequency) VALUES ('off');

-- Backup run history
CREATE TABLE public.backup_history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  status text NOT NULL DEFAULT 'running' CHECK (status IN ('running','success','failed')),
  trigger_source text NOT NULL DEFAULT 'manual',
  invoice_count integer,
  file_name text,
  file_size bigint,
  drive_file_id text,
  drive_link text,
  error text,
  created_by uuid REFERENCES auth.users(id)
);
GRANT SELECT ON public.backup_history TO authenticated;
GRANT ALL ON public.backup_history TO service_role;
ALTER TABLE public.backup_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read backup history" ON public.backup_history
  FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

CREATE INDEX idx_backup_history_started ON public.backup_history (started_at DESC);