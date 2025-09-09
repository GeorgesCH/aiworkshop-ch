import { Target, Calendar, Users, Brain } from "lucide-react";

export interface Exercise {
  id: string;
  titleKey: string;
  descriptionKey: string;
  icon: any;
  durationKey: string;
  difficultyKey: string;
}

export const exercises: Exercise[] = [
  {
    id: "ai-tasks",
    titleKey: "exercises.ai_tasks.title",
    descriptionKey: "exercises.ai_tasks.description",
    icon: Target,
    durationKey: "exercises.duration_10min",
    difficultyKey: "exercises.difficulty_beginner"
  },
  {
    id: "future-planning",
    titleKey: "exercises.future_planning.title",
    descriptionKey: "exercises.future_planning.description",
    icon: Calendar,
    durationKey: "exercises.duration_25min", 
    difficultyKey: "exercises.difficulty_intermediate"
  },
  {
    id: "tool-sharing",
    titleKey: "exercises.tool_sharing.title",
    descriptionKey: "exercises.tool_sharing.description",
    icon: Users,
    durationKey: "exercises.duration_15min",
    difficultyKey: "exercises.difficulty_beginner"
  },
  {
    id: "ai-task-coach",
    titleKey: "exercises.ai_task_coach.title",
    descriptionKey: "exercises.ai_task_coach.description",
    icon: Brain,
    durationKey: "exercises.duration_30min",
    difficultyKey: "exercises.difficulty_intermediate"
  }
];