import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Play, BookOpen, CheckCircle } from 'lucide-react';
import { useLearningProgress } from '../hooks/useLearningProgress';
import { learnHubCourseKey, learnCourseModules } from './learn/courseMap';
import { useLanguage } from './LanguageProvider';

interface ResumeLearningBannerProps {
  onPageChange: (id: string) => void;
}

export function ResumeLearningBanner({ onPageChange }: ResumeLearningBannerProps) {
  const { t } = useLanguage();
  const modules = React.useMemo(() => learnCourseModules.map(m => ({ moduleKey: m.id, routeId: m.routeId, title: m.title })), []);
  const { overall, nextModule } = useLearningProgress(learnHubCourseKey, modules as any);

  if (!nextModule && overall === 0) return null; // no progress yet; hide

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        <Card className="relative overflow-hidden border border-border/60 shadow-xl bg-background/90 backdrop-blur-sm mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" aria-hidden="true" />
          <CardContent className="relative p-6 lg:p-8">
            <div className="flex items-center gap-4 justify-between">
              <div className="flex-1">
                <div className="text-sm text-muted-foreground">{t('resume.banner_title', 'Resume your learning')}</div>
                <div className="text-xl font-medium text-foreground">{overall === 100 ? t('resume.completed', 'All modules completed!') : t('resume.progress', 'You are making great progress.')}</div>
                <div className="flex items-center gap-3 mt-3">
                  <div className="w-52">
                    <Progress value={overall} />
                  </div>
                  <div className="text-xs text-muted-foreground">{overall}%</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {overall === 100 ? (
                  <Button onClick={() => onPageChange('learn')} className="gap-2">
                    <CheckCircle className="w-4 h-4"/> {t('resume.explore', 'Explore Learn Hub')}
                  </Button>
                ) : (
                  <Button onClick={() => onPageChange(nextModule?.routeId || 'learn')} className="gap-2">
                    <Play className="w-4 h-4"/> {t('resume.continue', 'Continue learning')}
                  </Button>
                )}
                <Button variant="outline" onClick={() => onPageChange('learn')} className="gap-2">
                  <BookOpen className="w-4 h-4"/> {t('resume.view_path', 'View course path')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

