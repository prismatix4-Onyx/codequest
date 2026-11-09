import { z } from 'zod';
import type { StoryCampaign, StoryScene, StoryChapter } from '@codequest/shared-types';

export const SubtitleCueSchema = z.object({
  startMs: z.number().nonnegative(),
  endMs: z.number().nonnegative(),
  text: z.string().min(1),
});

export const EmotionSchema = z.enum([
  'idle',
  'walking',
  'running',
  'talking',
  'listening',
  'thinking',
  'surprised',
  'happy',
  'sad',
  'angry',
  'mission_success',
  'mission_failed',
]);

export const DialogueLineSchema = z.object({
  id: z.string().min(1),
  characterId: z.string().min(1),
  characterName: z.string().min(1),
  text: z.string().min(1),
  emotion: EmotionSchema,
  audioId: z.string().optional(),
  audioUrl: z.string().optional(),
  subtitles: z.array(SubtitleCueSchema).optional(),
  durationMs: z.number().positive().optional(),
  pauseAfterMs: z.number().nonnegative().optional(),
});

export const StoryChoiceConditionSchema = z.object({
  variableName: z.string().min(1),
  operator: z.enum(['equals', 'notEquals', 'greaterThan', 'lessThan', 'contains']),
  value: z.union([z.string(), z.number(), z.boolean()]),
});

export const StoryChoiceSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  nextSceneId: z.string().min(1),
  condition: StoryChoiceConditionSchema.optional(),
  variableChanges: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
  rewardXp: z.number().nonnegative().optional(),
  feedbackText: z.string().optional(),
});

export const CameraShotSchema = z.object({
  type: z.enum([
    'establishing',
    'close_up',
    'dialogue',
    'over_the_shoulder',
    'exploration',
    'mission',
    'transition',
  ]),
  position: z.tuple([z.number(), z.number(), z.number()]),
  target: z.tuple([z.number(), z.number(), z.number()]),
  fov: z.number().positive().optional(),
  durationSeconds: z.number().positive().optional(),
});

export const CharacterPlacementSchema = z.object({
  characterId: z.string().min(1),
  position: z.tuple([z.number(), z.number(), z.number()]),
  rotation: z.tuple([z.number(), z.number(), z.number()]),
  scale: z.tuple([z.number(), z.number(), z.number()]).optional(),
  initialAnimation: EmotionSchema.optional(),
  modelUrl: z.string().optional(),
});

export const ThinkOptionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  isCorrect: z.boolean(),
  explanation: z.string().min(1),
});

export const ThinkPromptSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  question: z.string().min(1),
  conceptReminder: z.string().min(1),
  options: z.array(ThinkOptionSchema).min(2),
});

export const StorySceneSchema = z.object({
  id: z.string().min(1),
  storyId: z.string().min(1),
  chapterId: z.string().min(1),
  type: z.enum([
    'cinematic',
    'dialogue',
    'decision',
    'think',
    'lesson',
    'challenge',
    'simulation',
    'investigation',
    'reward',
    'ending',
  ]),
  title: z.string().min(1),
  description: z.string().optional(),
  environmentId: z.string().min(1),
  camera: CameraShotSchema,
  characters: z.array(CharacterPlacementSchema),
  dialogue: z.array(DialogueLineSchema).optional(),
  choices: z.array(StoryChoiceSchema).optional(),
  nextSceneId: z.string().optional(),
  missionId: z.string().optional(),
  thinkPrompt: ThinkPromptSchema.optional(),
  rewardXp: z.number().nonnegative().optional(),
  unlockedAchievementId: z.string().optional(),
});

export const StoryChapterSchema = z.object({
  id: z.string().min(1),
  storyId: z.string().min(1),
  order: z.number().int().nonnegative(),
  title: z.string().min(1),
  description: z.string().min(1),
  scenes: z.array(StorySceneSchema).min(1),
});

export const StoryCampaignSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().min(1),
  language: z.enum(['python', 'javascript', 'java', 'cpp']),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  version: z.string().min(1),
  heroImageUrl: z.string().optional(),
  defaultEnvironmentId: z.string().min(1),
  chapters: z.array(StoryChapterSchema).min(1),
  totalMissions: z.number().int().nonnegative(),
  estimatedHours: z.number().positive(),
});

export interface ValidationIssue {
  type: 'error' | 'warning';
  message: string;
  location: string;
}

export function validateStoryGraph(campaign: StoryCampaign): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const sceneIds = new Set<string>();

  for (const chapter of campaign.chapters) {
    for (const scene of chapter.scenes) {
      if (sceneIds.has(scene.id)) {
        issues.push({
          type: 'error',
          message: `Duplicate scene ID detected: '${scene.id}'`,
          location: `Chapter '${chapter.id}', Scene '${scene.id}'`,
        });
      }
      sceneIds.add(scene.id);
    }
  }

  for (const chapter of campaign.chapters) {
    for (const scene of chapter.scenes) {
      if (scene.nextSceneId && !sceneIds.has(scene.nextSceneId)) {
        issues.push({
          type: 'error',
          message: `Scene '${scene.id}' points to non-existent nextSceneId: '${scene.nextSceneId}'`,
          location: `Chapter '${chapter.id}', Scene '${scene.id}'`,
        });
      }

      if (scene.choices) {
        for (const choice of scene.choices) {
          if (!sceneIds.has(choice.nextSceneId)) {
            issues.push({
              type: 'error',
              message: `Choice '${choice.id}' in scene '${scene.id}' points to non-existent nextSceneId: '${choice.nextSceneId}'`,
              location: `Scene '${scene.id}', Choice '${choice.id}'`,
            });
          }
        }
      }
    }
  }

  return issues;
}
