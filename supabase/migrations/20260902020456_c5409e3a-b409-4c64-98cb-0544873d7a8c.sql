CREATE TABLE public.game_players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL,
  email TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.game_players TO anon;
GRANT SELECT, INSERT ON public.game_players TO authenticated;
GRANT ALL ON public.game_players TO service_role;

ALTER TABLE public.game_players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register for the game"
  ON public.game_players FOR INSERT TO anon, authenticated
  WITH CHECK (char_length(player_name) BETWEEN 1 AND 100 AND char_length(email) BETWEEN 3 AND 255);

CREATE POLICY "Admin can view game players"
  ON public.game_players FOR SELECT TO authenticated
  USING ((auth.jwt() ->> 'email') = 'andreramiers@gmail.com');