
CREATE TABLE IF NOT EXISTS public.organization_onboarding (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL UNIQUE,
  request_payload jsonb NOT NULL,

  organization_id uuid UNIQUE
    REFERENCES public.organizations(id)
    ON DELETE SET NULL,

  admin_full_name text NOT NULL,
  admin_email text NOT NULL,

  auth_user_id uuid
    REFERENCES auth.users(id)
    ON DELETE SET NULL,

  status text NOT NULL DEFAULT 'pending'
    CHECK (
      status IN (
        'pending',
        'organization_created',
        'auth_user_created',
        'membership_created',
        'email_sent',
        'failed'
      )
    ),

  setup_email_sent_at timestamptz,
  last_error text,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS organization_onboarding_status_idx
  ON public.organization_onboarding(status);

CREATE INDEX IF NOT EXISTS organization_onboarding_auth_user_idx
  ON public.organization_onboarding(auth_user_id);

ALTER TABLE public.organization_onboarding ENABLE ROW LEVEL SECURITY;
