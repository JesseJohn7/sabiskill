-- Create user_preferences table for storing user settings like dark mode preference
-- This table should be created in your Supabase database

CREATE TABLE IF NOT EXISTS user_preferences (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS user_preferences_user_id_idx ON user_preferences(user_id);

-- Enable Row Level Security
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (users can only read/write their own preferences)
CREATE POLICY "Users can view their own preferences" 
  ON user_preferences FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
  ON user_preferences FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" 
  ON user_preferences FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
