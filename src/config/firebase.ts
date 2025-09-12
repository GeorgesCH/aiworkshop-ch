import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

// Validate required environment variables
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN', 
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
]

const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName])
if (missingVars.length > 0) {
  throw new Error(`Missing Firebase environment variables: ${missingVars.join(', ')}. Please add them to your .env file.`)
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Connect to emulators in development
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true') {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099')
    connectFirestoreEmulator(db, 'localhost', 8080)
    connectStorageEmulator(storage, 'localhost', 9199)
    console.log('Connected to Firebase emulators')
  } catch (error) {
    console.warn('Firebase emulators already connected or not available')
  }
}

// Firestore collection names
export const COLLECTIONS = {
  CONTACT_SUBMISSIONS: 'contactSubmissions',
  WORKSHOP_BOOKINGS: 'workshopBookings',
  BROCHURE_REQUESTS: 'brochureRequests',
  EXERCISE_RESPONSES: 'exerciseResponses',
  EMAIL_SUBSCRIBERS: 'emailSubscribers',
  PAGE_ANALYTICS: 'pageAnalytics',
  LEARNING_PROGRESS: 'learningProgress',
  DEVELOPMENT_ESTIMATES: 'developmentEstimates',
  DISCOVERY_CALLS: 'discoveryCalls',
} as const

// TypeScript interfaces for Firestore documents
export interface ContactSubmission {
  id?: string
  name: string
  email: string
  company?: string
  phone?: string
  message: string
  service?: string
  formType: 'contact_page' | 'contact_section'
  ipAddress?: string
  userAgent?: string
  createdAt: Date
  updatedAt: Date
}

export interface WorkshopBooking {
  id?: string
  firstName: string
  lastName: string
  email: string
  company?: string
  phone?: string
  position?: string
  teamSize?: number
  workshopType: string
  preferredDate?: string
  preferredTime?: string
  language: string
  locationPreference?: string
  message?: string
  budgetRange?: string
  additionalInfo?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  status?: 'draft' | 'pending' | 'confirmed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

export interface BrochureRequest {
  id?: string
  firstName: string
  lastName: string
  email: string
  company: string
  position?: string
  teamSize?: string
  city?: string
  industry?: string
  specificInterests?: string
  ipAddress?: string
  userAgent?: string
  createdAt: Date
  updatedAt: Date
}

export interface ExerciseResponse {
  id?: string
  exerciseType: string
  userSessionId?: string
  email?: string
  responses: Record<string, any>
  completionStatus?: 'in_progress' | 'completed' | 'abandoned'
  completionPercentage?: number
  timeSpentMinutes?: number
  ipAddress?: string
  userAgent?: string
  createdAt: Date
  updatedAt: Date
}

export interface EmailSubscriber {
  id?: string
  email: string
  firstName?: string
  lastName?: string
  company?: string
  subscriptionSource?: string
  isActive?: boolean
  preferences?: Record<string, any>
  ipAddress?: string
  createdAt: Date
  updatedAt: Date
}

export interface PageAnalytics {
  id?: string
  pagePath: string
  referrer?: string
  userSessionId?: string
  ipAddress?: string
  userAgent?: string
  deviceType?: string
  browser?: string
  country?: string
  city?: string
  visitDurationSeconds?: number
  createdAt: Date
}

export interface LearningProgress {
  id?: string
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
  createdAt: Date
  updatedAt: Date
}

export interface DevelopmentEstimate {
  id?: string
  projectName?: string
  company?: string
  contactName?: string
  email: string
  phone?: string
  
  // Scope
  webApp?: boolean
  adminDashboard?: boolean
  mobileIos?: boolean
  mobileAndroid?: boolean
  
  // AI Features
  aiChatAgent?: boolean
  ragSearch?: boolean
  analyticsDashboard?: boolean
  firebaseAuth?: boolean
  payments?: boolean
  fileStorage?: boolean
  apiIntegrations?: string[]
  
  // Estimate inputs
  complexity?: 'starter' | 'standard' | 'advanced'
  timelineWeeks?: number
  languages?: string[]
  
  // Derived pricing
  priceChf?: number
  priceBreakdown?: Record<string, any>
  
  // Meta
  notes?: string
  ipAddress?: string
  userAgent?: string
  status?: 'new' | 'contacted' | 'archived'
  createdAt: Date
  updatedAt: Date
}

export interface DiscoveryCall {
  id?: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  position?: string
  
  // Call scheduling
  preferredDate?: string
  preferredTime?: string
  callDuration?: '15' | '30' | '45' | '60'
  callType?: 'video' | 'phone' | 'in-person'
  timezone?: string
  
  // Company information
  companySize?: string
  industry?: string
  currentAiUsage?: string
  challenges?: string
  goals?: string
  budgetRange?: string
  howDidYouHear?: string
  specialRequirements?: string
  
  // Meta
  status?: 'pending' | 'scheduled' | 'completed' | 'cancelled'
  ipAddress?: string
  userAgent?: string
  createdAt: Date
  updatedAt: Date
}

// Helper functions for client info
export const getClientInfo = () => {
  return {
    userAgent: navigator.userAgent,
    // Note: IP address will be handled server-side by Firebase Functions if needed
  }
}

// Helper function to convert Firestore timestamps to dates
export const convertTimestamps = (data: any): any => {
  if (!data) return data
  
  const converted = { ...data }
  
  // Convert Firestore timestamps to Date objects
  if (converted.createdAt && typeof converted.createdAt.toDate === 'function') {
    converted.createdAt = converted.createdAt.toDate()
  }
  if (converted.updatedAt && typeof converted.updatedAt.toDate === 'function') {
    converted.updatedAt = converted.updatedAt.toDate()
  }
  if (converted.startedAt && typeof converted.startedAt.toDate === 'function') {
    converted.startedAt = converted.startedAt.toDate()
  }
  if (converted.completedAt && typeof converted.completedAt.toDate === 'function') {
    converted.completedAt = converted.completedAt.toDate()
  }
  if (converted.lastVisitedAt && typeof converted.lastVisitedAt.toDate === 'function') {
    converted.lastVisitedAt = converted.lastVisitedAt.toDate()
  }
  
  return converted
}

export default app
