-- 1. Allowlist table
CREATE TABLE public.realtime_channel_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic text NOT NULL,
  user_id uuid NULL,
  role public.app_role NULL,
  is_public boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT realtime_channel_access_target_check
    CHECK (is_public OR user_id IS NOT NULL OR role IS NOT NULL)
);

CREATE INDEX idx_rca_topic ON public.realtime_channel_access (topic);
CREATE INDEX idx_rca_user ON public.realtime_channel_access (user_id);
CREATE INDEX idx_rca_role ON public.realtime_channel_access (role);

ALTER TABLE public.realtime_channel_access ENABLE ROW LEVEL SECURITY;

CREATE POLICY "channel access readable by all"
ON public.realtime_channel_access
FOR SELECT TO authenticated, anon
USING (true);

CREATE POLICY "admins manage channel access"
ON public.realtime_channel_access
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2. Helper: can the given user join the given topic?
CREATE OR REPLACE FUNCTION public.can_access_channel(_user_id uuid, _topic text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.realtime_channel_access a
    WHERE a.topic = _topic
      AND (
        a.is_public
        OR a.user_id = _user_id
        OR (a.role IS NOT NULL AND public.has_role(_user_id, a.role))
      )
  )
$$;

-- 3. Tighten realtime.messages policies to enforce the allowlist
DROP POLICY IF EXISTS "Authenticated users can read realtime messages" ON realtime.messages;
DROP POLICY IF EXISTS "Authenticated users can send realtime messages" ON realtime.messages;

CREATE POLICY "Allowlisted users can read realtime messages"
ON realtime.messages
FOR SELECT TO authenticated
USING (public.can_access_channel(auth.uid(), realtime.topic()));

CREATE POLICY "Allowlisted users can send realtime messages"
ON realtime.messages
FOR INSERT TO authenticated
WITH CHECK (public.can_access_channel(auth.uid(), realtime.topic()));

-- 4. Seed: keep the community chat working as a public channel
INSERT INTO public.realtime_channel_access (topic, is_public)
VALUES ('community', true);
