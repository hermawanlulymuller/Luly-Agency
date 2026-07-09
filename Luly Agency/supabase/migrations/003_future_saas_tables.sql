-- Migration 003: Future SaaS tables (Phase 5–10 scaffolds)
-- Creates new tables only — does not touch existing profiles/leads/services.

-- Automation runs (Phase 6)
CREATE TABLE IF NOT EXISTS public.automation_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  type text NOT NULL,
  status text DEFAULT 'pending',
  business text DEFAULT 'luly_agency',
  payload jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE public.automation_runs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_manage_automation" ON public.automation_runs;
CREATE POLICY "admin_manage_automation"
  ON public.automation_runs FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('admin', 'staff')
    )
  );

-- Subscriptions (Phase 7)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  plan text NOT NULL,
  status text DEFAULT 'active',
  business text DEFAULT 'luly_agency',
  external_id text,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_read_own_subscription" ON public.subscriptions;
CREATE POLICY "users_read_own_subscription"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Multi-business registry (Phase 10)
CREATE TABLE IF NOT EXISTS public.businesses (
  id text PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  is_active boolean DEFAULT true,
  config jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

INSERT INTO public.businesses (id, name, slug) VALUES
  ('luly_agency', 'Luly Agency', 'luly-agency'),
  ('lulyart', 'Lulyart', 'lulyart'),
  ('brigade571', 'Brigade571', 'brigade571'),
  ('luly_wallet', 'Luly Wallet', 'luly-wallet'),
  ('luly_umkm', 'Luly UMKM', 'luly-umkm')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_businesses" ON public.businesses;
CREATE POLICY "public_read_businesses"
  ON public.businesses FOR SELECT
  TO anon, authenticated
  USING (is_active = true);
