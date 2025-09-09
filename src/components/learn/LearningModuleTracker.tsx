import React, { useEffect } from 'react';
import { useLearningProgress } from '../../hooks/useLearningProgress';
import { learnCourseModules, learnHubCourseKey } from './courseMap';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';

interface LearningModuleTrackerProps {
  moduleKey: string;        // e.g., 'learn-machine-learning'
  autoStart?: boolean;      // mark in_progress on mount
}

export function LearningModuleTracker({ moduleKey, autoStart = true }: LearningModuleTrackerProps) {
  const modules = learnCourseModules.map(m => ({ moduleKey: m.id, routeId: m.routeId, title: m.title, estimatedMin: m.estimatedMin }));
  const { getModuleProgress, setModuleProgress, markComplete } = useLearningProgress(learnHubCourseKey, modules);
  const p = getModuleProgress(moduleKey);

  useEffect(() => {
    if (autoStart && p.status === 'not_started') {
      setModuleProgress(moduleKey, { status: 'in_progress' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleKey]);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <Progress value={p.percentage} />
        </div>
        <div className="text-xs text-gray-500 w-12 text-right">{p.percentage}%</div>
        {p.status !== 'completed' && (
          <Button size="sm" variant="outline" onClick={() => markComplete(moduleKey)}>Mark complete</Button>
        )}
      </div>
    </div>
  );
}

