-- Run against DEV with `supabase db query --linked -f
-- supabase/tests/organization_access_regression.sql` after the suspension
-- migration. Every fixture change is rolled back at the end.
BEGIN;

DO $regression$
DECLARE
  actor_id uuid;
  actor_role public.app_role;
  active_org_id uuid;
  other_org_id uuid := gen_random_uuid();
  fixture_key text := 'access-regression-' || replace(gen_random_uuid()::text, '-', '');
  visible_customer_count integer;
  visible_org_status text;
  own_membership_count integer;
BEGIN
  SELECT om.user_id, om.organization_id, om.role
  INTO actor_id, active_org_id, actor_role
  FROM public.organization_members om
  JOIN public.organizations o ON o.id = om.organization_id
  WHERE o.status = 'active'
    AND om.role IN ('admin'::public.app_role, 'super_admin'::public.app_role)
  LIMIT 1;

  IF actor_id IS NULL THEN
    RAISE EXCEPTION 'Regression requires an active organization admin in DEV';
  END IF;

  INSERT INTO public.organizations (id, name, slug, status)
  VALUES (other_org_id, 'Temporary access regression fixture', fixture_key, 'active');

  INSERT INTO public.customers (organization_id, customer_name)
  VALUES
    (active_org_id, fixture_key || '-member-org'),
    (other_org_id, fixture_key || '-other-org');

  PERFORM set_config('request.jwt.claim.sub', actor_id::text, true);
  EXECUTE 'SET LOCAL ROLE authenticated';

  IF NOT public.can_access_org(active_org_id) THEN
    RAISE EXCEPTION 'Active organization member should have access';
  END IF;
  IF public.can_access_org(other_org_id) THEN
    RAISE EXCEPTION 'Member must not access a second organization without membership';
  END IF;
  IF public.is_org_admin(other_org_id) THEN
    RAISE EXCEPTION 'Organization admin status must not cross organization boundaries';
  END IF;

  SELECT count(*) INTO visible_customer_count
  FROM public.customers
  WHERE customer_name LIKE fixture_key || '%';
  IF visible_customer_count <> 1 THEN
    RAISE EXCEPTION 'Cross-organization customer read leaked or hid rows (expected 1, got %)', visible_customer_count;
  END IF;

  BEGIN
    INSERT INTO public.customers (organization_id, customer_name)
    VALUES (other_org_id, fixture_key || '-forbidden-write');
    RAISE EXCEPTION 'Cross-organization customer write unexpectedly succeeded';
  EXCEPTION WHEN insufficient_privilege THEN
    NULL;
  END;

  EXECUTE 'RESET ROLE';
  UPDATE public.organization_members SET role = 'viewer'::public.app_role
  WHERE organization_id = active_org_id AND user_id = actor_id;
  EXECUTE 'SET LOCAL ROLE authenticated';

  IF NOT public.is_org_member(active_org_id) OR public.is_org_admin(active_org_id) THEN
    RAISE EXCEPTION 'Viewer role must retain membership without organization-admin authority';
  END IF;

  EXECUTE 'RESET ROLE';
  UPDATE public.organization_members SET role = actor_role
  WHERE organization_id = active_org_id AND user_id = actor_id;
  UPDATE public.organizations SET status = 'suspended' WHERE id = active_org_id;
  EXECUTE 'SET LOCAL ROLE authenticated';

  IF public.can_access_org(active_org_id) THEN
    RAISE EXCEPTION 'Suspended organization must deny organization data access';
  END IF;
  IF public.is_org_member(active_org_id) OR public.is_org_admin(active_org_id) THEN
    RAISE EXCEPTION 'Suspended organization must deny member and admin authorization';
  END IF;
  IF public.has_org_role(active_org_id, 'super_admin'::public.app_role, actor_id)
     OR public.has_org_panel(active_org_id, 'customers', actor_id) THEN
    RAISE EXCEPTION 'Suspended organization must deny role and panel access';
  END IF;

  SELECT count(*) INTO visible_customer_count
  FROM public.customers
  WHERE customer_name LIKE fixture_key || '%';
  IF visible_customer_count <> 0 THEN
    RAISE EXCEPTION 'Suspended organization business rows remain visible (got %)', visible_customer_count;
  END IF;

  BEGIN
    INSERT INTO public.customers (organization_id, customer_name)
    VALUES (active_org_id, fixture_key || '-suspended-write');
    RAISE EXCEPTION 'Suspended organization customer write unexpectedly succeeded';
  EXCEPTION WHEN insufficient_privilege THEN
    NULL;
  END;

  SELECT status INTO visible_org_status
  FROM public.organizations WHERE id = active_org_id;
  IF visible_org_status <> 'suspended' THEN
    RAISE EXCEPTION 'Member must retain read access to suspension status';
  END IF;

  SELECT count(*) INTO own_membership_count
  FROM public.organization_members
  WHERE organization_id = active_org_id AND user_id = actor_id;
  IF own_membership_count <> 1 THEN
    RAISE EXCEPTION 'Member must retain read access to own membership status';
  END IF;

  EXECUTE 'RESET ROLE';
END;
$regression$;

ROLLBACK;
