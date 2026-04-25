-- Roles enum + table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer role check (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "roles readable by all"
  ON public.user_roles FOR SELECT
  USING (true);

CREATE POLICY "admins manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Radio tracks
CREATE TABLE public.radio_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  youtube_id text NOT NULL,
  mood text NOT NULL DEFAULT 'clouds',
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.radio_tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tracks readable by all"
  ON public.radio_tracks FOR SELECT
  USING (true);

CREATE POLICY "admins insert tracks"
  ON public.radio_tracks FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins update tracks"
  ON public.radio_tracks FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins delete tracks"
  ON public.radio_tracks FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_radio_tracks_position ON public.radio_tracks(position);