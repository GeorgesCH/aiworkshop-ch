-- Learning progress tracking for Learn Hub
CREATE TABLE IF NOT EXISTS learning_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  user_session_id TEXT,
  course_key TEXT NOT NULL DEFAULT 'learn-hub',
  module_key TEXT NOT NULL,
  lesson_key TEXT,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('not_started','in_progress','completed')),
  percentage INTEGER NOT NULL DEFAULT 0 CHECK (percentage >= 0 AND percentage <= 100),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  last_visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_learning_progress_user_id ON learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_session ON learning_progress(user_session_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_course_module ON learning_progress(course_key, module_key);
-- Ensure upsert key
CREATE UNIQUE INDEX IF NOT EXISTS uq_learning_progress_user_course_module_lesson
  ON learning_progress(user_id, course_key, module_key, lesson_key);

-- trigger to maintain updated_at
DROP TRIGGER IF EXISTS update_learning_progress_updated_at ON learning_progress;
CREATE TRIGGER update_learning_progress_updated_at
  BEFORE UPDATE ON learning_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;

-- Authenticated users can manage their own rows
DROP POLICY IF EXISTS "lp_auth_select_own" ON learning_progress;
CREATE POLICY "lp_auth_select_own" ON learning_progress
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "lp_auth_insert_own" ON learning_progress;
CREATE POLICY "lp_auth_insert_own" ON learning_progress
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "lp_auth_update_own" ON learning_progress;
CREATE POLICY "lp_auth_update_own" ON learning_progress
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Optional: allow anonymous SELECT for public analytics (similar to exercise_responses)
DROP POLICY IF EXISTS "lp_anon_select" ON learning_progress;
CREATE POLICY "lp_anon_select" ON learning_progress
  FOR SELECT TO anon
  USING (true);

-- Admin note: grant admin roles broader access via Supabase dashboard if required.
