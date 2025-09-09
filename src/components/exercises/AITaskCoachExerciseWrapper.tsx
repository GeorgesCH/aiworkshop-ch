import React from "react";
import AITaskCoachExercise from "./AITaskCoachExercise";
import { useLanguage } from "../LanguageProvider";

interface AITaskCoachExerciseWrapperProps {
  responses: Record<string, any>;
  updateResponse: (exerciseId: string, field: string, value: string) => void;
  userDetails?: {
    name: string;
    email: string;
    company?: string;
  };
}

export function AITaskCoachExerciseWrapper({ 
  responses, 
  updateResponse,
  userDetails
}: AITaskCoachExerciseWrapperProps) {
  const { t } = useLanguage();

  const handleSave = async (data: Record<string, any>, status: string) => {
    // Update the responses state with the exercise data
    Object.entries(data).forEach(([key, value]) => {
      updateResponse("ai-task-coach", key, value as string);
    });
    
    console.log("AI Task Coach Exercise saved:", { data, status, userDetails });
    
    // TODO: Connect to your API (Supabase / Firestore / etc.)
    // Example: await saveExerciseResponse({ 
    //   exercise_type: 'ai-task-coach', 
    //   responses: data, 
    //   completion_status: status,
    //   user_details: userDetails
    // });
  };

  const handleStatusChange = async (status: string, data: Record<string, any>) => {
    console.log("AI Task Coach Exercise status changed:", { status, data });
    
    // TODO: Send email / update status
    // Example: await sendExerciseCompletionEmail(data);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {t("exercises.ai_task_coach.title")}
        </h1>
        <p className="text-lg text-gray-600">
          {t("exercises.ai_task_coach.description")}
        </p>
      </div>
      
      <AITaskCoachExercise
        storageKey="ai-task-coach"
        initialData={responses["ai-task-coach"] || {}}
        onSave={handleSave}
        onStatusChange={handleStatusChange}
        className="w-full"
      />
    </div>
  );
}
