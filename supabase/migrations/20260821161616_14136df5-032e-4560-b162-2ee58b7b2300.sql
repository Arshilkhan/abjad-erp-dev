CREATE TABLE public.user_panel_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  panel text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, panel)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_panel_permissions TO authenticated;
GRANT ALL ON public.user_panel_permissions TO service_role;

ALTER TABLE public.user_panel_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own panel permissions"
ON public.user_panel_permissions FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins manage panel permissions"
ON public.user_panel_permissions FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins read all profiles"
ON public.profiles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));