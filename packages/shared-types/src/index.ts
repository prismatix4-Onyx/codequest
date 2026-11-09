// ==========================================
// CODEQUEST Shared Types
// ==========================================

export type UserRole = 'PLAYER' | 'CREATOR' | 'REVIEWER' | 'ADMINISTRATOR';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  avatarUrl?: string;
  bio?: string;
  xp: number;
  level: number;
  createdAt: string;
  updatedAt: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserPreferences {
  theme: ThemeMode;
  voiceVolume: number; // 0.0 - 1.0
  musicVolume: number; // 0.0 - 1.0
  sfxVolume: number;   // 0.0 - 1.0
  subtitlesEnabled: boolean;
  subtitleSize: 'small' | 'medium' | 'large';
  qualityPreset: 'low' | 'medium' | 'high' | 'auto';
  reducedMotion: boolean;
}

// ------------------------------------------
// Audio & Voice Types
// ------------------------------------------

export interface SubtitleCue {
  startMs: number;
  endMs: number;
  text: string;
}

export interface VoiceProfile {
  characterId: string;
  provider: 'edge-tts' | 'elevenlabs' | 'mock';
  voiceId: string;
  language: string;
  rate: string;   // e.g. "+0%", "-10%"
  pitch: string;  // e.g. "+0Hz", "+5Hz"
  volume: string; // e.g. "+0%", "-5%"
  personality: string;
  preferredStyle?: string;
}

export interface GeneratedVoiceAudio {
  audioId: string;
  audioUrl: string;
  contentHash: string;
  characterId: string;
  text: string;
  durationMs: number;
  subtitles: SubtitleCue[];
}

// ------------------------------------------
// Character Animation & Emotion
// ------------------------------------------

export type CharacterEmotion =
  | 'idle'
  | 'walking'
  | 'running'
  | 'talking'
  | 'listening'
  | 'thinking'
  | 'surprised'
  | 'happy'
  | 'sad'
  | 'angry'
  | 'mission_success'
  | 'mission_failed';

export interface CharacterPlacement {
  characterId: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: [number, number, number];
  initialAnimation?: CharacterEmotion;
  modelUrl?: string;
}

// ------------------------------------------
// 3D Camera Types
// ------------------------------------------

export type CameraShotType =
  | 'establishing'
  | 'close_up'
  | 'dialogue'
  | 'over_the_shoulder'
  | 'exploration'
  | 'mission'
  | 'transition';

export interface CameraShotConfig {
  type: CameraShotType;
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
  durationSeconds?: number;
}

// ------------------------------------------
// Story Engine Types
// ------------------------------------------

export type SceneType =
  | 'cinematic'
  | 'dialogue'
  | 'decision'
  | 'think'
  | 'lesson'
  | 'challenge'
  | 'simulation'
  | 'investigation'
  | 'reward'
  | 'ending';

export interface DialogueLine {
  id: string;
  characterId: string;
  characterName: string;
  text: string;
  emotion: CharacterEmotion;
  audioId?: string;
  audioUrl?: string;
  subtitles?: SubtitleCue[];
  durationMs?: number;
  pauseAfterMs?: number;
}

export interface StoryChoiceCondition {
  variableName: string;
  operator: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'contains';
  value: string | number | boolean;
}

export interface StoryChoice {
  id: string;
  text: string;
  nextSceneId: string;
  condition?: StoryChoiceCondition;
  variableChanges?: Record<string, string | number | boolean>;
  rewardXp?: number;
  feedbackText?: string;
}

export interface StoryScene {
  id: string;
  storyId: string;
  chapterId: string;
  type: SceneType;
  title: string;
  description?: string;
  environmentId: string;
  camera: CameraShotConfig;
  characters: CharacterPlacement[];
  dialogue?: DialogueLine[];
  choices?: StoryChoice[];
  nextSceneId?: string;
  missionId?: string;
  thinkPrompt?: ThinkPrompt;
  rewardXp?: number;
  unlockedAchievementId?: string;
}

export interface StoryChapter {
  id: string;
  storyId: string;
  order: number;
  title: string;
  description: string;
  scenes: StoryScene[];
}

export interface StoryCampaign {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  language: 'python' | 'javascript' | 'java' | 'cpp';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  version: string;
  heroImageUrl?: string;
  defaultEnvironmentId: string;
  chapters: StoryChapter[];
  totalMissions: number;
  estimatedHours: number;
}

export interface PlayerStoryProgress {
  userId: string;
  storyId: string;
  currentChapterId: string;
  currentSceneId: string;
  completedSceneIds: string[];
  variables: Record<string, string | number | boolean>;
  inventory: string[];
  unlockedCheckpoints: string[];
  completedMissionIds: string[];
  lastSavedAt: string;
}

// ------------------------------------------
// Think Before You Code
// ------------------------------------------

export interface ThinkOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface ThinkPrompt {
  id: string;
  title: string;
  question: string;
  conceptReminder: string;
  options: ThinkOption[];
}

// ------------------------------------------
// Code Studio & Execution
// ------------------------------------------

export interface TestCase {
  id: string;
  description: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface ProgressiveHint {
  level: 1 | 2 | 3 | 4;
  title: string;
  content: string;
  isUnlocked: boolean;
}

export interface MissionChallenge {
  id: string;
  storyId: string;
  chapterId: string;
  conceptId: string;
  title: string;
  storyContext: string;
  objective: string;
  starterCode: string;
  solutionCode?: string;
  testCases: TestCase[];
  hints: ProgressiveHint[];
  thinkPrompt?: ThinkPrompt;
  environmentEffectOnPass?: {
    action: 'restore_power' | 'open_bulkhead' | 'activate_beacon' | 'stabilize_reactor';
    durationMs: number;
    message: string;
  };
}

export interface ExecutionRequest {
  code: string;
  language: 'python';
  testCases: TestCase[];
  timeoutSeconds?: number;
}

export interface TestCaseExecutionResult {
  testId: string;
  description: string;
  passed: boolean;
  actualOutput: string;
  expectedOutput: string;
  error?: string;
  isHidden: boolean;
}

export interface ExecutionResult {
  status: 'passed' | 'failed' | 'syntax_error' | 'runtime_error' | 'timeout' | 'system_error';
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  memoryKb?: number;
  allPassed: boolean;
  testResults: TestCaseExecutionResult[];
  error?: string;
  feedback?: string;
}

// ------------------------------------------
// Curriculum & Concept Mastery
// ------------------------------------------

export interface ConceptDefinition {
  id: string;
  stage: 1 | 2 | 3 | 4;
  moduleOrder: number;
  title: string;
  summary: string;
  objectives: string[];
  examples: { title: string; code: string; explanation: string }[];
  practiceChallengeIds: string[];
}

export interface ConceptMasteryRecord {
  userId: string;
  conceptId: string;
  masteryPercentage: number;
  challengesCompleted: number;
  totalAttempts: number;
  hintsUsedCount: number;
  lastPracticedAt: string;
  needsReview: boolean;
}

// ------------------------------------------
// Gamification
// ------------------------------------------

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'story' | 'mastery' | 'problem_solving' | 'dedication';
  xpReward: number;
  unlockedAt?: string;
}

export interface SkillTreeNode {
  id: string;
  title: string;
  conceptId: string;
  tier: number;
  prerequisites: string[];
  isUnlocked: boolean;
  isMastered: boolean;
}
