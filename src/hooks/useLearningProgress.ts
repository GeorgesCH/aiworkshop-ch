import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../components/FirebaseAuthProvider';
import { getLearningProgress, upsertLearningProgress } from '../utils/firebaseApi';

export type ModuleDef = {
  moduleKey: string; // unique module key, e.g., 'learn-ai-overview'
  routeId: string;   // router page id to navigate
  title?: string;
  estimatedMin?: number;
};

export type ModuleProgress = {
  status: 'not_started' | 'in_progress' | 'completed';
  percentage: number;
  updatedAt: number;
};

type ProgressMap = Record<string, ModuleProgress>;

export function useLearningProgress(courseKey: string, modules: ModuleDef[]) {
  const storageKey = `lp:${courseKey}`;
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressMap>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const moduleIndex = useMemo(() => new Map(modules.map((m, i) => [m.moduleKey, i])), [modules]);

  // Persist locally
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(progress)); } catch {}
  }, [storageKey, progress]);

  // Load from Firebase when logged in and merge (prefer higher percentage/status)
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!user) return;
      const res = await getLearningProgress(courseKey, user.id);
      if (!mounted || !res.success || !res.data) return;
      const server = res.data;
      const merged: ProgressMap = { ...progress };
      server.forEach(row => {
        const key = row.moduleKey;
        const existing = merged[key];
        const serverStatus = row.status as ModuleProgress['status'];
        const serverPct = row.percentage ?? 0;
        const better = !existing || serverPct > existing.percentage || (existing.status !== 'completed' && serverStatus === 'completed');
        if (better) {
          merged[key] = { status: serverStatus, percentage: serverPct, updatedAt: Date.parse(row.updatedAt || row.lastVisitedAt || row.createdAt || new Date().toISOString()) };
        }
      });
      setProgress(merged);
    })();
    return () => { mounted = false };
  }, [user, courseKey]);

  const setModuleProgress = useCallback(async (moduleKey: string, next: Partial<ModuleProgress>) => {
    setProgress(prev => {
      const curr = prev[moduleKey] || { status: 'in_progress', percentage: 0, updatedAt: Date.now() };
      const updated: ModuleProgress = {
        status: next.status || curr.status,
        percentage: typeof next.percentage === 'number' ? next.percentage : curr.percentage,
        updatedAt: Date.now(),
      };
      return { ...prev, [moduleKey]: updated };
    });

    if (user) {
      try {
        await upsertLearningProgress({
          userId: user.id,
          courseKey,
          moduleKey,
          status: (next.status || progress[moduleKey]?.status || 'in_progress') as any,
          percentage: typeof next.percentage === 'number' ? next.percentage : (progress[moduleKey]?.percentage ?? 0),
        });
      } catch (e) {
        // noop; rely on local persistence
      }
    }
  }, [user, courseKey, progress]);

  const markComplete = useCallback((moduleKey: string) => setModuleProgress(moduleKey, { status: 'completed', percentage: 100 }), [setModuleProgress]);

  const getModuleProgress = useCallback((moduleKey: string): ModuleProgress => {
    return progress[moduleKey] || { status: 'not_started', percentage: 0, updatedAt: 0 };
  }, [progress]);

  const nextModule = useMemo(() => {
    // First module not completed; if all done, null
    for (const m of modules) {
      const p = progress[m.moduleKey];
      if (!p || p.status !== 'completed') return m;
    }
    return null;
  }, [modules, progress]);

  const overall = useMemo(() => {
    if (!modules.length) return 0;
    const sum = modules.reduce((acc, m) => acc + (progress[m.moduleKey]?.percentage || 0), 0);
    return Math.round(sum / modules.length);
  }, [modules, progress]);

  return {
    progress,
    getModuleProgress,
    setModuleProgress,
    markComplete,
    nextModule,
    overall,
    modules,
    moduleIndex,
  };
}

