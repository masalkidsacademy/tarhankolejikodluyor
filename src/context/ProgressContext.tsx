import React, { createContext, useContext, useEffect, useState } from 'react';
import { ACTIVITIES } from '../data/activities';
import { BADGES } from '../config/siteConfig';
import {
  ActivityDefinition,
  ActivityProgressRecord,
  BadgeId,
  GradeLevelId,
  PlatformProgressState,
  SavedDigitalSolutionProject,
  SavedStoryProject
} from '../types/platform';

const STORAGE_KEY = 'tarhan_koleji_kodluyor_progress_v1';
const CURRENT_VERSION = 1;

const DEFAULT_STORY_PROJECT: SavedStoryProject = {
  character: 'robot',
  background: 'okul-bahcesi',
  blocks: [
    { id: 'b1', type: 'start' },
    { id: 'b2', type: 'say', value: 'Merhaba! Kodlama Haftası başlıyor!' },
    { id: 'b3', type: 'move_right' },
    { id: 'b4', type: 'bg_change', value: 'uzay-ussu' },
    { id: 'b5', type: 'repeat_2' },
    { id: 'b6', type: 'say', value: 'Geleceği birlikte tasarlıyoruz!' }
  ],
  updatedAt: new Date().toISOString()
};

const DEFAULT_DIGITAL_SOLUTION: SavedDigitalSolutionProject = {
  type: 'quiz',
  title: 'Kodlama ve Algoritma Hızlı Tekrar Yarışması',
  problemSolved:
    'Öğrencilerin ders öncesi temel algoritma ve döngü kavramlarını 2 dakikada etkileşimli olarak tekrar edebilmesini sağladım.',
  timerFocusMinutes: 25,
  timerBreakMinutes: 5,
  quizQuestions: [
    {
      question: 'Bir işi yapmak için bilgisayara verilen açık ve sıralı komutlara ne denir?',
      options: ['Algoritma / Kodlama', 'Ekran Koruyucu', 'Donanım Kablosu'],
      correctIndex: 0
    },
    {
      question: 'Tekrar eden işlemleri daha az blokla yazmamızı sağlayan yapı hangisidir?',
      options: ['Yorum Satırı', 'Döngü (Tekrar Et)', 'Sabit Metin'],
      correctIndex: 1
    },
    {
      question: 'EĞER (Hava Karanlık VE Hareket Var) İSE Lambayı Aç kuralında lamba ne zaman yanar?',
      options: [
        'Yalnızca gündüz vakti',
        'İki koşul da aynı anda doğru olduğunda',
        'Hiçbir zaman yanmaz'
      ],
      correctIndex: 1
    }
  ],
  updatedAt: new Date().toISOString()
};

function getInitialState(): PlatformProgressState {
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const baseState: PlatformProgressState = {
    version: CURRENT_VERSION,
    nickname: '',
    selectedGrade: 'sinif-1-2',
    soundEnabled: true,
    reducedMotion: Boolean(prefersReduced),
    activities: {},
    familyTasksCompleted: {},
    familyReflections: {},
    storyProject: DEFAULT_STORY_PROJECT,
    digitalSolutionProject: DEFAULT_DIGITAL_SOLUTION
  };

  if (typeof window === 'undefined') return baseState;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return baseState;
    const parsed = JSON.parse(raw) as Partial<PlatformProgressState>;
    if (!parsed || typeof parsed !== 'object' || parsed.version !== CURRENT_VERSION) {
      return baseState;
    }
    return {
      version: CURRENT_VERSION,
      nickname: typeof parsed.nickname === 'string' ? parsed.nickname.slice(0, 32) : '',
      selectedGrade: (parsed.selectedGrade as GradeLevelId) || 'sinif-1-2',
      soundEnabled: typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : true,
      reducedMotion:
        typeof parsed.reducedMotion === 'boolean' ? parsed.reducedMotion : Boolean(prefersReduced),
      activities: parsed.activities && typeof parsed.activities === 'object' ? parsed.activities : {},
      familyTasksCompleted:
        parsed.familyTasksCompleted && typeof parsed.familyTasksCompleted === 'object'
          ? parsed.familyTasksCompleted
          : {},
      familyReflections:
        parsed.familyReflections && typeof parsed.familyReflections === 'object'
          ? parsed.familyReflections
          : {},
      storyProject: parsed.storyProject || DEFAULT_STORY_PROJECT,
      digitalSolutionProject: parsed.digitalSolutionProject || DEFAULT_DIGITAL_SOLUTION
    };
  } catch {
    return baseState;
  }
}

