-- Migration 001: Safely extend existing tables (profiles, leads, services)
-- Does NOT recreate tables. Uses IF NOT EXISTS / conditional adds only.

-- ─── LEADS extensions ───────────────────────────────────────────────────────
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS whatsapp text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS service text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS message text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS source text DEFAULT 'landing_page';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS status text DEFAULT 'new';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS business text DEFAULT 'luly_agency';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS assigned_to uuid REFERENCES auth.users(id);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- ─── PROFILES extensions ──────────────────────────────────────────────────────
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS whatsapp text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS business text DEFAULT 'luly_agency';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- ─── SERVICES extensions ────────────────────────────────────────────────────────
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS business text DEFAULT 'luly_agency';
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS price_label text;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- ─── Auto-create profile on signup ─────────────────────────────────────────────
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
    'user',
    'luly_agency'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── Updated_at trigger ───────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS leads_updated_at ON public.leads;
CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
