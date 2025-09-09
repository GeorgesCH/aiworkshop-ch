import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { CheckCircle, Play, ArrowRight, LogIn } from 'lucide-react';
import { useLearningProgress, ModuleDef } from '../../hooks/useLearningProgress';
import { learnCourseModules, learnHubCourseKey } from './courseMap';
import { useAuth } from '../AuthProvider';
import { AuthModal } from '../auth/AuthModal';
import { useLanguage } from '../LanguageProvider';

interface LearnCourseFlowProps {
  onNavigate: (routeId: string) => void;
}

export function LearnCourseFlow({ onNavigate }: LearnCourseFlowProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const modules: ModuleDef[] = learnCourseModules.map(m => ({ moduleKey: m.id, routeId: m.routeId, title: m.title, estimatedMin: m.estimatedMin }));
  const { overall, nextModule, getModuleProgress } = useLearningProgress(learnHubCourseKey, modules);

  return (
    <div className="space-y-6">
      <Card className="border border-gray-200/60 bg-white/90 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm text-gray-500">Guided Course Path</div>
              <div className="text-2xl font-light text-black">Overall Progress: {overall}%</div>
            </div>
            <div className="w-48">
              <Progress value={overall} />
            </div>
            {!user && (
              <Button variant="outline" size="sm" className="gap-2" onClick={() => setAuthModalOpen(true)}>
                <LogIn className="w-4 h-4"/> {t('header.sign_in', 'Sign in')} to save
              </Button>
            )}
            {nextModule && (
              <Button className="gap-2" onClick={() => onNavigate(nextModule.routeId)}>
                <Play className="w-4 h-4"/> Continue: {nextModule.title}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((m, idx) => {
          const p = getModuleProgress(m.moduleKey);
          const completed = p.status === 'completed';
          return (
            <Card key={m.moduleKey} className="border border-gray-200/60 bg-white/90 backdrop-blur-sm hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm text-gray-500">Step {idx+1}</div>
                    <div className="text-lg font-medium text-black">{m.title}</div>
                  </div>
                  {completed ? (
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Completed</Badge>
                  ) : (
                    <Badge variant="outline" className="border-gray-200">{m.estimatedMin ?? 10} min</Badge>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <Progress value={p.percentage} />
                  </div>
                  <div className="text-xs text-gray-500 min-w-[36px] text-right">{p.percentage}%</div>
                </div>
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm" onClick={() => onNavigate(m.routeId)} className="gap-2">
                    {completed ? <CheckCircle className="w-4 h-4"/> : <ArrowRight className="w-4 h-4"/>}
                    {completed ? 'Review' : 'Open'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      
      <AuthModal 
        open={authModalOpen} 
        onOpenChange={setAuthModalOpen}
        mode="signin"
      />
    </div>
  );
}

