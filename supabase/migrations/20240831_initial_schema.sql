-- AI Workshop Switzerland Database Schema for Supabase
-- Run this in your Supabase SQL editor to create all required tables

-- Enable UUID extension (usually enabled by default in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    phone VARCHAR(50),
    message TEXT NOT NULL,
    service VARCHAR(255),
    form_type VARCHAR(50) NOT NULL CHECK (form_type IN ('contact_page', 'contact_section')),
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brochure download requests
CREATE TABLE IF NOT EXISTS brochure_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    position VARCHAR(255),
    team_size VARCHAR(100),
    city VARCHAR(255),
    industry VARCHAR(255),
    specific_interests TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workshop bookings
CREATE TABLE IF NOT EXISTS workshop_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    phone VARCHAR(50),
    position VARCHAR(255),
    team_size INTEGER,
    workshop_type VARCHAR(100) NOT NULL,
    preferred_date DATE,
    preferred_time VARCHAR(50),
    language VARCHAR(10) NOT NULL CHECK (language IN ('en', 'fr', 'de', 'it')),
    location_preference VARCHAR(100),
    message TEXT,
    budget_range VARCHAR(100),
    additional_info JSONB,
    ip_address TEXT,
    user_agent TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exercise responses  
CREATE TABLE IF NOT EXISTS exercise_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exercise_type VARCHAR(100) NOT NULL CHECK (exercise_type IN ('ai-tasks', 'future-planning', 'tool-sharing', 'assessment')),
    user_session_id VARCHAR(255),
    email VARCHAR(255),
    responses JSONB NOT NULL,
    completion_status VARCHAR(50) DEFAULT 'in_progress' CHECK (completion_status IN ('in_progress', 'completed', 'abandoned')),
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    time_spent_minutes INTEGER DEFAULT 0,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email subscribers (for newsletters, updates)
CREATE TABLE IF NOT EXISTS email_subscribers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    company VARCHAR(255),
    subscription_source VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    preferences JSONB,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics and tracking
CREATE TABLE IF NOT EXISTS page_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_path VARCHAR(500) NOT NULL,
    referrer VARCHAR(500),
    user_session_id VARCHAR(255),
    ip_address TEXT,
    user_agent TEXT,
    device_type VARCHAR(50),
    browser VARCHAR(100),
    country VARCHAR(100),
    city VARCHAR(100),
    visit_duration_seconds INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_form_type ON contact_submissions(form_type);

CREATE INDEX IF NOT EXISTS idx_brochure_requests_email ON brochure_requests(email);
CREATE INDEX IF NOT EXISTS idx_brochure_requests_created_at ON brochure_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_brochure_requests_company ON brochure_requests(company);

CREATE INDEX IF NOT EXISTS idx_workshop_bookings_email ON workshop_bookings(email);
CREATE INDEX IF NOT EXISTS idx_workshop_bookings_created_at ON workshop_bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_workshop_bookings_status ON workshop_bookings(status);
CREATE INDEX IF NOT EXISTS idx_workshop_bookings_workshop_type ON workshop_bookings(workshop_type);

CREATE INDEX IF NOT EXISTS idx_exercise_responses_exercise_type ON exercise_responses(exercise_type);
CREATE INDEX IF NOT EXISTS idx_exercise_responses_user_session_id ON exercise_responses(user_session_id);
CREATE INDEX IF NOT EXISTS idx_exercise_responses_created_at ON exercise_responses(created_at);
CREATE INDEX IF NOT EXISTS idx_exercise_responses_completion_status ON exercise_responses(completion_status);

CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_is_active ON email_subscribers(is_active);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_source ON email_subscribers(subscription_source);

CREATE INDEX IF NOT EXISTS idx_page_analytics_page_path ON page_analytics(page_path);
CREATE INDEX IF NOT EXISTS idx_page_analytics_created_at ON page_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_page_analytics_user_session_id ON page_analytics(user_session_id);

-- Function for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_contact_submissions_updated_at ON contact_submissions;
CREATE TRIGGER update_contact_submissions_updated_at 
    BEFORE UPDATE ON contact_submissions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_brochure_requests_updated_at ON brochure_requests;
CREATE TRIGGER update_brochure_requests_updated_at 
    BEFORE UPDATE ON brochure_requests 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_workshop_bookings_updated_at ON workshop_bookings;
CREATE TRIGGER update_workshop_bookings_updated_at 
    BEFORE UPDATE ON workshop_bookings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_exercise_responses_updated_at ON exercise_responses;
CREATE TRIGGER update_exercise_responses_updated_at 
    BEFORE UPDATE ON exercise_responses 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_email_subscribers_updated_at ON email_subscribers;
CREATE TRIGGER update_email_subscribers_updated_at 
    BEFORE UPDATE ON email_subscribers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
-- Enable RLS on all tables
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE brochure_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_analytics ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for form submissions
CREATE POLICY "Allow anonymous insert on contact_submissions" ON contact_submissions
    FOR INSERT 
    TO anon
    WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on brochure_requests" ON brochure_requests
    FOR INSERT 
    TO anon
    WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on workshop_bookings" ON workshop_bookings
    FOR INSERT 
    TO anon
    WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on exercise_responses" ON exercise_responses
    FOR INSERT 
    TO anon
    WITH CHECK (true);

CREATE POLICY "Allow anonymous upsert on exercise_responses" ON exercise_responses
    FOR UPDATE 
    TO anon
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow anonymous select on exercise_responses" ON exercise_responses
    FOR SELECT 
    TO anon
    USING (true);

CREATE POLICY "Allow anonymous insert on email_subscribers" ON email_subscribers
    FOR INSERT 
    TO anon
    WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on page_analytics" ON page_analytics
    FOR INSERT 
    TO anon
    WITH CHECK (true);

-- Admin access policies (you can customize this based on your admin authentication)
-- For now, allowing authenticated users full access - you may want to restrict this further
CREATE POLICY "Allow authenticated full access on contact_submissions" ON contact_submissions
    FOR ALL 
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated full access on brochure_requests" ON brochure_requests
    FOR ALL 
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated full access on workshop_bookings" ON workshop_bookings
    FOR ALL 
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated full access on exercise_responses" ON exercise_responses
    FOR ALL 
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated full access on email_subscribers" ON email_subscribers
    FOR ALL 
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated full access on page_analytics" ON page_analytics
    FOR ALL 
    TO authenticated
    USING (true)
    WITH CHECK (true);
