import { 
  supabase, 
  TABLES, 
  ContactSubmission, 
  WorkshopBooking, 
  BrochureRequest, 
  ExerciseResponse, 
  EmailSubscriber,
  PageAnalytics,
  LearningProgress,
  DevelopmentEstimate,
  DiscoveryCall,
  getClientInfo 
} from '../config/supabase'
import { v4 as uuidv4 } from 'uuid'

// Common API response interface
export interface SupabaseApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Error handling utility
const handleSupabaseError = (error: any): SupabaseApiResponse => {
  console.error('Supabase error:', error)
  return {
    success: false,
    error: error.message || 'An unexpected error occurred',
    message: 'Please try again later or contact support if the problem persists'
  }
}

// Contact Form API
export interface ContactFormData {
  name: string
  email: string
  company?: string
  phone?: string
  message: string
  service?: string
  form_type: 'contact_page' | 'contact_section'
}

export const submitContactForm = async (data: ContactFormData): Promise<SupabaseApiResponse> => {
  try {
    const clientInfo = getClientInfo()
    
    const contactSubmission: ContactSubmission = {
      ...data,
      ...clientInfo
    }

    const { data: result, error } = await supabase
      .from(TABLES.CONTACT_SUBMISSIONS)
      .insert([contactSubmission])
      .select()

    if (error) {
      return handleSupabaseError(error)
    }

    // Add to email subscribers
    try {
      const subscriberData: Partial<EmailSubscriber> = {
        email: data.email,
        first_name: data.name.split(' ')[0],
        company: data.company,
        subscription_source: 'contact_form'
      }

      await supabase
        .from(TABLES.EMAIL_SUBSCRIBERS)
        .upsert(subscriberData, { 
          onConflict: 'email'
        })
    } catch (emailError) {
      console.warn('Failed to add email subscriber:', emailError)
    }

    return {
      success: true,
      data: result?.[0],
      message: 'Contact form submitted successfully'
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

// Workshop Booking API
export interface WorkshopBookingData {
  firstName: string
  lastName: string
  email: string
  company?: string
  phone?: string
  position?: string
  numberOfParticipants?: number
  workshopType: string
  preferredDate?: string
  preferredTime?: string
  language: string
  locationPreference?: string
  specialRequirements?: string
  budgetRange?: string
  additionalInfo?: Record<string, any>
}

export const submitWorkshopBooking = async (data: WorkshopBookingData): Promise<SupabaseApiResponse> => {
  try {
    const clientInfo = getClientInfo()
    
    const booking: WorkshopBooking = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      company: data.company,
      phone: data.phone,
      position: data.position,
      team_size: data.numberOfParticipants,
      workshop_type: data.workshopType,
      preferred_date: data.preferredDate,
      preferred_time: data.preferredTime,
      language: data.language,
      location_preference: data.locationPreference,
      message: data.specialRequirements,
      budget_range: data.budgetRange,
      additional_info: data.additionalInfo,
      status: 'pending',
      ...clientInfo
    }

    const { data: result, error } = await supabase
      .from(TABLES.WORKSHOP_BOOKINGS)
      .insert([booking])
      .select()

    if (error) {
      return handleSupabaseError(error)
    }

    // Add to email subscribers
    try {
      const subscriberData: Partial<EmailSubscriber> = {
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        company: data.company,
        subscription_source: 'workshop_booking'
      }

      await supabase
        .from(TABLES.EMAIL_SUBSCRIBERS)
        .upsert(subscriberData, { 
          onConflict: 'email'
        })
    } catch (emailError) {
      console.warn('Failed to add email subscriber:', emailError)
    }

    return {
      success: true,
      data: result?.[0],
      message: 'Workshop booking submitted successfully'
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

export const savePartialWorkshopBooking = async (data: Partial<WorkshopBookingData>): Promise<SupabaseApiResponse> => {
  try {
    const clientInfo = getClientInfo()
    
    const booking: Partial<WorkshopBooking> = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      company: data.company,
      phone: data.phone,
      position: data.position,
      workshop_type: 'TBD', // Temporary placeholder for draft
      language: 'en', // Default language for draft
      status: 'draft', // Mark as draft until completed
      ...clientInfo
    }

    const { data: result, error } = await supabase
      .from(TABLES.WORKSHOP_BOOKINGS)
      .insert([booking])
      .select()

    if (error) {
      return handleSupabaseError(error)
    }

    return {
      success: true,
      data: result?.[0],
      message: 'Partial booking saved successfully'
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

export const updateWorkshopBooking = async (id: string, data: Partial<WorkshopBookingData>): Promise<SupabaseApiResponse> => {
  try {
    const clientInfo = getClientInfo()
    
    const updateData: Partial<WorkshopBooking> = {
      team_size: data.numberOfParticipants,
      workshop_type: data.workshopType,
      preferred_date: data.preferredDate,
      preferred_time: data.preferredTime,
      language: data.language,
      location_preference: data.locationPreference,
      message: data.specialRequirements,
      budget_range: data.budgetRange,
      additional_info: data.additionalInfo,
      status: 'pending', // Mark as pending when completed
      ...clientInfo
    }

    const { data: result, error } = await supabase
      .from(TABLES.WORKSHOP_BOOKINGS)
      .update(updateData)
      .eq('id', id)
      .select()

    if (error) {
      return handleSupabaseError(error)
    }

    return {
      success: true,
      data: result?.[0],
      message: 'Workshop booking updated successfully'
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

// Brochure Download API
export interface BrochureRequestData {
  firstName: string
  lastName: string
  email: string
  company: string
  position?: string
  teamSize?: string
  city?: string
  industry?: string
  specificInterests?: string
}

export const submitBrochureRequest = async (data: BrochureRequestData): Promise<SupabaseApiResponse> => {
  try {
    const clientInfo = getClientInfo()
    
    const request: BrochureRequest = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      company: data.company,
      position: data.position,
      team_size: data.teamSize,
      city: data.city,
      industry: data.industry,
      specific_interests: data.specificInterests,
      ...clientInfo
    }

    const { data: result, error } = await supabase
      .from(TABLES.BROCHURE_REQUESTS)
      .insert([request])
      .select()

    if (error) {
      return handleSupabaseError(error)
    }

    // Add to email subscribers
    try {
      const subscriberData: Partial<EmailSubscriber> = {
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        company: data.company,
        subscription_source: 'brochure_download',
        ...clientInfo
      }

              await supabase
          .from(TABLES.EMAIL_SUBSCRIBERS)
          .upsert(subscriberData, { 
            onConflict: 'email'
          })
    } catch (emailError) {
      console.warn('Failed to add email subscriber:', emailError)
    }

    return {
      success: true,
      data: result?.[0],
      message: 'Brochure request submitted successfully'
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

// Exercise API
export interface ExerciseSubmissionData {
  exercise_type: string
  responses: Record<string, any>
  user_session_id?: string
  user_id?: string
  email?: string
  completion_status?: 'in_progress' | 'completed' | 'abandoned'
  time_spent_minutes?: number
  user_details?: {
    name: string;
    email: string;
    company?: string;
  }
}

export const submitExerciseResponse = async (data: ExerciseSubmissionData): Promise<SupabaseApiResponse> => {
  try {
    const clientInfo = getClientInfo()
    const sessionId = data.user_session_id || uuidv4()
    
    // Calculate completion percentage
    const completion_percentage = calculateCompletionPercentage(data.exercise_type, data.responses)
    
    const exerciseData: ExerciseResponse = {
      exercise_type: data.exercise_type,
      user_session_id: sessionId,
      email: data.user_details?.email || data.email,
      responses: data.responses,
      completion_status: data.completion_status || 'in_progress',
      completion_percentage,
      time_spent_minutes: data.time_spent_minutes || 0,
      ...clientInfo
    }

    // Check for existing response to update or create new
    const { data: existing } = await supabase
      .from(TABLES.EXERCISE_RESPONSES)
      .select('id')
      .eq('exercise_type', data.exercise_type)
      .eq('user_session_id', sessionId)
      .single()

    let result, error

    if (existing) {
      // Update existing response
      const updateData = { ...exerciseData }
      delete updateData.id // Remove id from update data
      
      const response = await supabase
        .from(TABLES.EXERCISE_RESPONSES)
        .update(updateData)
        .eq('id', existing.id)
        .select()
      
      result = response.data
      error = response.error
    } else {
      // Create new response
      const response = await supabase
        .from(TABLES.EXERCISE_RESPONSES)
        .insert([exerciseData])
        .select()
      
      result = response.data
      error = response.error
    }

    if (error) {
      return handleSupabaseError(error)
    }

    // Add to email subscribers if email provided and exercise completed
    if (data.email && data.completion_status === 'completed') {
      try {
        const subscriberData: Partial<EmailSubscriber> = {
          email: data.email,
          subscription_source: 'exercise_completion'
        }

        await supabase
          .from(TABLES.EMAIL_SUBSCRIBERS)
          .upsert(subscriberData, { 
            onConflict: 'email'
          })
      } catch (emailError) {
        console.warn('Failed to add email subscriber:', emailError)
      }
    }

    return {
      success: true,
      data: {
        ...result?.[0],
        session_id: sessionId,
        completion_percentage
      },
      message: 'Exercise response saved successfully'
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

// Load exercise response
export const loadExerciseResponse = async (
  exerciseType: string, 
  sessionId?: string
): Promise<SupabaseApiResponse> => {
  try {
    if (!sessionId) {
      return {
        success: false,
        error: 'Session ID is required'
      }
    }

    let query = supabase
      .from(TABLES.EXERCISE_RESPONSES)
      .select('*')
      .eq('user_session_id', sessionId)

    if (exerciseType) {
      query = query.eq('exercise_type', exerciseType)
    }

    const { data, error } = await query.order('updated_at', { ascending: false })

    if (error) {
      return handleSupabaseError(error)
    }

    return {
      success: true,
      data: data || []
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

// Helper function to calculate completion percentage
function calculateCompletionPercentage(exercise_type: string, responses: Record<string, any>): number {
  try {
    switch (exercise_type) {
      case 'ai-tasks':
        const aiTaskFields = ['currentRole', 'aiTasks', 'challenges', 'goals']
        const aiFilledFields = aiTaskFields.filter(field => 
          responses[field] && responses[field].toString().trim().length > 0
        ).length
        return Math.round((aiFilledFields / aiTaskFields.length) * 100)

      case 'future-planning':
        const planningFields = ['visionStatement', 'keyObjectives', 'challenges', 'timeline']
        const planningFilledFields = planningFields.filter(field => 
          responses[field] && responses[field].toString().trim().length > 0
        ).length
        return Math.round((planningFilledFields / planningFields.length) * 100)

      case 'tool-sharing':
        const toolFields = ['favoriteTools', 'workflowDescription', 'recommendations', 'wishList']
        const toolFilledFields = toolFields.filter(field => 
          responses[field] && responses[field].toString().trim().length > 0
        ).length
        return Math.round((toolFilledFields / toolFields.length) * 100)

      case 'assessment':
        const answeredQuestions = Object.keys(responses).filter(key => 
          responses[key] !== undefined && responses[key] !== null
        ).length
        const totalQuestions = 5 // Assessment has 5 questions
        return Math.round((answeredQuestions / totalQuestions) * 100)

      default:
        return 0
    }
  } catch (error) {
    console.warn('Error calculating completion percentage:', error)
    return 0
  }
}

// Analytics API
export const trackPageView = async (pageAnalytics: Partial<PageAnalytics>): Promise<SupabaseApiResponse> => {
  try {
    const clientInfo = getClientInfo()
    
    const analyticsData: PageAnalytics = {
      ...pageAnalytics,
      ...clientInfo,
      page_path: pageAnalytics.page_path || window.location.pathname
    }

    const { data, error } = await supabase
      .from(TABLES.PAGE_ANALYTICS)
      .insert([analyticsData])
      .select()

    if (error) {
      return handleSupabaseError(error)
    }

    return {
      success: true,
      data: data?.[0]
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

// Admin API functions (for authenticated users)
export const getContactSubmissions = async (filters?: {
  page?: number
  limit?: number
  form_type?: string
  date_from?: string
  date_to?: string
}): Promise<SupabaseApiResponse> => {
  try {
    const { page = 1, limit = 50, form_type, date_from, date_to } = filters || {}
    const offset = (page - 1) * limit

    let query = supabase
      .from(TABLES.CONTACT_SUBMISSIONS)
      .select('*', { count: 'exact' })

    if (form_type) {
      query = query.eq('form_type', form_type)
    }
    if (date_from) {
      query = query.gte('created_at', date_from)
    }
    if (date_to) {
      query = query.lte('created_at', date_to)
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return handleSupabaseError(error)
    }

    return {
      success: true,
      data: {
        submissions: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        }
      }
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

export const getWorkshopBookings = async (filters?: {
  page?: number
  limit?: number
  status?: string
  workshop_type?: string
  date_from?: string
  date_to?: string
  language?: string
}): Promise<SupabaseApiResponse> => {
  try {
    const { page = 1, limit = 50, status, workshop_type, date_from, date_to, language } = filters || {}
    const offset = (page - 1) * limit

    let query = supabase
      .from(TABLES.WORKSHOP_BOOKINGS)
      .select('*', { count: 'exact' })

    if (status) {
      query = query.eq('status', status)
    }
    if (workshop_type) {
      query = query.eq('workshop_type', workshop_type)
    }
    if (language) {
      query = query.eq('language', language)
    }
    if (date_from) {
      query = query.gte('created_at', date_from)
    }
    if (date_to) {
      query = query.lte('created_at', date_to)
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return handleSupabaseError(error)
    }

    return {
      success: true,
      data: {
        bookings: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        }
      }
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

export const updateWorkshopBookingStatus = async (
  id: string, 
  status: 'pending' | 'confirmed' | 'cancelled'
): Promise<SupabaseApiResponse> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.WORKSHOP_BOOKINGS)
      .update({ status })
      .eq('id', id)
      .select()

    if (error) {
      return handleSupabaseError(error)
    }

    return {
      success: true,
      data: data?.[0],
      message: 'Booking status updated successfully'
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

// Admin API Functions
export const adminLogin = async (email: string, password: string): Promise<SupabaseApiResponse> => {
  try {
    // For now, we'll use a simple environment variable check
    // In production, you should implement proper admin authentication
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    
    if (!adminEmail || !adminPassword) {
      return {
        success: false,
        error: 'Admin credentials not configured'
      };
    }
    
    if (email === adminEmail && password === adminPassword) {
      // Generate a simple token (in production, use proper JWT)
      const token = btoa(`${email}:${Date.now()}`);
      localStorage.setItem('admin_token', token);
      
      return {
        success: true,
        data: { token, email },
        message: 'Login successful'
      };
    } else {
      return {
        success: false,
        error: 'Invalid credentials'
      };
    }
  } catch (error) {
    return handleSupabaseError(error);
  }
};

// Learning Progress API
export interface LearningProgressUpsertInput {
  userId: string
  courseKey: string
  moduleKey: string
  lessonKey?: string
  status?: 'not_started' | 'in_progress' | 'completed'
  percentage?: number
}

export const getLearningProgress = async (
  userId: string,
  courseKey: string = 'learn-hub'
): Promise<SupabaseApiResponse<{ progress: LearningProgress[] }>> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.LEARNING_PROGRESS)
      .select('*')
      .eq('user_id', userId)
      .eq('course_key', courseKey)
      .order('last_visited_at', { ascending: false });

    if (error) return handleSupabaseError(error);

    return { success: true, data: { progress: data || [] } };
  } catch (error) {
    return handleSupabaseError(error);
  }
}

export const upsertLearningProgress = async (
  input: LearningProgressUpsertInput
): Promise<SupabaseApiResponse<{ row: LearningProgress }>> => {
  try {
    const now = new Date().toISOString();
    const row: Partial<LearningProgress> = {
      user_id: input.userId,
      course_key: input.courseKey,
      module_key: input.moduleKey,
      lesson_key: input.lessonKey,
      status: input.status || 'in_progress',
      percentage: typeof input.percentage === 'number' ? input.percentage : 0,
      last_visited_at: now,
      started_at: now,
      completed_at: input.status === 'completed' ? now : null,
    };

    // Upsert on unique key (user_id + course_key + module_key + lesson_key)
    const { data, error } = await supabase
      .from(TABLES.LEARNING_PROGRESS)
      .upsert(row as any,
        {
          onConflict: 'user_id,course_key,module_key,lesson_key'
        }
      )
      .select()
      .limit(1);

    if (error) return handleSupabaseError(error);

    return { success: true, data: { row: (data?.[0] as LearningProgress) } };
  } catch (error) {
    return handleSupabaseError(error);
  }
}

export const getAdminLearningProgress = async (): Promise<SupabaseApiResponse> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.LEARNING_PROGRESS)
      .select('*')
      .order('last_visited_at', { ascending: false });

    if (error) return handleSupabaseError(error);

    const rows = data || [];
    // Aggregate simple stats by module
    const byModule: Record<string, { total: number; completed: number; avgPct: number }> = {};
    rows.forEach((r: any) => {
      const key = r.module_key || 'unknown';
      if (!byModule[key]) byModule[key] = { total: 0, completed: 0, avgPct: 0 };
      byModule[key].total += 1;
      byModule[key].completed += r.status === 'completed' ? 1 : 0;
      byModule[key].avgPct += r.percentage || 0;
    });
    Object.keys(byModule).forEach(k => {
      const m = byModule[k];
      m.avgPct = m.total ? Math.round(m.avgPct / m.total) : 0;
    });

    return {
      success: true,
      data: {
        rows,
        summary: byModule,
      }
    };
  } catch (error) {
    return handleSupabaseError(error);
  }
}

export const adminLogout = (): void => {
  localStorage.removeItem('admin_token');
};

export const verifyAdminToken = (): boolean => {
  const token = localStorage.getItem('admin_token');
  return !!token;
};

export const getAdminStats = async (): Promise<SupabaseApiResponse> => {
  try {
    // Get counts for each table
    const [contactCount, workshopCount, brochureCount, exerciseCount, assessmentCount] = await Promise.all([
      supabase.from(TABLES.CONTACT_SUBMISSIONS).select('id', { count: 'exact' }),
      supabase.from(TABLES.WORKSHOP_BOOKINGS).select('id', { count: 'exact' }),
      supabase.from(TABLES.BROCHURE_REQUESTS).select('id', { count: 'exact' }),
      supabase.from(TABLES.EXERCISE_RESPONSES).select('id', { count: 'exact' }),
      supabase.from(TABLES.EXERCISE_RESPONSES).select('id', { count: 'exact' }).eq('exercise_type', 'assessment')
    ]);

    // Get recent activity (last 24h and 7 days)
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [recent24h, recent7d] = await Promise.all([
      supabase.from(TABLES.CONTACT_SUBMISSIONS).select('id', { count: 'exact' }).gte('created_at', last24h),
      supabase.from(TABLES.CONTACT_SUBMISSIONS).select('id', { count: 'exact' }).gte('created_at', last7d)
    ]);

    return {
      success: true,
      data: {
        contactSubmissions: contactCount.count || 0,
        workshopBookings: workshopCount.count || 0,
        brochureRequests: brochureCount.count || 0,
        exerciseResponses: exerciseCount.count || 0,
        assessments: assessmentCount.count || 0,
        recentActivity: {
          total: recent7d.count || 0,
          last24h: recent24h.count || 0,
          last7d: recent7d.count || 0
        }
      }
    };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

export const getAdminLeads = async (page: number = 1, limit: number = 50): Promise<SupabaseApiResponse> => {
  try {
    const offset = (page - 1) * limit;
    
    // Get all leads from different tables
    const [contacts, brochures, workshops, exercises] = await Promise.all([
      supabase.from(TABLES.CONTACT_SUBMISSIONS)
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1),
      supabase.from(TABLES.BROCHURE_REQUESTS)
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1),
      supabase.from(TABLES.WORKSHOP_BOOKINGS)
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1),
      supabase.from(TABLES.EXERCISE_RESPONSES)
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)
    ]);

    // Transform data to unified lead format
    const leads = [
      ...(contacts.data || []).map(item => ({
        id: item.id,
        created_at: item.created_at,
        type: 'contact' as const,
        full_name: item.name,
        email: item.email,
        company: item.company || '',
        phone: item.phone || '',
        message: item.message,
        meta1: item.service || '',
        meta2: ''
      })),
      ...(brochures.data || []).map(item => ({
        id: item.id,
        created_at: item.created_at,
        type: 'brochure' as const,
        full_name: `${item.first_name} ${item.last_name}`,
        email: item.email,
        company: item.company,
        phone: '',
        message: item.specific_interests || '',
        meta1: item.industry || '',
        meta2: ''
      })),
      ...(workshops.data || []).map(item => ({
        id: item.id,
        created_at: item.created_at,
        type: 'workshop' as const,
        full_name: `${item.first_name} ${item.last_name}`,
        email: item.email,
        company: item.company || '',
        phone: item.phone || '',
        message: item.message || '',
        meta1: `${item.workshop_type} - ${item.preferred_date || 'No date'} - ${item.team_size || '1'} participants`,
        meta2: `${item.status} - ${item.language}`
      })),
      ...(exercises.data || []).map(item => ({
        id: item.id,
        created_at: item.created_at,
        type: item.exercise_type === 'assessment' ? 'assessment' as const : 'exercise' as const,
        full_name: item.email || 'Anonymous',
        email: item.email || '',
        company: '',
        phone: '',
        message: `${item.exercise_type} - ${item.completion_status}`,
        meta1: item.exercise_type,
        meta2: `${item.completion_percentage}% complete`
      }))
    ];

    // Sort by creation date and apply pagination
    leads.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const paginatedLeads = leads.slice(offset, offset + limit);

    return {
      success: true,
      data: {
        leads: paginatedLeads,
        total: leads.length,
        page,
        limit
      }
    };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

export const getAdminWorkshopBookings = async (): Promise<SupabaseApiResponse> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.WORKSHOP_BOOKINGS)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return handleSupabaseError(error);
    }

    return {
      success: true,
      data: {
        bookings: data || []
      }
    };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

export const getAdminContactSubmissions = async (): Promise<SupabaseApiResponse> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.CONTACT_SUBMISSIONS)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return handleSupabaseError(error);
    }

    return {
      success: true,
      data: {
        submissions: data || []
      }
    };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

export const getAdminBrochureRequests = async (): Promise<SupabaseApiResponse> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.BROCHURE_REQUESTS)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return handleSupabaseError(error);
    }

    return {
      success: true,
      data: {
        requests: data || []
      }
    };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

export const getAdminExerciseResponses = async (): Promise<SupabaseApiResponse> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.EXERCISE_RESPONSES)
      .select('*')
      .neq('exercise_type', 'assessment')
      .order('created_at', { ascending: false });

    if (error) {
      return handleSupabaseError(error);
    }

    return {
      success: true,
      data: {
        responses: data || []
      }
    };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

export const getAdminAssessments = async (): Promise<SupabaseApiResponse> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.EXERCISE_RESPONSES)
      .select('*')
      .eq('exercise_type', 'assessment')
      .order('created_at', { ascending: false });

    if (error) {
      return handleSupabaseError(error);
    }

    return {
      success: true,
      data: {
        assessments: data || []
      }
    };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

export const getAdminNewsletterSubscribers = async (): Promise<SupabaseApiResponse> => {
  try {
    const { data, error } = await supabase
      .from(TABLES.EMAIL_SUBSCRIBERS)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return handleSupabaseError(error);
    }

    return {
      success: true,
      data: {
        subscribers: data || []
      }
    };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

export const deleteAdminItem = async (table: string, id: string): Promise<SupabaseApiResponse> => {
  try {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) {
      return handleSupabaseError(error);
    }

    return {
      success: true,
      message: 'Item deleted successfully'
    };
  } catch (error) {
    return handleSupabaseError(error);
  }
};

// Development Estimate API
export interface DevelopmentEstimateInput {
  email: string
  web_app: boolean
  admin_dashboard: boolean
  mobile_ios: boolean
  mobile_android: boolean
  ai_chat_agent: boolean
  rag_search: boolean
  analytics_dashboard: boolean
  supabase_auth: boolean
  payments: boolean
  file_storage: boolean
  api_integrations: string[]
  complexity: 'starter' | 'standard' | 'advanced'
  timeline_weeks: number
  languages: string[]
  project_name?: string
  company?: string
  contact_name?: string
  phone?: string
  notes?: string
}

export interface DevelopmentEstimateBreakdown {
  scope: {
    web_app: number
    admin_dashboard: number
    mobile: number
  }
  features: {
    ai_chat_agent: number
    rag_search: number
    analytics_dashboard: number
    supabase_auth: number
    payments: number
    file_storage: number
    api_integrations: number
  }
  milestone_payments: {
    deposit_20: number
    prototype_20: number
    mid_build_25: number
    beta_20: number
    launch_15: number
  }
}

export const calculateDevelopmentEstimatePrice = (input: DevelopmentEstimateInput): { total: number; breakdown: DevelopmentEstimateBreakdown } => {
  // Base pricing in CHF (Swiss pricing)
  const basePrices = {
    web_app: 15000,
    admin_dashboard: 8000,
    mobile_ios: 12000,
    mobile_android: 12000,
    ai_chat_agent: 10000,
    rag_search: 15000,
    analytics_dashboard: 5000,
    supabase_auth: 2000,
    payments: 5000,
    file_storage: 3000,
    api_integrations: 2000, // per integration
  }

  // Complexity multipliers
  const complexityMultipliers = {
    starter: 0.8,
    standard: 1.0,
    advanced: 1.3
  }

  // Timeline multipliers (rush delivery)
  const timelineMultiplier = input.timeline_weeks <= 14 ? 1.2 : 1.0

  // Language multipliers
  const languageMultiplier = input.languages.length > 1 ? 1 + (input.languages.length - 1) * 0.3 : 1.0

  const complexity = complexityMultipliers[input.complexity] || 1.0

  // Calculate scope costs
  const scope = {
    web_app: input.web_app ? basePrices.web_app * complexity * timelineMultiplier * languageMultiplier : 0,
    admin_dashboard: input.admin_dashboard ? basePrices.admin_dashboard * complexity * timelineMultiplier * languageMultiplier : 0,
    mobile: (input.mobile_ios ? basePrices.mobile_ios : 0) + (input.mobile_android ? basePrices.mobile_android : 0)
  }

  // Calculate feature costs
  const features = {
    ai_chat_agent: input.ai_chat_agent ? basePrices.ai_chat_agent * complexity * timelineMultiplier * languageMultiplier : 0,
    rag_search: input.rag_search ? basePrices.rag_search * complexity * timelineMultiplier * languageMultiplier : 0,
    analytics_dashboard: input.analytics_dashboard ? basePrices.analytics_dashboard * complexity * timelineMultiplier * languageMultiplier : 0,
    supabase_auth: input.supabase_auth ? basePrices.supabase_auth * complexity * timelineMultiplier * languageMultiplier : 0,
    payments: input.payments ? basePrices.payments * complexity * timelineMultiplier * languageMultiplier : 0,
    file_storage: input.file_storage ? basePrices.file_storage * complexity * timelineMultiplier * languageMultiplier : 0,
    api_integrations: input.api_integrations.length * basePrices.api_integrations * complexity * timelineMultiplier * languageMultiplier
  }

  // Calculate total
  const total = Object.values(scope).reduce((sum, val) => sum + val, 0) + 
                Object.values(features).reduce((sum, val) => sum + val, 0)

  // Calculate milestone payments
  const milestone_payments = {
    deposit_20: total * 0.20,
    prototype_20: total * 0.20,
    mid_build_25: total * 0.25,
    beta_20: total * 0.20,
    launch_15: total * 0.15
  }

  return {
    total: Math.round(total),
    breakdown: {
      scope,
      features,
      milestone_payments
    }
  }
}

export const submitDevelopmentEstimate = async (data: DevelopmentEstimateInput): Promise<SupabaseApiResponse> => {
  try {
    const clientInfo = getClientInfo()
    
    const estimate = {
      email: data.email,
      project_name: data.project_name,
      company: data.company,
      contact_name: data.contact_name,
      phone: data.phone,
      web_app: data.web_app,
      admin_dashboard: data.admin_dashboard,
      mobile_ios: data.mobile_ios,
      mobile_android: data.mobile_android,
      ai_chat_agent: data.ai_chat_agent,
      rag_search: data.rag_search,
      analytics_dashboard: data.analytics_dashboard,
      supabase_auth: data.supabase_auth,
      payments: data.payments,
      file_storage: data.file_storage,
      api_integrations: data.api_integrations,
      complexity: data.complexity,
      timeline_weeks: data.timeline_weeks,
      languages: data.languages,
      notes: data.notes,
      status: 'pending',
      ...clientInfo
    }

    const { data: result, error } = await supabase
      .from('development_estimates')
      .insert([estimate])
      .select()

    if (error) {
      return handleSupabaseError(error)
    }

    // Add to email subscribers
    try {
      const subscriberData: Partial<EmailSubscriber> = {
        email: data.email,
        first_name: data.contact_name?.split(' ')[0],
        company: data.company,
        subscription_source: 'development_estimate'
      }

      await supabase
        .from(TABLES.EMAIL_SUBSCRIBERS)
        .upsert(subscriberData, { 
          onConflict: 'email'
        })
    } catch (emailError) {
      console.warn('Failed to add email subscriber:', emailError)
    }

    return {
      success: true,
      data: result?.[0],
      message: 'Development estimate submitted successfully'
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}

// Discovery Call API
export interface DiscoveryCallData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  position?: string
  preferredDate?: string
  preferredTime?: string
  callDuration?: '15' | '30' | '45' | '60'
  callType?: 'video' | 'phone' | 'in-person'
  timezone?: string
  companySize?: string
  industry?: string
  currentAIUsage?: string
  challenges?: string
  goals?: string
  budgetRange?: string
  howDidYouHear?: string
  specialRequirements?: string
}

export const submitDiscoveryCall = async (data: DiscoveryCallData): Promise<SupabaseApiResponse> => {
  try {
    const clientInfo = getClientInfo()
    
    const discoveryCall: DiscoveryCall = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
      company: data.company,
      position: data.position,
      preferred_date: data.preferredDate,
      preferred_time: data.preferredTime,
      call_duration: data.callDuration,
      call_type: data.callType,
      timezone: data.timezone,
      company_size: data.companySize,
      industry: data.industry,
      current_ai_usage: data.currentAIUsage,
      challenges: data.challenges,
      goals: data.goals,
      budget_range: data.budgetRange,
      how_did_you_hear: data.howDidYouHear,
      special_requirements: data.specialRequirements,
      status: 'pending',
      ...clientInfo
    }

    const { data: result, error } = await supabase
      .from(TABLES.DISCOVERY_CALLS)
      .insert([discoveryCall])
      .select()

    if (error) {
      return handleSupabaseError(error)
    }

    // Add to email subscribers
    try {
      const subscriberData: Partial<EmailSubscriber> = {
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        company: data.company,
        subscription_source: 'discovery_call'
      }

      await supabase
        .from(TABLES.EMAIL_SUBSCRIBERS)
        .upsert(subscriberData, { 
          onConflict: 'email'
        })
    } catch (emailError) {
      console.warn('Failed to add email subscriber:', emailError)
    }

    return {
      success: true,
      data: result?.[0],
      message: 'Discovery call request submitted successfully'
    }
  } catch (error) {
    return handleSupabaseError(error)
  }
}
