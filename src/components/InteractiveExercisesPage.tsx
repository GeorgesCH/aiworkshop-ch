import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  ArrowLeft, 
  Brain,
  Clock,
  Calendar,
  LogOut,
  User as UserIcon
} from "lucide-react";
import { exercises } from "./data/exercises";
import { AITasksExercise, FuturePlanningExercise, ToolSharingExercise } from "./exercises/ExerciseComponents";
import { AITaskCoachExerciseWrapper } from "./exercises/AITaskCoachExerciseWrapper";
import { useLanguage } from "./LanguageProvider";
import { useAuth } from "./AuthProvider";
import { AuthModal } from "./auth/AuthModal";
import { toast } from "sonner";

interface InteractiveExercisesPageProps {
  onBackToHome?: () => void;
  onPageChange?: (page: string) => void;
}

export function InteractiveExercisesPage({ onBackToHome, onPageChange }: InteractiveExercisesPageProps) {
  const { t } = useLanguage();
  const { user, signOut, loading: authLoading } = useAuth();
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [showAuthModal, setShowAuthModal] = useState(false);

  const updateResponse = (exerciseId: string, field: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [field]: value
      }
    }));
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  const getUserDetails = () => {
    if (!user) return null;
    
    return {
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      company: user.user_metadata?.company || ''
    };
  };

  if (selectedExercise) {
    return (
      <div className="min-h-screen">
        <section className="py-16 lg:py-24">
          <div className="max-w-6xl mx-auto px-4">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedExercise(null)}
              className="mb-8 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("exercises.back_to_exercises")}
            </Button>

            {selectedExercise === "ai-tasks" && <AITasksExercise responses={responses} updateResponse={updateResponse} userDetails={getUserDetails()} />}
            {selectedExercise === "future-planning" && <FuturePlanningExercise responses={responses} updateResponse={updateResponse} userDetails={getUserDetails()} />}
            {selectedExercise === "tool-sharing" && <ToolSharingExercise responses={responses} updateResponse={updateResponse} userDetails={getUserDetails()} />}
            {selectedExercise === "ai-task-coach" && <AITaskCoachExerciseWrapper responses={responses} updateResponse={updateResponse} userDetails={getUserDetails()} />}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            {onBackToHome && (
              <Button 
                variant="ghost" 
                onClick={onBackToHome}
                className="mb-8 gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t("exercises.back_to_home")}
              </Button>
            )}
            
            <div className="text-center">
              <Badge variant="outline" className="mb-4 px-4 py-2 border border-gray-200/60 bg-white/60 backdrop-blur-sm">
                {t("exercises.page_badge")}
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary/80 bg-clip-text text-transparent">
                {t("exercises.page_title")}
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                {t("exercises.page_subtitle")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Authentication Section */}
      {!user && !authLoading && (
        <section className="py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-4">
            <Card className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary/80 bg-clip-text text-transparent">
                    Get Started with Your AI Journey
                  </h2>
                  <p className="text-gray-600">
                    Sign in or create an account to access interactive exercises and receive personalized recommendations.
                  </p>
                </div>

                <div className="text-center">
                  <Button 
                    onClick={() => setShowAuthModal(true)}
                    className="gap-3 px-8 py-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <UserIcon className="w-4 h-4" />
                    Get Started - Sign Up
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* User Welcome Message */}
      {user && (
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4">
            <Card className="relative overflow-hidden border border-green-500/60 shadow-xl bg-green-50/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserIcon className="w-6 h-6 text-green-600" />
                    <div>
                      <h3 className="font-semibold text-green-900">Welcome, {getUserDetails()?.name}!</h3>
                      <p className="text-sm text-green-700">You're signed in and ready to start your AI journey.</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="gap-2 border border-green-500/60 hover:border-green-500/80 text-green-700 hover:text-green-800"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Exercises Grid */}
      <section className="py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid gap-8">
              {exercises.map((exercise) => {
                const IconComponent = exercise.icon;
                const isDisabled = !user;
                return (
                  <Card key={exercise.id} className={`group relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm transition-all duration-300 ${
                    isDisabled 
                      ? 'opacity-60 cursor-pointer' 
                      : 'hover:shadow-2xl hover:scale-105 cursor-pointer'
                  }`}
                        onClick={() => {
                          if (isDisabled) {
                            setShowAuthModal(true);
                          } else {
                            setSelectedExercise(exercise.id);
                          }
                        }}>
                    <CardContent className="p-8">
                      <div className="flex items-start gap-6">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                          <IconComponent className="w-8 h-8 text-primary" />
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-2xl font-medium group-hover:text-primary transition-colors">
                              {t(exercise.titleKey)}
                            </h3>
                            <div className="flex gap-2">
                              <Badge variant="outline" className="gap-1">
                                <Clock className="w-3 h-3" />
                                {t(exercise.durationKey)}
                              </Badge>
                              <Badge variant="secondary">
                                {t(exercise.difficultyKey)}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-gray-600 leading-relaxed text-lg">
                            {t(exercise.descriptionKey)}
                          </p>
                          <div className="flex items-center gap-2 text-primary group-hover:gap-3 transition-all">
                            <span className="font-medium">
                              {isDisabled ? t('header.sign_in', 'Sign in') + ' to start' : t("exercises.start_exercise")}
                            </span>
                            <ArrowLeft className="w-4 h-4 rotate-180" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Call to Action */}
            <div className="mt-16 text-center">
              <Card className="relative overflow-hidden border border-gray-200/60 shadow-xl bg-white/90 backdrop-blur-sm">
                <CardContent className="p-12">
                  <Brain className="w-12 h-12 text-primary mx-auto mb-6" />
                  <h3 className="text-2xl font-medium mb-4 bg-gradient-to-r from-foreground to-primary/80 bg-clip-text text-transparent">
                    Ready to Take Your AI Skills Further?
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                    Complete these exercises to get personalized AI recommendations, then join our hands-on workshops to implement AI in your daily work.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      size="lg" 
                      className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      onClick={() => onPageChange && onPageChange("workshop-booking")}
                    >
                      <Calendar className="w-4 h-4" />
                      Book a Workshop
                    </Button>
                    {onBackToHome && (
                      <Button 
                        variant="outline" 
                        size="lg" 
                        onClick={onBackToHome}
                        className="border border-gray-200/60 hover:border-primary/30 transition-all duration-300 hover:scale-105"
                      >
                        Explore More Learning
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal 
        open={showAuthModal} 
        onOpenChange={setShowAuthModal}
        mode="signup"
      />
    </div>
  );
}
