CREATE TABLE IF NOT EXISTS scheduled_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME DEFAULT '09:00',
  email_reminder BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE scheduled_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their scheduled posts"
ON scheduled_posts FOR ALL USING (auth.uid() = user_id);
