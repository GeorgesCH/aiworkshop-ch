-- Discovery calls table for booking calendar
-- Safe to run multiple times
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS discovery_calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Contact information
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  position VARCHAR(255),
  
  -- Call scheduling
  preferred_date DATE,
  preferred_time VARCHAR(50),
  call_duration VARCHAR(20) DEFAULT '30' CHECK (call_duration IN ('15', '30', '45', '60')),
  call_type VARCHAR(20) DEFAULT 'video' CHECK (call_type IN ('video', 'phone', 'in-person')),
  timezone VARCHAR(50) DEFAULT 'Europe/Zurich',
  
  -- Company information
  company_size VARCHAR(50),
  industry VARCHAR(255),
  current_ai_usage TEXT,
  challenges TEXT,
  goals TEXT,
  budget_range VARCHAR(100),
  how_did_you_hear VARCHAR(255),
  special_requirements TEXT,
  
  -- Meta
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled')),
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_discovery_calls_email ON discovery_calls(email);
CREATE INDEX IF NOT EXISTS idx_discovery_calls_created_at ON discovery_calls(created_at);
CREATE INDEX IF NOT EXISTS idx_discovery_calls_status ON discovery_calls(status);
CREATE INDEX IF NOT EXISTS idx_discovery_calls_preferred_date ON discovery_calls(preferred_date);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_discovery_calls_updated_at ON discovery_calls;
CREATE TRIGGER update_discovery_calls_updated_at
  BEFORE UPDATE ON discovery_calls
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE discovery_calls ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (public booking)
DROP POLICY IF EXISTS "Allow anonymous insert on discovery_calls" ON discovery_calls;
CREATE POLICY "Allow anonymous insert on discovery_calls" ON discovery_calls
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated full access (admin dashboard)
DROP POLICY IF EXISTS "Allow authenticated full access on discovery_calls" ON discovery_calls;
CREATE POLICY "Allow authenticated full access on discovery_calls" ON discovery_calls
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
