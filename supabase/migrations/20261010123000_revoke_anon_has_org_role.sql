-- This SECURITY DEFINER helper accepts a caller-supplied user ID. Keep it
-- available to authenticated RLS policies and trusted service-role callers,
-- but do not expose organization-role probing to anonymous clients.
REVOKE ALL ON FUNCTION public.has_org_role(uuid, public.app_role, uuid)
  FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.has_org_role(uuid, public.app_role, uuid)
  TO authenticated, service_role;

DO $$
DECLARE
  target_function regprocedure :=
    'public.has_org_role(uuid, public.app_role, uuid)'::regprocedure;
BEGIN
  IF has_function_privilege('anon', target_function, 'EXECUTE') THEN
    RAISE EXCEPTION 'anon must not be able to execute public.has_org_role';
  END IF;

  IF NOT has_function_privilege('authenticated', target_function, 'EXECUTE') THEN
    RAISE EXCEPTION 'authenticated must retain execute on public.has_org_role';
  END IF;

  IF NOT has_function_privilege('service_role', target_function, 'EXECUTE') THEN
    RAISE EXCEPTION 'service_role must retain execute on public.has_org_role';
  END IF;
END;
$$;
