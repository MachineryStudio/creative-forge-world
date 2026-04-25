INSERT INTO public.realtime_channel_access (topic, is_public)
VALUES ('visitor-map', true)
ON CONFLICT DO NOTHING;