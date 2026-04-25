-- Allow anonymous visitors to subscribe to public-allowlisted Realtime channels
CREATE POLICY "Anon can read public realtime channels"
ON realtime.messages
FOR SELECT
TO anon
USING (
  EXISTS (
    SELECT 1 FROM public.realtime_channel_access a
    WHERE a.topic = realtime.topic() AND a.is_public = true
  )
);

CREATE POLICY "Anon can send to public realtime channels"
ON realtime.messages
FOR INSERT
TO anon
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.realtime_channel_access a
    WHERE a.topic = realtime.topic() AND a.is_public = true
  )
);