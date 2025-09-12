// Exercise API utilities for saving responses to Firebase
import { submitExerciseResponse, loadExerciseResponse as loadFromFirebase, ExerciseSubmissionData } from './firebaseApi';

export interface ExerciseSubmission {
  exercise_type: 'ai-tasks' | 'future-planning' | 'tool-sharing';
  responses: Record<string, any>;
  user_session_id?: string;
  email?: string;
  completion_status?: 'in_progress' | 'completed' | 'abandoned';
  time_spent_minutes?: number;
  user_details?: {
    name: string;
    email: string;
    company?: string;
  };
}

// Generate or get session ID for tracking user across sessions
export function getSessionId(): string {
  let sessionId = localStorage.getItem('ai-workshop-session-id');
  if (!sessionId) {
    sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('ai-workshop-session-id', sessionId);
  }
  return sessionId;
}

// Save exercise response to Firebase
export async function saveExerciseResponse(submission: ExerciseSubmission): Promise<any> {
  try {
    const exerciseData: ExerciseSubmissionData = {
      exercise_type: submission.exercise_type,
      responses: submission.responses,
      user_session_id: submission.user_session_id || getSessionId(),
      email: submission.email,
      completion_status: submission.completion_status || 'in_progress',
      time_spent_minutes: submission.time_spent_minutes || 0,
      user_details: submission.user_details,
    };

    const response = await submitExerciseResponse(exerciseData);
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to save exercise response');
    }
    
    return response;
  } catch (error) {
    console.error('Exercise submission error:', error);
    throw new Error('Failed to save exercise response');
  }
}

// Load existing exercise response from Firebase
export async function loadExerciseResponse(
  exerciseType: string, 
  sessionId?: string
): Promise<any> {
  try {
    const response = await loadFromFirebase(exerciseType, sessionId || getSessionId());
    
    if (!response.success) {
      return null; // No existing response found or error occurred
    }

    // Return the first (most recent) response for this exercise type
    return response.data?.[0] || null;
  } catch (error) {
    console.error('Exercise loading error:', error);
    return null; // Fail silently for loading
  }
}

// Calculate completion percentage based on filled fields
export function calculateCompletionPercentage(
  exerciseType: string, 
  responses: Record<string, any>
): number {
  switch (exerciseType) {
    case 'ai-tasks':
      const aiTaskFields = ['currentRole', 'aiTasks', 'challenges', 'goals'];
      const aiFilledFields = aiTaskFields.filter(field => 
        responses[field] && responses[field].trim().length > 0
      ).length;
      return Math.round((aiFilledFields / aiTaskFields.length) * 100);

    case 'future-planning':
      const planningFields = ['visionStatement', 'keyObjectives', 'challenges', 'timeline'];
      const planningFilledFields = planningFields.filter(field => 
        responses[field] && responses[field].trim().length > 0
      ).length;
      return Math.round((planningFilledFields / planningFields.length) * 100);

    case 'tool-sharing':
      const toolFields = ['favoriteTools', 'workflowDescription', 'recommendations', 'wishList'];
      const toolFilledFields = toolFields.filter(field => 
        responses[field] && responses[field].trim().length > 0
      ).length;
      return Math.round((toolFilledFields / toolFields.length) * 100);

    case 'assessment':
      // Count answered questions in assessment
      const answeredQuestions = Object.keys(responses).filter(key => 
        responses[key] !== undefined && responses[key] !== null
      ).length;
      // Assessment has 5 questions: ai_awareness, current_tools, business_goals, team_readiness, implementation_timeline
      const totalQuestions = 5;
      return Math.round((answeredQuestions / totalQuestions) * 100);

    default:
      return 0;
  }
}

// Auto-save exercise response (debounced)
let autoSaveTimeout: NodeJS.Timeout | null = null;

export function autoSaveExercise(
  exerciseType: string,
  responses: Record<string, any>,
  delay: number = 2000
): Promise<void> {
  return new Promise((resolve) => {
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }

    autoSaveTimeout = setTimeout(async () => {
      try {
        const completionPercentage = calculateCompletionPercentage(exerciseType, responses);
        const completion_status = completionPercentage >= 75 ? 'completed' : 'in_progress';

        await saveExerciseResponse({
          exercise_type: exerciseType as any,
          responses,
          completion_status,
        });

        console.log(`Auto-saved ${exerciseType} exercise (${completionPercentage}% complete)`);
        resolve();
      } catch (error) {
        console.warn('Auto-save failed:', error);
        resolve(); // Don't throw on auto-save failures
      }
    }, delay);
  });
}
