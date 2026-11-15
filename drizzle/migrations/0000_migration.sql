-- Roles
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Owner allowlist: only confirmed emails on this list receive the admin role
CREATE TABLE public.owner_allowlist (
  email text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.owner_allowlist TO service_role;
ALTER TABLE public.owner_allowlist ENABLE ROW LEVEL SECURITY;
INSERT INTO public.owner_allowlist (email) VALUES ('office@chbusinessservices.pro');

CREATE OR REPLACE FUNCTION public.grant_owner_role_on_confirm()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL
     AND EXISTS (SELECT 1 FROM public.owner_allowlist a WHERE lower(a.email) = lower(NEW.email)) THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_owner_role
  AFTER INSERT OR UPDATE OF email_confirmed_at, email ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.grant_owner_role_on_confirm();

-- Inquiries
CREATE TYPE public.inquiry_status AS ENUM ('new', 'contacted', 'scheduled', 'completed', 'archived');

CREATE TABLE public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  business_name text NOT NULL,
  website text,
  message text NOT NULL,
  service_interest text[] NOT NULL DEFAULT '{}',
  source text NOT NULL DEFAULT 'website',
  status public.inquiry_status NOT NULL DEFAULT 'new',
  assigned_owner text,
  next_action text,
  internal_notes text,
  ip_hash text,
  notification_status text NOT NULL DEFAULT 'not_configured',
  notification_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX inquiries_created_at_idx ON public.inquiries (created_at DESC);
CREATE INDEX inquiries_ip_hash_idx ON public.inquiries (ip_hash, created_at DESC);
CREATE INDEX inquiries_email_idx ON public.inquiries (lower(email), created_at DESC);

GRANT SELECT, UPDATE, DELETE ON public.inquiries TO authenticated;
GRANT ALL ON public.inquiries TO service_role;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can read inquiries" ON public.inquiries
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owners can update inquiries" ON public.inquiries
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Owners can delete inquiries" ON public.inquiries
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER inquiries_set_updated_at
  BEFORE UPDATE ON public.inquiries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();