interface ProgressContextValue {
  state: PlatformProgressState;
  setNickname: (name: string) => void;
  setSelectedGrade: (grade: GradeLevelId) => void;
  toggleSound: () => void;
  toggleReducedMotion: () => void;
  markTaskCompleted: (activityId: string, taskId: string, markActivityDone?: boolean) => void;
  markActivityCompleted: (activityId: string, reflectionAnswer?: string) => void;
  saveReflection: (activityId: string, reflectionAnswer: string) => void;
  markFamilyTaskCompleted: (taskId: 'aile-1' | 'aile-2' | 'aile-3', reflection?: string) => void;
  saveStoryProject: (project: SavedStoryProject) => void;
  saveDigitalSolutionProject: (project: SavedDigitalSolutionProject) => void;
  resetAllProgress: () => void;
  getActivityStatus: (activityId: string) => ActivityProgressRecord;
  earnedBadges: BadgeId[];
  completedActivityIds: string[];
  learnedConcepts: string[];
  nextRecommendedActivity: ActivityDefinition;
}

const ProgressContext = createContext<ProgressContextValue | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PlatformProgressState>(getInitialState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // localStorage dolu veya kapalıysa sessizce devam et
    }
  }, [state]);

  const setNickname = (name: string) => {
    const clean = name.replace(/[<>]/g, '').slice(0, 30);
    setState((prev) => ({ ...prev, nickname: clean }));
  };

  const setSelectedGrade = (grade: GradeLevelId) => {
    setState((prev) => ({ ...prev, selectedGrade: grade }));
  };

  const toggleSound = () => {
    setState((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const toggleReducedMotion = () => {
    setState((prev) => ({ ...prev, reducedMotion: !prev.reducedMotion }));
  };

  const getActivityStatus = (activityId: string): ActivityProgressRecord => {
    return (
      state.activities[activityId] || {
        status: 'not_started',
        completedTaskIds: []
      }
    );
  };

  const markTaskCompleted = (
    activityId: string,
    taskId: string,
    markActivityDone = false
  ) => {
    setState((prev) => {
      const existing = prev.activities[activityId] || {
        status: 'not_started',
        completedTaskIds: []
      };
      const updatedTasks = existing.completedTaskIds.includes(taskId)
        ? existing.completedTaskIds
        : [...existing.completedTaskIds, taskId];

      const activityDef = ACTIVITIES.find((a) => a.id === activityId);
      const totalTasks = activityDef ? activityDef.tasks.length : 1;
      const isNowCompleted =
        markActivityDone ||
        existing.status === 'completed' ||
        updatedTasks.length >= totalTasks;

      return {
        ...prev,
        activities: {
          ...prev.activities,
          [activityId]: {
            ...existing,
            status: isNowCompleted ? 'completed' : 'in_progress',
            completedTaskIds: updatedTasks,
            completedAt: isNowCompleted
              ? existing.completedAt || new Date().toISOString()
              : existing.completedAt
          }
        }
      };
    });
  };

  const markActivityCompleted = (activityId: string, reflectionAnswer?: string) => {
    setState((prev) => {
      const existing = prev.activities[activityId] || {
        status: 'not_started',
        completedTaskIds: []
      };
      return {
        ...prev,
        activities: {
          ...prev.activities,
          [activityId]: {
            ...existing,
            status: 'completed',
            reflectionAnswer:
              reflectionAnswer !== undefined ? reflectionAnswer : existing.reflectionAnswer,
            completedAt: existing.completedAt || new Date().toISOString()
          }
        }
      };
    });
  };

  const saveReflection = (activityId: string, reflectionAnswer: string) => {
    const clean = reflectionAnswer.replace(/[<>]/g, '').slice(0, 300);
    setState((prev) => {
      const existing = prev.activities[activityId] || {
        status: 'in_progress',
        completedTaskIds: []
      };
      return {
        ...prev,
        activities: {
          ...prev.activities,
          [activityId]: {
            ...existing,
            reflectionAnswer: clean
          }
        }
      };
    });
  };

  const markFamilyTaskCompleted = (
    taskId: 'aile-1' | 'aile-2' | 'aile-3',
    reflection?: string
  ) => {
    setState((prev) => ({
      ...prev,
      familyTasksCompleted: {
        ...prev.familyTasksCompleted,
        [taskId]: true
      },
      familyReflections: reflection
        ? {
            ...prev.familyReflections,
            [taskId]: reflection.replace(/[<>]/g, '').slice(0, 300)
          }
        : prev.familyReflections
    }));
  };

  const saveStoryProject = (project: SavedStoryProject) => {
    setState((prev) => ({
      ...prev,
      storyProject: project
    }));
  };

  const saveDigitalSolutionProject = (project: SavedDigitalSolutionProject) => {
    setState((prev) => ({
      ...prev,
      digitalSolutionProject: project
    }));
  };

  const resetAllProgress = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setState({
      version: CURRENT_VERSION,
      nickname: '',
      selectedGrade: 'sinif-1-2',
      soundEnabled: true,
      reducedMotion: false,
      activities: {},
      familyTasksCompleted: {},
      familyReflections: {},
      storyProject: DEFAULT_STORY_PROJECT,
      digitalSolutionProject: DEFAULT_DIGITAL_SOLUTION
    });
  };

  const completedActivityIds = ACTIVITIES.filter(
    (a) => state.activities[a.id]?.status === 'completed'
  ).map((a) => a.id);

  const earnedBadges: BadgeId[] = BADGES.filter((badge) => {
    return badge.requiredActivityIds.some((reqId) => {
      if (reqId.startsWith('aile-')) {
        return Boolean(state.familyTasksCompleted[reqId]);
      }
      return state.activities[reqId]?.status === 'completed';
    });
  }).map((b) => b.id);

  const learnedConceptsSet = new Set<string>();
  completedActivityIds.forEach((actId) => {
    const act = ACTIVITIES.find((a) => a.id === actId);
    act?.concepts.forEach((c) => learnedConceptsSet.add(c));
  });
  const learnedConcepts = Array.from(learnedConceptsSet);

  // Sonraki önerilen etkinlik: önce seçili kademedeki tamamlanmamış etkinlik, yoksa sıradaki tamamlanmamış
  const gradeActivities = ACTIVITIES.filter((a) => a.grade === state.selectedGrade);
  const nextInGrade = gradeActivities.find(
    (a) => state.activities[a.id]?.status !== 'completed'
  );
  const nextAny = ACTIVITIES.find((a) => state.activities[a.id]?.status !== 'completed');
  const nextRecommendedActivity = nextInGrade || nextAny || ACTIVITIES[0];

  return (
    <ProgressContext.Provider
      value={{
        state,
        setNickname,
        setSelectedGrade,
        toggleSound,
        toggleReducedMotion,
        markTaskCompleted,
        markActivityCompleted,
        saveReflection,
        markFamilyTaskCompleted,
        saveStoryProject,
        saveDigitalSolutionProject,
        resetAllProgress,
        getActivityStatus,
        earnedBadges,
        completedActivityIds,
        learnedConcepts,
        nextRecommendedActivity
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return ctx;
}
