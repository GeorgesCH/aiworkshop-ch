import { 
  db, 
  COLLECTIONS, 
  ContactSubmission, 
  WorkshopBooking, 
  BrochureRequest, 
  ExerciseResponse, 
  EmailSubscriber,
  PageAnalytics,
  LearningProgress,
  DevelopmentEstimate,
  DiscoveryCall,
  getClientInfo,
  convertTimestamps
} from '../config/firebase'
// Email service configuration - using local email server
const EMAIL_SERVER_URL = 'http://localhost:3001';

// Email service functions using local email server
async function sendContactConfirmation(email: string, name: string, message: string) {
  try {
    const response = await fetch(`${EMAIL_SERVER_URL}/api/send-contact-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipientEmail: email,
        recipientName: name,
        message: message
      })
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error: 'Email service unavailable' };
  }
}

async function sendWorkshopBookingConfirmation(email: string, name: string, bookingData: any) {
  try {
    const response = await fetch(`${EMAIL_SERVER_URL}/api/send-workshop-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipientEmail: email,
        recipientName: name,
        bookingData: bookingData
      })
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error: 'Email service unavailable' };
  }
}

async function sendBrochureConfirmation(email: string, name: string) {
  try {
    const response = await fetch(`${EMAIL_SERVER_URL}/api/send-brochure-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipientEmail: email,
        recipientName: name
      })
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error: 'Email service unavailable' };
  }
}

async function sendDiscoveryCallConfirmation(email: string, name: string, callData: any) {
  try {
    const response = await fetch(`${EMAIL_SERVER_URL}/api/send-discovery-call-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipientEmail: email,
        recipientName: name,
        callData: callData
      })
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error: 'Email service unavailable' };
  }
}

