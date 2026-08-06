-- 1. Remove the implicit "PUBLIC can execute" default from every function in public
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.enforce_community_display_name() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.can_access_channel(uuid, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.get_product_download_url(uuid) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.list_products() FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_access_channel(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_product_download_url(uuid) TO authenticated;

-- 2. Public catalog no longer needs elevated privileges: make it SECURITY INVOKER
CREATE OR REPLACE FUNCTION public.list_products()
RETURNS TABLE(id uuid, owner_id uuid, title text, description text, category text, price_cents integer, image_url text, created_at timestamp with time zone)
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT id, owner_id, title, description, category, price_cents, image_url, created_at
  FROM public.products
  ORDER BY created_at DESC;
$$;

REVOKE ALL ON FUNCTION public.list_products() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_products() TO anon, authenticated, service_role;

-- 3. Catalog readable, but download_url is not selectable by API roles
CREATE POLICY "catalog readable by all"
ON public.products FOR SELECT TO anon, authenticated USING (true);

REVOKE SELECT ON public.products FROM anon, authenticated;
GRANT SELECT (id, owner_id, title, description, category, price_cents, image_url, created_at)
  ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;