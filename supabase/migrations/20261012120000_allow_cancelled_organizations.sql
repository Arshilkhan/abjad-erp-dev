-- Allow platform administrators to cancel organizations without
-- physically deleting the organization or its associated records.
ALTER TABLE public.organizations
  DROP CONSTRAINT IF EXISTS organizations_status_check;

ALTER TABLE public.organizations
  ADD CONSTRAINT organizations_status_check
  CHECK (status IN ('active', 'suspended', 'cancelled'));
