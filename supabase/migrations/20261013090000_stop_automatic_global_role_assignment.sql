-- Keep automatic profile creation, but never assign global roles
-- based on the number of Auth users.
--
-- Platform-wide roles must be assigned explicitly by a trusted
-- platform administrator. Organization roles belong in
-- public.organization_members.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$function$;