async function sendAdminNotification(subject: string, message: string, formData?: any) {
  try {
    const response = await fetch(`${EMAIL_SERVER_URL}/api/send-admin-notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject: subject,
        message: message,
        formData: formData
      })
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Email service error:', error);
    return { success: false, error: 'Email service unavailable' };
  }
}
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'

// Common API response interface
export interface FirebaseApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Error handling helper
const handleFirebaseError = (error: any): FirebaseApiResponse => {
  console.error('Firebase error:', error)
  
  let errorMessage = 'An unexpected error occurred'
  
  if (error.code) {
    switch (error.code) {
      case 'permission-denied':
        errorMessage = 'Permission denied. Please check your authentication.'
        break
      case 'not-found':
        errorMessage = 'The requested resource was not found.'
        break
      case 'already-exists':
        errorMessage = 'This resource already exists.'
        break
      case 'failed-precondition':
        errorMessage = 'The operation failed due to a precondition.'
        break
      case 'aborted':
        errorMessage = 'The operation was aborted.'
        break
      case 'out-of-range':
        errorMessage = 'The operation is out of range.'
        break
      case 'unimplemented':
        errorMessage = 'This operation is not implemented.'
        break
      case 'internal':
        errorMessage = 'An internal error occurred.'
        break
      case 'unavailable':
        errorMessage = 'The service is currently unavailable.'
        break
      case 'data-loss':
        errorMessage = 'Data loss occurred.'
        break
      case 'unauthenticated':
        errorMessage = 'Authentication required.'
        break
      default:
        errorMessage = error.message || errorMessage
    }
  } else if (error.message) {
    errorMessage = error.message
  }
  
  return {
    success: false,
    error: errorMessage
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

export const submitContactForm = async (data: ContactFormData): Promise<FirebaseApiResponse> => {
  try {
    const clientInfo = getClientInfo()
    
    const contactData: Omit<ContactSubmission, 'id'> = {
      name: data.name,
      email: data.email,
      company: data.company,
      phone: data.phone,
      message: data.message,
      service: data.service,
      formType: data.form_type,
      ipAddress: clientInfo.userAgent, // Will be enhanced with actual IP in production
      userAgent: clientInfo.userAgent,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const docRef = await addDoc(collection(db, COLLECTIONS.CONTACT_SUBMISSIONS), {
      ...contactData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    // Send confirmation email to user
    try {
      await sendContactConfirmation(data.email, data.name, data.message);
    } catch (emailError) {
      console.error('Failed to send contact confirmation email:', emailError);
      // Don't fail the form submission if email fails
    }

    // Send admin notification
    try {
      await sendAdminNotification(
        'New Contact Form Submission',
        `New contact form submission from ${data.name} (${data.email})`,
        data
      );
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError);
      // Don't fail the form submission if email fails
    }

    return {
      success: true,
      data: { id: docRef.id },
      message: 'Contact form submitted successfully'
    }
  } catch (error) {
    return handleFirebaseError(error)
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
  workshopType: string
  preferredDate?: string
  preferredTime?: string
  numberOfParticipants?: number
  locationPreference?: string
  budgetRange?: string
  specialRequirements?: string
  language: string
}

export const submitWorkshopBooking = async (data: WorkshopBookingData): Promise<FirebaseApiResponse> => {
  try {
    const clientInfo = getClientInfo()
    
    const bookingData: Omit<WorkshopBooking, 'id'> = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      company: data.company,
      phone: data.phone,
      position: data.position,
      teamSize: data.numberOfParticipants,
      workshopType: data.workshopType,
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      locationPreference: data.locationPreference,
      budgetRange: data.budgetRange,
      message: data.specialRequirements,
      language: data.language,
      ipAddress: clientInfo.userAgent,
      userAgent: clientInfo.userAgent,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const docRef = await addDoc(collection(db, COLLECTIONS.WORKSHOP_BOOKINGS), {
      ...bookingData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    // Send confirmation email to user
    try {
      await sendWorkshopBookingConfirmation(
        data.email, 
        `${data.firstName} ${data.lastName}`, 
        {
          workshopType: data.workshopType,
          preferredDate: data.preferredDate,
          preferredTime: data.preferredTime,
          numberOfParticipants: data.numberOfParticipants,
          locationPreference: data.locationPreference
        }
      );
    } catch (emailError) {
      console.error('Failed to send workshop booking confirmation email:', emailError);
      // Don't fail the form submission if email fails
    }

    // Send admin notification
    try {
      await sendAdminNotification(
        'New Workshop Booking',
        `New workshop booking from ${data.firstName} ${data.lastName} (${data.email})`,
        data
      );
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError);
      // Don't fail the form submission if email fails
    }

    return {
      success: true,
      data: { id: docRef.id },
      message: 'Workshop booking submitted successfully'
    }
  } catch (error) {
    return handleFirebaseError(error)
  }
}

export const updateWorkshopBooking = async (id: string, data: WorkshopBookingData): Promise<FirebaseApiResponse> => {
  try {
    const clientInfo = getClientInfo()
    
    const updateData: Partial<WorkshopBooking> = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      company: data.company,
      phone: data.phone,
      position: data.position,
      teamSize: data.numberOfParticipants,
      workshopType: data.workshopType,
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      locationPreference: data.locationPreference,
      budgetRange: data.budgetRange,
      message: data.specialRequirements,
      language: data.language,
      updatedAt: new Date()
    }

    await updateDoc(doc(db, COLLECTIONS.WORKSHOP_BOOKINGS, id), {
      ...updateData,
      updatedAt: serverTimestamp()
    })

    return {
      success: true,
      message: 'Workshop booking updated successfully'
    }
  } catch (error) {
    return handleFirebaseError(error)
  }
}

// Brochure Request API
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

export const submitBrochureRequest = async (data: BrochureRequestData): Promise<FirebaseApiResponse> => {
  try {
    const clientInfo = getClientInfo()
    
    const brochureData: Omit<BrochureRequest, 'id'> = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      company: data.company,
      position: data.position,
      teamSize: data.teamSize,
      city: data.city,
      industry: data.industry,
      specificInterests: data.specificInterests,
      ipAddress: clientInfo.userAgent,
      userAgent: clientInfo.userAgent,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const docRef = await addDoc(collection(db, COLLECTIONS.BROCHURE_REQUESTS), {
      ...brochureData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    // Send confirmation email to user
    try {
      await sendBrochureConfirmation(
        data.email, 
        `${data.firstName} ${data.lastName}`
      );
    } catch (emailError) {
      console.error('Failed to send brochure confirmation email:', emailError);
      // Don't fail the form submission if email fails
    }

    // Send admin notification
    try {
      await sendAdminNotification(
        'New Brochure Request',
        `New brochure request from ${data.firstName} ${data.lastName} (${data.email})`,
        data
      );
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError);
      // Don't fail the form submission if email fails
    }

    return {
      success: true,
      data: { id: docRef.id },
      message: 'Brochure request submitted successfully'
    }
  } catch (error) {
    return handleFirebaseError(error)
  }
}

// Exercise Response API
export interface ExerciseSubmissionData {
  exercise_type: string
  user_session_id?: string
  email?: string
  responses: Record<string, any>
  completion_status?: 'in_progress' | 'completed' | 'abandoned'
  time_spent_minutes?: number
  user_details?: {
    name: string
    email: string
    company?: string
  }
}

const calculateCompletionPercentage = (exerciseType: string, responses: Record<string, any>): number => {
  // Simple completion calculation - can be enhanced based on exercise type
  const totalFields = Object.keys(responses).length
  const completedFields = Object.values(responses).filter(value => 
    value !== null && value !== undefined && value !== ''
  ).length
  
  return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0
}

export const submitExerciseResponse = async (data: ExerciseSubmissionData): Promise<FirebaseApiResponse> => {
  try {
    const clientInfo = getClientInfo()
    const sessionId = data.user_session_id || uuidv4()
    
    // Calculate completion percentage
    const completionPercentage = calculateCompletionPercentage(data.exercise_type, data.responses)
    
    const exerciseData: Omit<ExerciseResponse, 'id'> = {
      exerciseType: data.exercise_type,
      userSessionId: sessionId,
      email: data.user_details?.email || data.email,
      responses: data.responses,
      completionStatus: data.completion_status || 'in_progress',
      completionPercentage,
      timeSpentMinutes: data.time_spent_minutes || 0,
      ipAddress: clientInfo.userAgent,
      userAgent: clientInfo.userAgent,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Check for existing response to update or create new
    const existingQuery = query(
      collection(db, COLLECTIONS.EXERCISE_RESPONSES),
      where('exerciseType', '==', data.exercise_type),
      where('userSessionId', '==', sessionId)
    )
    
    const existingSnapshot = await getDocs(existingQuery)
    
    if (!existingSnapshot.empty) {
      // Update existing response
      const existingDoc = existingSnapshot.docs[0]
      await updateDoc(doc(db, COLLECTIONS.EXERCISE_RESPONSES, existingDoc.id), {
        ...exerciseData,
        updatedAt: serverTimestamp()
      })
      
      return {
        success: true,
        data: { id: existingDoc.id },
        message: 'Exercise response updated successfully'
      }
    } else {
      // Create new response
      const docRef = await addDoc(collection(db, COLLECTIONS.EXERCISE_RESPONSES), {
        ...exerciseData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      
      return {
        success: true,
        data: { id: docRef.id },
        message: 'Exercise response submitted successfully'
      }
    }
  } catch (error) {
    return handleFirebaseError(error)
  }
}

// Email Subscriber API
export interface EmailSubscriberData {
  email: string
  firstName?: string
  lastName?: string
  company?: string
  subscriptionSource?: string
  preferences?: Record<string, any>
}

export const subscribeToEmail = async (data: EmailSubscriberData): Promise<FirebaseApiResponse> => {
  try {
    const clientInfo = getClientInfo()
    
    const subscriberData: Omit<EmailSubscriber, 'id'> = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      company: data.company,
      subscriptionSource: data.subscriptionSource,
      isActive: true,
      preferences: data.preferences,
      ipAddress: clientInfo.userAgent,
      userAgent: clientInfo.userAgent,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const docRef = await addDoc(collection(db, COLLECTIONS.EMAIL_SUBSCRIBERS), {
      ...subscriberData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    return {
      success: true,
      data: { id: docRef.id },
      message: 'Successfully subscribed to email updates'
    }
  } catch (error) {
    return handleFirebaseError(error)
  }
}

// Page Analytics API
export interface PageAnalyticsData {
  pagePath: string
  referrer?: string
  userSessionId?: string
  deviceType?: string
  browser?: string
  country?: string
  city?: string
  visitDurationSeconds?: number
}

export const trackPageView = async (data: PageAnalyticsData): Promise<FirebaseApiResponse> => {
  try {
    const clientInfo = getClientInfo()
    
    const analyticsData: Omit<PageAnalytics, 'id'> = {
      pagePath: data.pagePath,
      referrer: data.referrer,
      userSessionId: data.userSessionId,
      ipAddress: clientInfo.userAgent,
      userAgent: clientInfo.userAgent,
      deviceType: data.deviceType,
      browser: data.browser,
      country: data.country,
      city: data.city,
      visitDurationSeconds: data.visitDurationSeconds,
      createdAt: new Date()
    }

    const docRef = await addDoc(collection(db, COLLECTIONS.PAGE_ANALYTICS), {
      ...analyticsData,
      createdAt: serverTimestamp()
    })

    return {
      success: true,
      data: { id: docRef.id }
    }
  } catch (error) {
    return handleFirebaseError(error)
  }
}

// Development Estimate API
export interface DevelopmentEstimateData {
  projectName?: string
  company?: string
  contactName?: string
  email: string
  phone?: string
  webApp?: boolean
  adminDashboard?: boolean
  mobileIos?: boolean
  mobileAndroid?: boolean
  aiChatAgent?: boolean
  ragSearch?: boolean
  analyticsDashboard?: boolean
  firebaseAuth?: boolean
  payments?: boolean
  fileStorage?: boolean
  apiIntegrations?: string[]
  complexity?: 'starter' | 'standard' | 'advanced'
  timelineWeeks?: number
  languages?: string[]
  priceChf?: number
  priceBreakdown?: Record<string, any>
  notes?: string
}

export const submitDevelopmentEstimate = async (data: DevelopmentEstimateData): Promise<FirebaseApiResponse> => {
  try {
    const clientInfo = getClientInfo()
    
    const estimateData: Omit<DevelopmentEstimate, 'id'> = {
      projectName: data.projectName,
      company: data.company,
      contactName: data.contactName,
      email: data.email,
      phone: data.phone,
      webApp: data.webApp,
      adminDashboard: data.adminDashboard,
      mobileIos: data.mobileIos,
      mobileAndroid: data.mobileAndroid,
      aiChatAgent: data.aiChatAgent,
      ragSearch: data.ragSearch,
      analyticsDashboard: data.analyticsDashboard,
      firebaseAuth: data.firebaseAuth,
      payments: data.payments,
      fileStorage: data.fileStorage,
      apiIntegrations: data.apiIntegrations,
      complexity: data.complexity,
      timelineWeeks: data.timelineWeeks,
      languages: data.languages,
      priceChf: data.priceChf,
      priceBreakdown: data.priceBreakdown,
      notes: data.notes,
      ipAddress: clientInfo.userAgent,
      userAgent: clientInfo.userAgent,
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const docRef = await addDoc(collection(db, COLLECTIONS.DEVELOPMENT_ESTIMATES), {
      ...estimateData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    return {
      success: true,
      data: { id: docRef.id },
      message: 'Development estimate submitted successfully'
    }
  } catch (error) {
    return handleFirebaseError(error)
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
  currentAiUsage?: string
  challenges?: string
  goals?: string
  budgetRange?: string
  howDidYouHear?: string
  specialRequirements?: string
}

export const submitDiscoveryCall = async (data: DiscoveryCallData): Promise<FirebaseApiResponse> => {
  try {
    const clientInfo = getClientInfo()
    
    const callData: Omit<DiscoveryCall, 'id'> = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      company: data.company,
      position: data.position,
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      callDuration: data.callDuration,
      callType: data.callType,
      timezone: data.timezone,
      companySize: data.companySize,
      industry: data.industry,
      currentAiUsage: data.currentAiUsage,
      challenges: data.challenges,
      goals: data.goals,
      budgetRange: data.budgetRange,
      howDidYouHear: data.howDidYouHear,
      specialRequirements: data.specialRequirements,
      ipAddress: clientInfo.userAgent,
      userAgent: clientInfo.userAgent,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const docRef = await addDoc(collection(db, COLLECTIONS.DISCOVERY_CALLS), {
      ...callData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

    return {
      success: true,
      data: { id: docRef.id },
      message: 'Discovery call request submitted successfully'
    }
  } catch (error) {
    return handleFirebaseError(error)
  }
}

// Admin API functions
export const getAdminStats = async (): Promise<FirebaseApiResponse> => {
  try {
    const [contactsSnapshot, brochuresSnapshot, workshopsSnapshot, exercisesSnapshot] = await Promise.all([
      getDocs(collection(db, COLLECTIONS.CONTACT_SUBMISSIONS)),
      getDocs(collection(db, COLLECTIONS.BROCHURE_REQUESTS)),
      getDocs(collection(db, COLLECTIONS.WORKSHOP_BOOKINGS)),
      getDocs(collection(db, COLLECTIONS.EXERCISE_RESPONSES))
    ])

    const stats = {
      totalContacts: contactsSnapshot.size,
      totalBrochures: brochuresSnapshot.size,
      totalWorkshops: workshopsSnapshot.size,
      totalExercises: exercisesSnapshot.size,
      totalLeads: contactsSnapshot.size + brochuresSnapshot.size + workshopsSnapshot.size + exercisesSnapshot.size
    }

    return {
      success: true,
      data: stats
    }
  } catch (error) {
    return handleFirebaseError(error)
  }
}

export const getAdminLeads = async (page: number = 1, limit: number = 50): Promise<FirebaseApiResponse> => {
  try {
    const offset = (page - 1) * limit
    
    // Get all leads from different collections
    const [contactsSnapshot, brochuresSnapshot, workshopsSnapshot, exercisesSnapshot] = await Promise.all([
      getDocs(query(
        collection(db, COLLECTIONS.CONTACT_SUBMISSIONS),
        orderBy('createdAt', 'desc'),
        limit(limit)
      )),
      getDocs(query(
        collection(db, COLLECTIONS.BROCHURE_REQUESTS),
        orderBy('createdAt', 'desc'),
        limit(limit)
      )),
      getDocs(query(
        collection(db, COLLECTIONS.WORKSHOP_BOOKINGS),
        orderBy('createdAt', 'desc'),
        limit(limit)
      )),
      getDocs(query(
        collection(db, COLLECTIONS.EXERCISE_RESPONSES),
        orderBy('createdAt', 'desc'),
        limit(limit)
      ))
    ])

    const leads = [
      ...contactsSnapshot.docs.map(doc => ({ ...convertTimestamps(doc.data()), id: doc.id, type: 'contact' })),
      ...brochuresSnapshot.docs.map(doc => ({ ...convertTimestamps(doc.data()), id: doc.id, type: 'brochure' })),
      ...workshopsSnapshot.docs.map(doc => ({ ...convertTimestamps(doc.data()), id: doc.id, type: 'workshop' })),
      ...exercisesSnapshot.docs.map(doc => ({ ...convertTimestamps(doc.data()), id: doc.id, type: 'exercise' }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return {
      success: true,
      data: leads.slice(offset, offset + limit)
    }
  } catch (error) {
    return handleFirebaseError(error)
  }
}

// Load existing exercise response
export const loadExerciseResponse = async (exerciseType: string, sessionId?: string): Promise<FirebaseApiResponse> => {
  try {
    if (!sessionId) {
      return {
        success: false,
        error: 'Session ID is required'
      }
    }

    const exerciseQuery = query(
      collection(db, COLLECTIONS.EXERCISE_RESPONSES),
      where('exerciseType', '==', exerciseType),
      where('userSessionId', '==', sessionId),
      orderBy('createdAt', 'desc'),
      limit(1)
    )

    const snapshot = await getDocs(exerciseQuery)
    
    if (snapshot.empty) {
      return {
        success: true,
        data: null,
        message: 'No existing response found'
      }
    }

    const doc = snapshot.docs[0]
    const data = convertTimestamps(doc.data())
    
    return {
      success: true,
      data: { ...data, id: doc.id }
    }
  } catch (error) {
    return handleFirebaseError(error)
  }
}

// Learning Progress API
export interface LearningProgressData {
  userId?: string | null
  userSessionId?: string | null
  courseKey: string
  moduleKey: string
  lessonKey?: string | null
  status: 'not_started' | 'in_progress' | 'completed'
  percentage: number
  startedAt?: Date
  completedAt?: Date | null
  lastVisitedAt?: Date
}

export const getLearningProgress = async (courseKey: string, userId?: string, userSessionId?: string): Promise<FirebaseApiResponse> => {
  try {
    let progressQuery
    
    if (userId) {
      progressQuery = query(
        collection(db, COLLECTIONS.LEARNING_PROGRESS),
        where('userId', '==', userId),
        where('courseKey', '==', courseKey)
      )
    } else if (userSessionId) {
      progressQuery = query(
        collection(db, COLLECTIONS.LEARNING_PROGRESS),
        where('userSessionId', '==', userSessionId),
        where('courseKey', '==', courseKey)
      )
    } else {
      return {
        success: false,
        error: 'Either userId or userSessionId is required'
      }
    }

    const snapshot = await getDocs(progressQuery)
    const progressData = snapshot.docs.map(doc => ({
      ...convertTimestamps(doc.data()),
      id: doc.id
    }))

    return {
      success: true,
      data: progressData
    }
  } catch (error) {
    return handleFirebaseError(error)
  }
}

export const upsertLearningProgress = async (data: LearningProgressData): Promise<FirebaseApiResponse> => {
  try {
    const clientInfo = getClientInfo()
    
    const progressData: Omit<LearningProgress, 'id'> = {
      userId: data.userId,
      userSessionId: data.userSessionId,
      courseKey: data.courseKey,
      moduleKey: data.moduleKey,
      lessonKey: data.lessonKey,
      status: data.status,
      percentage: data.percentage,
      startedAt: data.startedAt,
      completedAt: data.completedAt,
      lastVisitedAt: data.lastVisitedAt || new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // Check for existing progress record
    let existingQuery
    if (data.userId) {
      existingQuery = query(
        collection(db, COLLECTIONS.LEARNING_PROGRESS),
        where('userId', '==', data.userId),
        where('courseKey', '==', data.courseKey),
        where('moduleKey', '==', data.moduleKey)
      )
    } else if (data.userSessionId) {
      existingQuery = query(
        collection(db, COLLECTIONS.LEARNING_PROGRESS),
        where('userSessionId', '==', data.userSessionId),
        where('courseKey', '==', data.courseKey),
        where('moduleKey', '==', data.moduleKey)
      )
    } else {
      return {
        success: false,
        error: 'Either userId or userSessionId is required'
      }
    }

    const existingSnapshot = await getDocs(existingQuery)
    
    if (!existingSnapshot.empty) {
      // Update existing record
      const existingDoc = existingSnapshot.docs[0]
      await updateDoc(doc(db, COLLECTIONS.LEARNING_PROGRESS, existingDoc.id), {
        ...progressData,
        updatedAt: serverTimestamp()
      })
      
      return {
        success: true,
        data: { id: existingDoc.id },
        message: 'Learning progress updated successfully'
      }
    } else {
      // Create new record
      const docRef = await addDoc(collection(db, COLLECTIONS.LEARNING_PROGRESS), {
        ...progressData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      
      return {
        success: true,
        data: { id: docRef.id },
        message: 'Learning progress created successfully'
      }
    }
  } catch (error) {
    return handleFirebaseError(error)
  }
}

// Admin API functions
export const adminLogin = async (email: string, password: string): Promise<FirebaseApiResponse> => {
  try {
    const { signInWithEmailAndPassword } = await import('firebase/auth')
    const { auth } = await import('../config/firebase')
    
    const { user } = await signInWithEmailAndPassword(auth, email, password)
    
    return {
      success: true,
      data: { 
        token: user.uid, // Use UID as token
        email: user.email 
      },
      message: 'Admin login successful'
    }
  } catch (error) {
    return handleFirebaseError(error)
  }
}

export const adminLogout = async (): Promise<FirebaseApiResponse> => {
  try {
    const { signOut } = await import('firebase/auth')
    const { auth } = await import('../config/firebase')
    
    await signOut(auth)
    
    return {
      success: true,
      message: 'Admin logout successful'
    }
  } catch (error) {
    return handleFirebaseError(error)
  }
}

export const verifyAdminToken = async (): Promise<FirebaseApiResponse> => {
  try {
    const { auth } = await import('../config/firebase')
    
    if (auth.currentUser) {
      return {
        success: true,
        data: { 
          user: {
            id: auth.currentUser.uid,
            email: auth.currentUser.email
          }
        }
      }
    } else {
      return {
        success: false,
        error: 'No authenticated user'
      }
    }
  } catch (error) {
    return handleFirebaseError(error)
  }
}

export const getAdminWorkshopBookings = async (page: number = 1, limit: number = 50): Promise<FirebaseApiResponse> => {
  try {
    const offset = (page - 1) * limit
    
    const snapshot = await getDocs(query(
      collection(db, COLLECTIONS.WORKSHOP_BOOKINGS),
      orderBy('createdAt', 'desc'),
      limit(limit)
    ))

    const bookings = snapshot.docs.map(doc => ({
      ...convertTimestamps(doc.data()),
      id: doc.id
    }))

    return {
      success: true,
      data: bookings
    }
  } catch (error) {
    return handleFirebaseError(error)
  }
}

export const getAdminContactSubmissions = async (page: number = 1, limit: number = 50): Promise<FirebaseApiResponse> => {
  try {
    const offset = (page - 1) * limit
    
    const snapshot = await getDocs(query(
      collection(db, COLLECTIONS.CONTACT_SUBMISSIONS),
      orderBy('createdAt', 'desc'),
      limit(limit)
    ))

    const submissions = snapshot.docs.map(doc => ({
      ...convertTimestamps(doc.data()),
      id: doc.id
    }))

    return {
      success: true,
      data: submissions
    }
  } catch (error) {
    return handleFirebaseError(error)
  }
}

export const getAdminBrochureRequests = async (page: number = 1, limit: number = 50): Promise<FirebaseApiResponse> => {
  try {
    const offset = (page - 1) * limit
    
    const snapshot = await getDocs(query(
      collection(db, COLLECTIONS.BROCHURE_REQUESTS),
      orderBy('createdAt', 'desc'),
      limit(limit)
    ))

    const requests = snapshot.docs.map(doc => ({
      ...convertTimestamps(doc.data()),
      id: doc.id
    }))

    return {
      success: true,
      data: requests
    }
  } catch (error) {
    return handleFirebaseError(error)
  }
}

export const getAdminExerciseResponses = async (page: number = 1, limit: number = 50): Promise<FirebaseApiResponse> => {
  try {
    const offset = (page - 1) * limit
    
    const snapshot = await getDocs(query(
      collection(db, COLLECTIONS.EXERCISE_RESPONSES),
      orderBy('createdAt', 'desc'),
      limit(limit)
    ))

    const responses = snapshot.docs.map(doc => ({
      ...convertTimestamps(doc.data()),
      id: doc.id
    }))

    return {
      success: true,
      data: responses
    }
  } catch (error) {
    return handleFirebaseError(error)
  }
}

export const getAdminAssessments = async (page: number = 1, limit: number = 50): Promise<FirebaseApiResponse> => {
  // Assessments are stored in exercise_responses with exercise_type 'assessment'
  try {
    const offset = (page - 1) * limit
    
    const snapshot = await getDocs(query(
      collection(db, COLLECTIONS.EXERCISE_RESPONSES),
      where('exerciseType', '==', 'assessment'),
      orderBy('createdAt', 'desc'),
      limit(limit)
    ))

    const assessments = snapshot.docs.map(doc => ({
      ...convertTimestamps(doc.data()),
      id: doc.id
    }))

    return {
      success: true,
      data: assessments
    }
  } catch (error) {
    return handleFirebaseError(error)
  }
}

export const getAdminNewsletterSubscribers = async (page: number = 1, limit: number = 50): Promise<FirebaseApiResponse> => {
  try {
    const offset = (page - 1) * limit
    
    const snapshot = await getDocs(query(
      collection(db, COLLECTIONS.EMAIL_SUBSCRIBERS),
      orderBy('createdAt', 'desc'),
      limit(limit)
    ))

    const subscribers = snapshot.docs.map(doc => ({
      ...convertTimestamps(doc.data()),
      id: doc.id
    }))

    return {
      success: true,
      data: subscribers
    }
  } catch (error) {
    return handleFirebaseError(error)
  }
}

export const updateWorkshopBookingStatus = async (id: string, status: string): Promise<FirebaseApiResponse> => {
  try {
    await updateDoc(doc(db, COLLECTIONS.WORKSHOP_BOOKINGS, id), {
      status,
      updatedAt: serverTimestamp()
    })

    return {
      success: true,
      message: 'Workshop booking status updated successfully'
    }
  } catch (error) {
    return handleFirebaseError(error)
  }
}

export const getAdminLearningProgress = async (page: number = 1, limit: number = 50): Promise<FirebaseApiResponse> => {
  try {
    const offset = (page - 1) * limit
    
    const snapshot = await getDocs(query(
      collection(db, COLLECTIONS.LEARNING_PROGRESS),
      orderBy('createdAt', 'desc'),
      limit(limit)
    ))

    const progress = snapshot.docs.map(doc => ({
      ...convertTimestamps(doc.data()),
      id: doc.id
    }))

    return {
      success: true,
      data: progress
    }
  } catch (error) {
    return handleFirebaseError(error)
  }
}

// Test connection function
export const testFirebaseConnection = async (): Promise<boolean> => {
  try {
    // Try to read from a collection to test connection
    const testQuery = query(collection(db, COLLECTIONS.CONTACT_SUBMISSIONS), limit(1))
    await getDocs(testQuery)
    return true
  } catch (error) {
    console.error('Firebase connection test failed:', error)
    return false
  }
}
