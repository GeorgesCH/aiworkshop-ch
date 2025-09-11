-- Development Estimates table for online estimator
-- Safe to run multiple times
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS development_estimates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_name TEXT,
  company TEXT,
  contact_name TEXT,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),

  -- Scope
  web_app BOOLEAN DEFAULT FALSE,
  admin_dashboard BOOLEAN DEFAULT FALSE,
  mobile_ios BOOLEAN DEFAULT FALSE,
  mobile_android BOOLEAN DEFAULT FALSE,

  -- AI Features
  ai_chat_agent BOOLEAN DEFAULT FALSE,
  rag_search BOOLEAN DEFAULT FALSE,
  analytics_dashboard BOOLEAN DEFAULT FALSE,
  supabase_auth BOOLEAN DEFAULT FALSE,
  payments BOOLEAN DEFAULT FALSE,
  file_storage BOOLEAN DEFAULT FALSE,
  api_integrations JSONB DEFAULT '[]'::jsonb,

  -- Estimate inputs
  complexity VARCHAR(20) DEFAULT 'standard' CHECK (complexity IN ('starter','standard','advanced')),
  timeline_weeks INTEGER DEFAULT 16 CHECK (timeline_weeks >= 8 AND timeline_weeks <= 52),
  languages JSONB DEFAULT '["en"]'::jsonb,

  -- Derived pricing
  price_chf INTEGER,
  price_breakdown JSONB,

  -- Meta
  notes TEXT,
  ip_address TEXT,
  user_agent TEXT,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new','contacted','archived')),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_development_estimates_email ON development_estimates(email);
CREATE INDEX IF NOT EXISTS idx_development_estimates_created_at ON development_estimates(created_at);
CREATE INDEX IF NOT EXISTS idx_development_estimates_status ON development_estimates(status);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_development_estimates_updated_at ON development_estimates;
CREATE TRIGGER update_development_estimates_updated_at
  BEFORE UPDATE ON development_estimates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE development_estimates ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (public estimator)
DROP POLICY IF EXISTS "Allow anonymous insert on development_estimates" ON development_estimates;
CREATE POLICY "Allow anonymous insert on development_estimates" ON development_estimates
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated full access (admin dashboard)
DROP POLICY IF EXISTS "Allow authenticated full access on development_estimates" ON development_estimates;
CREATE POLICY "Allow authenticated full access on development_estimates" ON development_estimates
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
