-- 1. Lock down user_roles SELECT policy
DROP POLICY IF EXISTS "roles readable by all" ON public.user_roles;

CREATE POLICY "users read own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "admins read all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 2. Prevent display_name spoofing in community_messages via BEFORE INSERT trigger
CREATE OR REPLACE FUNCTION public.enforce_community_display_name()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  profile_name text;
BEGIN
  SELECT display_name INTO profile_name
  FROM public.profiles
  WHERE id = auth.uid();

  NEW.user_id := auth.uid();
  NEW.display_name := COALESCE(profile_name, 'guest');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_community_display_name ON public.community_messages;
CREATE TRIGGER trg_enforce_community_display_name
BEFORE INSERT ON public.community_messages
FOR EACH ROW
EXECUTE FUNCTION public.enforce_community_display_name();

-- 3. Hide products.download_url from public reads via a safe view
DROP POLICY IF EXISTS "products readable by all" ON public.products;

-- Public can only read products through a view that omits download_url
CREATE POLICY "owners read own products"
ON public.products
FOR SELECT
TO authenticated
USING (auth.uid() = owner_id);

CREATE OR REPLACE VIEW public.products_public
WITH (security_invoker = true) AS
SELECT
  id,
  owner_id,
  title,
  description,
  category,
  price_cents,
  image_url,
  created_at
FROM public.products;

-- Allow public read on the safe view
GRANT SELECT ON public.products_public TO anon, authenticated;

-- Re-add a permissive SELECT policy on products that hides sensitive cols
-- We need the base table readable for the view to work with security_invoker.
-- Instead, expose a SECURITY DEFINER function for listing.
CREATE OR REPLACE FUNCTION public.list_products()
RETURNS TABLE (
  id uuid,
  owner_id uuid,
  title text,
  description text,
  category text,
  price_cents integer,
  image_url text,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, owner_id, title, description, category, price_cents, image_url, created_at
  FROM public.products
  ORDER BY created_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public.list_products() TO anon, authenticated;

-- Function for owners to retrieve their own download_url
CREATE OR REPLACE FUNCTION public.get_product_download_url(_product_id uuid)
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  url text;
  owner uuid;
BEGIN
  SELECT download_url, owner_id INTO url, owner
  FROM public.products
  WHERE id = _product_id;

  IF owner IS NULL THEN
    RETURN NULL;
  END IF;

  IF auth.uid() = owner THEN
    RETURN url;
  END IF;

  RETURN NULL;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_product_download_url(uuid) TO authenticated;