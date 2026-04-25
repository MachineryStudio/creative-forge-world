-- Drop previous broad policies
DROP POLICY IF EXISTS "channel access readable by all" ON public.realtime_channel_access;
DROP POLICY IF EXISTS "admins manage channel access" ON public.realtime_channel_access;

-- READ: admins see everything; users see only rows that grant THEM access
CREATE POLICY "admins read all channel access"
ON public.realtime_channel_access
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "users read own effective channel access"
ON public.realtime_channel_access
FOR SELECT TO authenticated
USING (
  is_public
  OR user_id = auth.uid()
  OR (role IS NOT NULL AND public.has_role(auth.uid(), role))
);

-- WRITE: admins only, split per action for clarity
CREATE POLICY "admins insert channel access"
ON public.realtime_channel_access
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins update channel access"
ON public.realtime_channel_access
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins delete channel access"
ON public.realtime_channel_access
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
