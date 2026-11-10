"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryCampaignSchema = exports.StoryChapterSchema = exports.StorySceneSchema = exports.ThinkPromptSchema = exports.ThinkOptionSchema = exports.CharacterPlacementSchema = exports.CameraShotSchema = exports.StoryChoiceSchema = exports.StoryChoiceConditionSchema = exports.DialogueLineSchema = exports.EmotionSchema = exports.SubtitleCueSchema = void 0;
exports.validateStoryGraph = validateStoryGraph;
const zod_1 = require("zod");
exports.SubtitleCueSchema = zod_1.z.object({
    startMs: zod_1.z.number().nonnegative(),
    endMs: zod_1.z.number().nonnegative(),
    text: zod_1.z.string().min(1),
});
exports.EmotionSchema = zod_1.z.enum([
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
exports.DialogueLineSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    characterId: zod_1.z.string().min(1),
    characterName: zod_1.z.string().min(1),
    text: zod_1.z.string().min(1),
    emotion: exports.EmotionSchema,
    audioId: zod_1.z.string().optional(),
    audioUrl: zod_1.z.string().optional(),
    subtitles: zod_1.z.array(exports.SubtitleCueSchema).optional(),
    durationMs: zod_1.z.number().positive().optional(),
    pauseAfterMs: zod_1.z.number().nonnegative().optional(),
});
exports.StoryChoiceConditionSchema = zod_1.z.object({
    variableName: zod_1.z.string().min(1),
    operator: zod_1.z.enum(['equals', 'notEquals', 'greaterThan', 'lessThan', 'contains']),
    value: zod_1.z.union([zod_1.z.string(), zod_1.z.number(), zod_1.z.boolean()]),
});
exports.StoryChoiceSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    text: zod_1.z.string().min(1),
    nextSceneId: zod_1.z.string().min(1),
    condition: exports.StoryChoiceConditionSchema.optional(),
    variableChanges: zod_1.z.record(zod_1.z.union([zod_1.z.string(), zod_1.z.number(), zod_1.z.boolean()])).optional(),
    rewardXp: zod_1.z.number().nonnegative().optional(),
    feedbackText: zod_1.z.string().optional(),
});
exports.CameraShotSchema = zod_1.z.object({
    type: zod_1.z.enum([
        'establishing',
        'close_up',
        'dialogue',
        'over_the_shoulder',
        'exploration',
        'mission',
        'transition',
    ]),
    position: zod_1.z.tuple([zod_1.z.number(), zod_1.z.number(), zod_1.z.number()]),
    target: zod_1.z.tuple([zod_1.z.number(), zod_1.z.number(), zod_1.z.number()]),
    fov: zod_1.z.number().positive().optional(),
    durationSeconds: zod_1.z.number().positive().optional(),
});
exports.CharacterPlacementSchema = zod_1.z.object({
    characterId: zod_1.z.string().min(1),
    position: zod_1.z.tuple([zod_1.z.number(), zod_1.z.number(), zod_1.z.number()]),
    rotation: zod_1.z.tuple([zod_1.z.number(), zod_1.z.number(), zod_1.z.number()]),
    scale: zod_1.z.tuple([zod_1.z.number(), zod_1.z.number(), zod_1.z.number()]).optional(),
    initialAnimation: exports.EmotionSchema.optional(),
    modelUrl: zod_1.z.string().optional(),
});
exports.ThinkOptionSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    text: zod_1.z.string().min(1),
    isCorrect: zod_1.z.boolean(),
    explanation: zod_1.z.string().min(1),
});
exports.ThinkPromptSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    title: zod_1.z.string().min(1),
    question: zod_1.z.string().min(1),
    conceptReminder: zod_1.z.string().min(1),
    options: zod_1.z.array(exports.ThinkOptionSchema).min(2),
});
exports.StorySceneSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    storyId: zod_1.z.string().min(1),
    chapterId: zod_1.z.string().min(1),
    type: zod_1.z.enum([
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
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    environmentId: zod_1.z.string().min(1),
    camera: exports.CameraShotSchema,
    characters: zod_1.z.array(exports.CharacterPlacementSchema),
    dialogue: zod_1.z.array(exports.DialogueLineSchema).optional(),
    choices: zod_1.z.array(exports.StoryChoiceSchema).optional(),
    nextSceneId: zod_1.z.string().optional(),
    missionId: zod_1.z.string().optional(),
    thinkPrompt: exports.ThinkPromptSchema.optional(),
    rewardXp: zod_1.z.number().nonnegative().optional(),
    unlockedAchievementId: zod_1.z.string().optional(),
});
exports.StoryChapterSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    storyId: zod_1.z.string().min(1),
    order: zod_1.z.number().int().nonnegative(),
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    scenes: zod_1.z.array(exports.StorySceneSchema).min(1),
});
exports.StoryCampaignSchema = zod_1.z.object({
    id: zod_1.z.string().min(1),
    slug: zod_1.z.string().min(1),
    title: zod_1.z.string().min(1),
    tagline: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    language: zod_1.z.enum(['python', 'javascript', 'java', 'cpp']),
    difficulty: zod_1.z.enum(['beginner', 'intermediate', 'advanced']),
    version: zod_1.z.string().min(1),
    heroImageUrl: zod_1.z.string().optional(),
    defaultEnvironmentId: zod_1.z.string().min(1),
    chapters: zod_1.z.array(exports.StoryChapterSchema).min(1),
    totalMissions: zod_1.z.number().int().nonnegative(),
    estimatedHours: zod_1.z.number().positive(),
});
function validateStoryGraph(campaign) {
    const issues = [];
    const sceneIds = new Set();
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
//# sourceMappingURL=index.js.map