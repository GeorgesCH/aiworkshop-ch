import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Target, Calendar, Users, Save, Share2, Lightbulb, BookOpen, CheckCircle, Clock, Trophy } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "../LanguageProvider";
import { saveExerciseResponse, autoSaveExercise, calculateCompletionPercentage } from "../../utils/exerciseApi";
// Removed old API import - using Supabase now

interface ExerciseComponentProps {
  responses: Record<string, any>;
  updateResponse: (exerciseId: string, field: string, value: string) => void;
  userDetails?: {
    name: string;
    email: string;
    company?: string;
  };
}

export function AITasksExercise({ responses, updateResponse, userDetails }: ExerciseComponentProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const { t } = useLanguage();
  
  const exerciseData = responses['ai-tasks'] || {};
  const completedFields = Object.values(exerciseData).filter(value => value && value.trim().length > 0).length;
  const totalFields = 4;
  const progress = calculateCompletionPercentage('ai-tasks', exerciseData);

  // Auto-save when responses change
  useEffect(() => {
    if (Object.keys(exerciseData).length > 0) {
      autoSaveExercise('ai-tasks', exerciseData);
    }
  }, [exerciseData]);

  const handleSave = async () => {
    if (Object.keys(exerciseData).length === 0) {
      toast.error("Please fill in at least one field before saving");
      return;
    }

    setIsSaving(true);
    try {
      await saveExerciseResponse({
        exercise_type: 'ai-tasks',
        responses: exerciseData,
        completion_status: 'in_progress',
        user_details: userDetails,
      });
      toast.success(t("exercises.ai_tasks.save_success") || "Progress saved successfully!");
    } catch (error) {
      console.error('AI Tasks save error:', error);
      if (error && typeof error === 'object' && 'message' in error) {
        const errorObj = error as any;
        if (errorObj.isValidationError && errorObj.isValidationError()) {
          const validationErrors = errorObj.getValidationErrors ? errorObj.getValidationErrors() : [];
          toast.error(`Validation failed: ${validationErrors.join(', ')}`);
        } else if (errorObj.isNetworkError && errorObj.isNetworkError()) {
          toast.error("Network error. Please check your connection and try again.");
        } else if (errorObj.isTimeoutError && errorObj.isTimeoutError()) {
          toast.error("Request timed out. Please try again.");
        } else {
          toast.error(errorObj.message || "Failed to save progress.");
        }
      } else {
        toast.error("Failed to save progress. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleComplete = async () => {
    if (completedFields >= 3) {
      setIsSaving(true);
      try {
        await saveExerciseResponse({
          exercise_type: 'ai-tasks',
          responses: exerciseData,
          completion_status: 'completed',
          user_details: userDetails,
        });
        setIsCompleted(true);
        toast.success(t("exercises.ai_tasks.complete_success") || "Exercise completed successfully!");
      } catch (error) {
        console.error('AI Tasks complete error:', error);
        if (error && typeof error === 'object' && 'message' in error) {
          const errorObj = error as any;
          if (errorObj.isValidationError && errorObj.isValidationError()) {
            const validationErrors = errorObj.getValidationErrors ? errorObj.getValidationErrors() : [];
            toast.error(`Validation failed: ${validationErrors.join(', ')}`);
          } else if (errorObj.isNetworkError && errorObj.isNetworkError()) {
            toast.error("Network error. Please check your connection and try again.");
          } else if (errorObj.isTimeoutError && errorObj.isTimeoutError()) {
            toast.error("Request timed out. Please try again.");
          } else {
            toast.error(errorObj.message || "Failed to complete exercise.");
          }
        } else {
          toast.error("Failed to complete exercise. Please try again.");
        }
      } finally {
        setIsSaving(false);
      }
    } else {
      toast.error(t("exercises.ai_tasks.complete_error") || "Please complete at least 3 sections before marking as complete.");
    }
  };
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="flex items-center gap-3">
            <Target className="w-6 h-6 text-primary" />
            {t("exercises.ai_tasks.title")}
          </CardTitle>
          <div className="flex items-center gap-3">
            <Badge variant={isCompleted ? "default" : "secondary"} className="gap-1">
              {isCompleted ? <Trophy className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
              {isCompleted ? t("exercises.ai_tasks.completed") : t("exercises.ai_tasks.in_progress")}
            </Badge>
            <Badge variant="outline">
              {completedFields}/{totalFields} {t("exercises.ai_tasks.sections")}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{t("exercises.ai_tasks.progress")}</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <p className="text-gray-600">
          {t("exercises.ai_tasks.description")}
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3">
              1. {t("exercises.ai_tasks.question_1")}
            </label>
            <Textarea
              placeholder={t("exercises.ai_tasks.placeholder_1")}
              rows={5}
              value={responses['ai-tasks']?.tasks || ''}
              onChange={(e) => updateResponse('ai-tasks', 'tasks', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">
              2. {t("exercises.ai_tasks.question_2")}
            </label>
            <Textarea
              placeholder={t("exercises.ai_tasks.placeholder_2")}
              rows={3}
              value={responses['ai-tasks']?.timeConsumers || ''}
              onChange={(e) => updateResponse('ai-tasks', 'timeConsumers', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">
              3. {t("exercises.ai_tasks.question_3")}
            </label>
            <Textarea
              placeholder={t("exercises.ai_tasks.placeholder_3")}
              rows={4}
              value={responses['ai-tasks']?.aiOpportunities || ''}
              onChange={(e) => updateResponse('ai-tasks', 'aiOpportunities', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">
              4. {t("exercises.ai_tasks.question_4")}
            </label>
            <Textarea
              placeholder={t("exercises.ai_tasks.placeholder_4")}
              rows={3}
              value={responses['ai-tasks']?.concerns || ''}
              onChange={(e) => updateResponse('ai-tasks', 'concerns', e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : t("exercises.ai_tasks.save_progress")}
          </Button>
          <Button 
            onClick={handleComplete}
            disabled={isSaving}
            variant={isCompleted ? "secondary" : "default"}
            className="gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            {isCompleted ? t("exercises.ai_tasks.completed") : t("exercises.ai_tasks.complete_exercise")}
          </Button>
        </div>
        
        {isCompleted && (
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900 dark:text-green-100 mb-1">
                    {t("exercises.ai_tasks.success_title")}
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {t("exercises.ai_tasks.success_description")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}

export function FuturePlanningExercise({ responses, updateResponse, userDetails }: ExerciseComponentProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const { t } = useLanguage();
  
  const exerciseData = responses['future-planning'] || {};
  const yearFields = [0, 1, 2, 3, 4, 5].flatMap(year => 
    [`year${year}_professional`, `year${year}_personal`]
  );
  const completedYearFields = yearFields.filter(field => exerciseData[field] && exerciseData[field].trim().length > 0).length;
  const storyCompleted = exerciseData.story && exerciseData.story.trim().length > 0;
  const totalFields = yearFields.length + 1; // +1 for story
  const progress = ((completedYearFields + (storyCompleted ? 1 : 0)) / totalFields) * 100;

  const handleSave = async () => {
    try {
      await saveExerciseResponse({
        exercise_type: 'future-planning',
        responses: exerciseData,
        completion_status: 'in_progress',
        user_details: userDetails,
      });
      toast.success(t("exercises.future_planning.save_success"));
    } catch (error) {
      console.error('Future Planning save error:', error);
      toast.error("Failed to save progress. Please try again.");
    }
  };

  const handleComplete = async () => {
    if (completedYearFields >= 6 && storyCompleted) {
      try {
        await saveExerciseResponse({
          exercise_type: 'future-planning',
          responses: exerciseData,
          completion_status: 'completed',
          user_details: userDetails,
        });
        setIsCompleted(true);
        toast.success(t("exercises.future_planning.complete_success"));
      } catch (error) {
        console.error('Future Planning complete error:', error);
        toast.error("Failed to complete exercise. Please try again.");
      }
    } else {
      toast.error(t("exercises.future_planning.complete_error"));
    }
  };
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-primary" />
            {t("exercises.future_planning.title")}
          </CardTitle>
          <div className="flex items-center gap-3">
            <Badge variant={isCompleted ? "default" : "secondary"} className="gap-1">
              {isCompleted ? <Trophy className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
              {isCompleted ? t("exercises.ai_tasks.completed") : t("exercises.ai_tasks.in_progress")}
            </Badge>
            <Badge variant="outline">
              {Math.round(progress)}% {t("exercises.future_planning.complete")}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-3">
          <Progress value={progress} className="h-2" />
        </div>
        
        <p className="text-gray-600">
          {t("exercises.future_planning.description")}
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Timeline Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-medium">{t("exercises.future_planning.worksheet_title")}</h3>
          <p className="text-sm text-gray-600">
            {t("exercises.future_planning.quote")}
          </p>
          
          {[0, 1, 2, 3, 4, 5].map((year) => (
            <div key={year} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">{year}</span>
                </div>
                <h4 className="text-lg font-medium">
                  {year === 0 ? t("exercises.future_planning.today") : `${t("exercises.future_planning.year")} ${year}`}
                </h4>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 ml-11">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("exercises.future_planning.professional_changes")}
                  </label>
                  <Textarea
                    placeholder={year === 0 ? t("exercises.future_planning.current_role_placeholder") : t("exercises.future_planning.future_professional_placeholder")}
                    rows={3}
                    value={responses['future-planning']?.[`year${year}_professional`] || ''}
                    onChange={(e) => updateResponse('future-planning', `year${year}_professional`, e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {t("exercises.future_planning.personal_changes")}
                  </label>
                  <Textarea
                    placeholder={year === 0 ? t("exercises.future_planning.current_personal_placeholder") : t("exercises.future_planning.future_personal_placeholder")}
                    rows={3}
                    value={responses['future-planning']?.[`year${year}_personal`] || ''}
                    onChange={(e) => updateResponse('future-planning', `year${year}_personal`, e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="space-y-6 pt-8 border-t">
          <h3 className="text-xl font-medium">{t("exercises.future_planning.story_title")}</h3>
          <p className="text-gray-600">
            {t("exercises.future_planning.story_intro")}
          </p>
          <p className="text-gray-600">
            {t("exercises.future_planning.story_description")}
          </p>
          
          <Textarea
            placeholder={t("exercises.future_planning.story_placeholder")}
            rows={8}
            value={responses['future-planning']?.story || ''}
            onChange={(e) => updateResponse('future-planning', 'story', e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            {t("exercises.future_planning.save_vision")}
          </Button>
          <Button 
            onClick={handleComplete}
            variant={isCompleted ? "secondary" : "default"}
            className="gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            {isCompleted ? t("exercises.future_planning.vision_complete") : t("exercises.future_planning.complete_vision")}
          </Button>
          <Button variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" />
            {t("exercises.future_planning.share_story")}
          </Button>
        </div>
        
        {isCompleted && (
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    {t("exercises.future_planning.vision_completed_title")}
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {t("exercises.future_planning.vision_completed_description")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}

export function ToolSharingExercise({ responses, updateResponse, userDetails }: ExerciseComponentProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const { t } = useLanguage();
  
  const exerciseData = responses['tool-sharing'] || {};
  const fields = ['currentTools', 'recommendation', 'workflowImpact', 'wantToLearn', 'challenge'];
  const completedFields = fields.filter(field => exerciseData[field] && exerciseData[field].trim().length > 0).length;
  const totalFields = fields.length;
  const progress = (completedFields / totalFields) * 100;

  const handleSave = async () => {
    try {
      await saveExerciseResponse({
        exercise_type: 'tool-sharing',
        responses: exerciseData,
        completion_status: 'in_progress',
        user_details: userDetails,
      });
      toast.success(t("exercises.tool_sharing.save_success"));
    } catch (error) {
      console.error('Tool Sharing save error:', error);
      toast.error("Failed to save progress. Please try again.");
    }
  };

  const handleComplete = async () => {
    if (completedFields >= 4) {
      try {
        await saveExerciseResponse({
          exercise_type: 'tool-sharing',
          responses: exerciseData,
          completion_status: 'completed',
          user_details: userDetails,
        });
        setIsCompleted(true);
        toast.success(t("exercises.tool_sharing.complete_success"));
      } catch (error) {
        console.error('Tool Sharing complete error:', error);
        toast.error("Failed to complete exercise. Please try again.");
      }
    } else {
      toast.error(t("exercises.tool_sharing.complete_error"));
    }
  };
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" />
            {t("exercises.tool_sharing.title")}
          </CardTitle>
          <div className="flex items-center gap-3">
            <Badge variant={isCompleted ? "default" : "secondary"} className="gap-1">
              {isCompleted ? <Trophy className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
              {isCompleted ? t("exercises.tool_sharing.shared") : t("exercises.ai_tasks.in_progress")}
            </Badge>
            <Badge variant="outline">
              {completedFields}/{totalFields} {t("exercises.ai_tasks.sections")}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{t("exercises.tool_sharing.completion")}</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <p className="text-gray-600">
          {t("exercises.tool_sharing.description")}
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3">
              1. {t("exercises.tool_sharing.question_1")}
            </label>
            <Textarea
              placeholder={t("exercises.tool_sharing.placeholder_1")}
              rows={4}
              value={responses['tool-sharing']?.currentTools || ''}
              onChange={(e) => updateResponse('tool-sharing', 'currentTools', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">
              2. {t("exercises.tool_sharing.question_2")}
            </label>
            <Textarea
              placeholder={t("exercises.tool_sharing.placeholder_2")}
              rows={4}
              value={responses['tool-sharing']?.recommendation || ''}
              onChange={(e) => updateResponse('tool-sharing', 'recommendation', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">
              3. {t("exercises.tool_sharing.question_3")}
            </label>
            <Textarea
              placeholder={t("exercises.tool_sharing.placeholder_3")}
              rows={4}
              value={responses['tool-sharing']?.workflowImpact || ''}
              onChange={(e) => updateResponse('tool-sharing', 'workflowImpact', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">
              4. {t("exercises.tool_sharing.question_4")}
            </label>
            <Input
              placeholder={t("exercises.tool_sharing.placeholder_4")}
              value={responses['tool-sharing']?.wantToLearn || ''}
              onChange={(e) => updateResponse('tool-sharing', 'wantToLearn', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">
              5. {t("exercises.tool_sharing.question_5")}
            </label>
            <Textarea
              placeholder={t("exercises.tool_sharing.placeholder_5")}
              rows={3}
              value={responses['tool-sharing']?.challenge || ''}
              onChange={(e) => updateResponse('tool-sharing', 'challenge', e.target.value)}
            />
          </div>
        </div>

        <div className="bg-gray-100/20 rounded-lg p-6">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            {t("exercises.tool_sharing.community_insights_title")}
          </h4>
          <p className="text-sm text-gray-600">
            {t("exercises.tool_sharing.community_insights_description")}
          </p>
        </div>

        <div className="flex gap-4">
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            {t("exercises.tool_sharing.save_share")}
          </Button>
          <Button 
            onClick={handleComplete}
            variant={isCompleted ? "secondary" : "default"}
            className="gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            {isCompleted ? t("exercises.tool_sharing.contribution_shared") : t("exercises.tool_sharing.complete_share")}
          </Button>
          <Button variant="outline" className="gap-2">
            <BookOpen className="w-4 h-4" />
            {t("exercises.tool_sharing.view_community_tools")}
          </Button>
        </div>
        
        {isCompleted && (
          <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-1">
                    {t("exercises.tool_sharing.thank_you_title")}
                  </h4>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    {t("exercises.tool_sharing.thank_you_description")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}