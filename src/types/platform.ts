export type GradeLevelId =
  | 'anaokulu-3'
  | 'anaokulu-4-5'
  | 'sinif-1-2'
  | 'sinif-3-4'
  | 'sinif-5-6'
  | 'sinif-7-8'
  | 'lise';

export type ActivityLevel = 'Başlangıç' | 'Geliştir' | 'Üret';

export type ActivityStatus = 'not_started' | 'in_progress' | 'completed';

export type BadgeId =
  | 'ilk-algoritmam'
  | 'dongu-kasifi'
  | 'kosul-ustasi'
  | 'hata-avcisi'
  | 'oyun-tasarimcisi'
  | 'ailece-kodladik';

export type EngineType =
  | 'preschool-grid'
  | 'pattern-builder'
  | 'animal-helper-grid'
  | 'robot-dance'
  | 'treasure-robot'
  | 'loop-pattern'
  | 'story-editor'
  | 'bug-detective'
  | 'water-channel'
  | 'game-workshop'
  | 'smart-school'
  | 'ai-classifier'
  | 'algorithm-lab'
  | 'digital-solution';

export interface ActivityTask {
  id: string;
  title: string;
  instruction: string;
  exampleText?: string;
}

export interface ActivityDefinition {
  id: string;
  title: string;
  grade: GradeLevelId;
  gradeLabel: string;
  description: string;
  duration: string;
  concepts: string[];
  level: ActivityLevel;
  conceptSummary: string;
  tasks: ActivityTask[];
  hints: [string, string];
  completionCriteria: string;
  badge: BadgeId;
  reflectionQuestion: string;
  parentExplanation: string;
  parentConversationPrompt: string;
  engineType: EngineType;
  hasFreeProduction?: boolean;
  preschoolNote?: string;
}

export interface GradeInfo {
  id: GradeLevelId;
  label: string;
  shortLabel: string;
  ageRange: string;
  summary: string;
  keyConcepts: string[];
  parentOutcome: string;
  parentQuestion: string;
  isEarlyChildhood?: boolean;
}

export interface BadgeInfo {
  id: BadgeId;
  title: string;
  description: string;
  criteriaText: string;
  requiredActivityIds: string[];
}

export interface FamilyTaskInfo {
  id: 'aile-1' | 'aile-2' | 'aile-3';
  title: string;
  subtitle: string;
  instruction: string;
  reflectionQuestion: string;
  duration: string;
  concepts: string[];
}

export interface StoryBlock {
  id: string;
  type: 'start' | 'move_right' | 'move_left' | 'say' | 'wait' | 'bg_change' | 'repeat_2';
  value?: string;
}

export interface SavedStoryProject {
  character: 'robot' | 'astronot' | 'tilki' | 'bilim-insani';
  background: 'okul-bahcesi' | 'uzay-ussu' | 'kutuphane' | 'orman';
  blocks: StoryBlock[];
  updatedAt: string;
}

export interface SavedDigitalSolutionProject {
  type: 'timer' | 'quiz';
  title: string;
  problemSolved: string;
  timerFocusMinutes: number;
  timerBreakMinutes: number;
  quizQuestions: {
    question: string;
    options: [string, string, string];
    correctIndex: number;
  }[];
  updatedAt: string;
}

export interface ActivityProgressRecord {
  status: ActivityStatus;
  completedTaskIds: string[];
  reflectionAnswer?: string;
  completedAt?: string;
}

export interface PlatformProgressState {
  version: number;
  nickname: string;
  selectedGrade: GradeLevelId;
  soundEnabled: boolean;
  reducedMotion: boolean;
  activities: Record<string, ActivityProgressRecord>;
  familyTasksCompleted: Record<string, boolean>;
  familyReflections: Record<string, string>;
  storyProject?: SavedStoryProject;
  digitalSolutionProject?: SavedDigitalSolutionProject;
}
