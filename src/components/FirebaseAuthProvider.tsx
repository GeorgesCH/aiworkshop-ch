import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth'
import { auth } from '../config/firebase'

// Extended user type to match Supabase structure
interface ExtendedUser {
  id: string
  email: string | null
  user_metadata?: {
    name?: string
    company?: string
  }
}

// Auth context type
interface AuthContextType {
  user: ExtendedUser | null
  loading: boolean
  signUp: (email: string, password: string, userData?: { name?: string; company?: string }) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Convert Firebase user to match Supabase structure
        const extendedUser: ExtendedUser = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          user_metadata: {
            name: firebaseUser.displayName || undefined,
            company: undefined // Will be set during signup if provided
          }
        }
        setUser(extendedUser)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, userData?: { name?: string; company?: string }) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update user profile with additional data
      if (userData?.name) {
        await updateProfile(firebaseUser, {
          displayName: userData.name
        })
      }
      
      // Store additional metadata in Firestore
      if (userData?.company) {
        // You could store this in Firestore user document if needed
        console.log('Company data:', userData.company)
      }
      
      return { error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      return { error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return { error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      return { error }
    }
  }

  const signOutUser = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/reset-password`
      })
      return { error: null }
    } catch (error) {
      console.error('Password reset error:', error)
      return { error }
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut: signOutUser,
    resetPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a FirebaseAuthProvider')
  }
  return context
}
