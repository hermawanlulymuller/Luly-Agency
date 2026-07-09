-- Migration 004: Adjust role policies to check for 'admin' and 'member' instead of 'staff'
-- And change default registration role to 'member'.

-- ─── Drop existing policies that checked for staff ───
DROP POLICY IF EXISTS "admin_select_leads" ON public.leads;
DROP POLICY IF EXISTS "admin_update_leads" ON public.leads;
DROP POLICY IF EXISTS "admin_read_all_profiles" ON public.profiles;
DROP POLICY IF EXISTS "admin_manage_automation" ON public.automation_runs;

-- ─── Recreate policies checking for admin / member ───
CREATE POLICY "admin_member_select_leads"
  ON public.leads FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'member')
    )
  );

CREATE POLICY "admin_member_update_leads"
  ON public.leads FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'member')
    )
  );

CREATE POLICY "admin_member_read_all_profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'member')
    )
  );

CREATE POLICY "admin_member_manage_automation"
  ON public.automation_runs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'member')
    )
  );

-- ─── Update trigger handle_new_user default role to 'member' ───
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, whatsapp, role, business)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'whatsapp', ''),
    'member', -- default role is now 'member'
    'luly_agency'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
