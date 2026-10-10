-- Suspended organizations retain their records, but members cannot use ERP
-- business data or organization-admin operations until the organization is
-- reactivated. Members can still read their own membership and organization
-- status so the client can explain the access block. Platform administration
-- uses global role checks and service-role access, so it remains available.

CREATE OR REPLACE FUNCTION public.can_access_org(_organization_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members om
    JOIN public.organizations o ON o.id = om.organization_id
    WHERE om.organization_id = _organization_id
      AND om.user_id = auth.uid()
      AND o.status = 'active'
  );
$$;

CREATE OR REPLACE FUNCTION public.has_org_role(
  _organization_id uuid,
  _role public.app_role,
  _user_id uuid DEFAULT auth.uid()
)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members om
    JOIN public.organizations o ON o.id = om.organization_id
    WHERE om.organization_id = _organization_id
      AND om.user_id = _user_id
      AND om.role = _role
      AND o.status = 'active'
  );
$$;

CREATE OR REPLACE FUNCTION public.has_org_panel(
  _organization_id uuid,
  _panel text,
  _user_id uuid DEFAULT auth.uid()
)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members om
    JOIN public.organizations o ON o.id = om.organization_id
    WHERE om.organization_id = _organization_id
      AND om.user_id = _user_id
      AND o.status = 'active'
  )
  AND (
    public.has_org_role(_organization_id, 'super_admin'::public.app_role, _user_id)
    OR public.has_org_role(_organization_id, 'admin'::public.app_role, _user_id)
    OR EXISTS (
      SELECT 1
      FROM public.user_panel_permissions upp
      WHERE upp.organization_id = _organization_id
        AND upp.user_id = _user_id
        AND upp.panel = _panel
    )
  );
$$;

CREATE OR REPLACE FUNCTION public.is_org_admin(
  _organization_id uuid,
  _user_id uuid DEFAULT auth.uid()
)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members om
    JOIN public.organizations o ON o.id = om.organization_id
    WHERE om.organization_id = _organization_id
      AND om.user_id = _user_id
      AND om.role IN ('admin', 'super_admin')
      AND o.status = 'active'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_org_member(
  _organization_id uuid,
  _user_id uuid DEFAULT auth.uid()
)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members om
    JOIN public.organizations o ON o.id = om.organization_id
    WHERE om.organization_id = _organization_id
      AND om.user_id = _user_id
      AND o.status = 'active'
  );
$$;

DROP POLICY IF EXISTS "organization features read" ON public.organization_features;
CREATE POLICY "organization features read" ON public.organization_features
  FOR SELECT TO authenticated
  USING (public.can_access_org(organization_id));
