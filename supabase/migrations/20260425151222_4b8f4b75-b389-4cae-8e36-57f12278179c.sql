-- Enable RLS on realtime.messages (controls who can subscribe to Realtime channels)
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

-- Allow only authenticated users to subscribe / receive broadcasts / presence
CREATE POLICY "Authenticated users can read realtime messages"
ON realtime.messages
FOR SELECT
TO authenticated
USING (true);

-- Allow only authenticated users to send broadcast / presence messages
CREATE POLICY "Authenticated users can send realtime messages"
ON realtime.messages
FOR INSERT
TO authenticated
WITH CHECK (true);
