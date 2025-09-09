import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.')
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database table names
export const TABLES = {
  CONTACT_SUBMISSIONS: 'contact_submissions',
  WORKSHOP_BOOKINGS: 'workshop_bookings',
  BROCHURE_REQUESTS: 'brochure_requests',
  EXERCISE_RESPONSES: 'exercise_responses',
  EMAIL_SUBSCRIBERS: 'email_subscribers',
  PAGE_ANALYTICS: 'page_analytics',
  LEARNING_PROGRESS: 'learning_progress',
} as const

// TypeScript interfaces for database tables
export interface ContactSubmission {
  id?: string
  name: string
  email: string
  company?: string
  phone?: string
  message: string
  service?: string
  form_type: 'contact_page' | 'contact_section'
  ip_address?: string
  user_agent?: string
  created_at?: string
  updated_at?: string
}

export interface WorkshopBooking {
  id?: string
  first_name: string
  last_name: string
  email: string
  company?: string
  phone?: string
  position?: string
  team_size?: number
  workshop_type: string
  preferred_date?: string
  preferred_time?: string
  language: string
  location_preference?: string
  message?: string
  budget_range?: string
  additional_info?: Record<string, any>
  ip_address?: string
  user_agent?: string
  status?: 'draft' | 'pending' | 'confirmed' | 'cancelled'
  created_at?: string
  updated_at?: string
}

export interface BrochureRequest {
  id?: string
  first_name: string
  last_name: string
  email: string
  company: string
  position?: string
  team_size?: string
  city?: string
  industry?: string
  specific_interests?: string
  ip_address?: string
  user_agent?: string
  created_at?: string
  updated_at?: string
}

export interface ExerciseResponse {
  id?: string
  exercise_type: string
  user_session_id?: string
  email?: string
  responses: Record<string, any>
  completion_status?: 'in_progress' | 'completed' | 'abandoned'
  completion_percentage?: number
  time_spent_minutes?: number
  ip_address?: string
  user_agent?: string
  created_at?: string
  updated_at?: string
}

export interface EmailSubscriber {
  id?: string
  email: string
  first_name?: string
  last_name?: string
  company?: string
  subscription_source?: string
  is_active?: boolean
  preferences?: Record<string, any>
  ip_address?: string
  created_at?: string
  updated_at?: string
}

export interface PageAnalytics {
  id?: string
  page_path: string
  referrer?: string
  user_session_id?: string
  ip_address?: string
  user_agent?: string
  device_type?: string
  browser?: string
  country?: string
  city?: string
  visit_duration_seconds?: number
  created_at?: string
}

// Helper functions for client info
export const getClientInfo = () => {
  return {
    user_agent: navigator.userAgent,
    // Note: IP address will be handled server-side by Supabase functions if needed
  }
}

// Learning progress types
export interface LearningProgress {
  id?: string
  user_id?: string | null
  user_session_id?: string | null
  course_key: string
  module_key: string
  lesson_key?: string | null
  status: 'not_started' | 'in_progress' | 'completed'
  percentage: number
  started_at?: string
  completed_at?: string | null
  last_visited_at?: string
  created_at?: string
  updated_at?: string
}
