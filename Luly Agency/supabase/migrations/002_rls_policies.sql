-- Migration 002: Row Level Security policies
-- Enables RLS on existing tables and adds safe policies.

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- ─── LEADS policies ───────────────────────────────────────────────────────────

-- Anyone (anon) can submit a lead from the landing page
DROP POLICY IF EXISTS "anon_insert_leads" ON public.leads;
CREATE POLICY "anon_insert_leads"
  ON public.leads FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Authenticated users with admin role can read all leads
DROP POLICY IF EXISTS "admin_select_leads" ON public.leads;
CREATE POLICY "admin_select_leads"
  ON public.leads FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );

-- Admins can update leads (CRM)
DROP POLICY IF EXISTS "admin_update_leads" ON public.leads;
CREATE POLICY "admin_update_leads"
  ON public.leads FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );

-- ─── PROFILES policies ────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "users_read_own_profile" ON public.profiles;
CREATE POLICY "users_read_own_profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

DROP POLICY IF EXISTS "users_update_own_profile" ON public.profiles;
CREATE POLICY "users_update_own_profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid());

DROP POLICY IF EXISTS "admin_read_all_profiles" ON public.profiles;
CREATE POLICY "admin_read_all_profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role IN ('admin', 'staff')
    )
  );

-- ─── SERVICES policies ────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "public_read_services" ON public.services;
CREATE POLICY "public_read_services"
  ON public.services FOR SELECT
  TO anon, authenticated
  USING (is_active = true OR is_active IS NULL);

DROP POLICY IF EXISTS "admin_manage_services" ON public.services;
CREATE POLICY "admin_manage_services"
  ON public.services FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
