-- Trigger-only functions: never need direct EXECUTE by API roles
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.enforce_community_display_name() FROM anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM anon, authenticated;

-- Signed-in only helpers
REVOKE ALL ON FUNCTION public.can_access_channel(uuid, text) FROM anon;
REVOKE ALL ON FUNCTION public.get_product_download_url(uuid) FROM anon;

-- has_role is referenced by RLS policies evaluated as the calling role; keep EXECUTE
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon, authenticated;
-- Public catalog RPC stays callable
GRANT EXECUTE ON FUNCTION public.list_products() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.can_access_channel(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_product_download_url(uuid) TO authenticated;