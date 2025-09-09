-- Fix RLS policies to allow anonymous inserts

-- Drop existing policies first
DROP POLICY IF EXISTS "Allow anonymous insert on contact_submissions" ON contact_submissions;
DROP POLICY IF EXISTS "Allow anonymous insert on workshop_bookings" ON workshop_bookings;
DROP POLICY IF EXISTS "Allow anonymous insert on brochure_requests" ON brochure_requests;
DROP POLICY IF EXISTS "Allow anonymous insert on exercise_responses" ON exercise_responses;
DROP POLICY IF EXISTS "Allow anonymous insert on email_subscribers" ON email_subscribers;
DROP POLICY IF EXISTS "Allow anonymous insert on page_analytics" ON page_analytics;

-- Drop exercise response policies that might conflict
DROP POLICY IF EXISTS "Allow anonymous upsert on exercise_responses" ON exercise_responses;
DROP POLICY IF EXISTS "Allow anonymous select on exercise_responses" ON exercise_responses;

-- Create new policies that allow anonymous inserts
CREATE POLICY "Allow anonymous insert on contact_submissions" ON contact_submissions
    FOR INSERT 
    TO anon
    WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on workshop_bookings" ON workshop_bookings
    FOR INSERT 
    TO anon
    WITH CHECK (true);

CREATE POLICY "Allow anonymous insert on brochure_requests" ON brochure_requests
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
