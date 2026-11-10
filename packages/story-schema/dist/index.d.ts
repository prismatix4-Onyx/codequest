import { z } from 'zod';
import type { StoryCampaign } from '@codequest/shared-types';
export declare const SubtitleCueSchema: z.ZodObject<{
    startMs: z.ZodNumber;
    endMs: z.ZodNumber;
    text: z.ZodString;
}, "strip", z.ZodTypeAny, {
    startMs: number;
    endMs: number;
    text: string;
}, {
    startMs: number;
    endMs: number;
    text: string;
}>;
export declare const EmotionSchema: z.ZodEnum<["idle", "walking", "running", "talking", "listening", "thinking", "surprised", "happy", "sad", "angry", "mission_success", "mission_failed"]>;
export declare const DialogueLineSchema: z.ZodObject<{
    id: z.ZodString;
    characterId: z.ZodString;
    characterName: z.ZodString;
    text: z.ZodString;
    emotion: z.ZodEnum<["idle", "walking", "running", "talking", "listening", "thinking", "surprised", "happy", "sad", "angry", "mission_success", "mission_failed"]>;
    audioId: z.ZodOptional<z.ZodString>;
    audioUrl: z.ZodOptional<z.ZodString>;
    subtitles: z.ZodOptional<z.ZodArray<z.ZodObject<{
        startMs: z.ZodNumber;
        endMs: z.ZodNumber;
        text: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        startMs: number;
        endMs: number;
        text: string;
    }, {
        startMs: number;
        endMs: number;
        text: string;
    }>, "many">>;
    durationMs: z.ZodOptional<z.ZodNumber>;
    pauseAfterMs: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    text: string;
    id: string;
    characterId: string;
    characterName: string;
    emotion: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed";
    audioId?: string | undefined;
    audioUrl?: string | undefined;
    subtitles?: {
        startMs: number;
        endMs: number;
        text: string;
    }[] | undefined;
    durationMs?: number | undefined;
    pauseAfterMs?: number | undefined;
}, {
    text: string;
    id: string;
    characterId: string;
    characterName: string;
    emotion: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed";
    audioId?: string | undefined;
    audioUrl?: string | undefined;
    subtitles?: {
        startMs: number;
        endMs: number;
        text: string;
    }[] | undefined;
    durationMs?: number | undefined;
    pauseAfterMs?: number | undefined;
}>;
export declare const StoryChoiceConditionSchema: z.ZodObject<{
    variableName: z.ZodString;
    operator: z.ZodEnum<["equals", "notEquals", "greaterThan", "lessThan", "contains"]>;
    value: z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>;
}, "strip", z.ZodTypeAny, {
    value: string | number | boolean;
    variableName: string;
    operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains";
}, {
    value: string | number | boolean;
    variableName: string;
    operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains";
}>;
export declare const StoryChoiceSchema: z.ZodObject<{
    id: z.ZodString;
    text: z.ZodString;
    nextSceneId: z.ZodString;
    condition: z.ZodOptional<z.ZodObject<{
        variableName: z.ZodString;
        operator: z.ZodEnum<["equals", "notEquals", "greaterThan", "lessThan", "contains"]>;
        value: z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>;
    }, "strip", z.ZodTypeAny, {
        value: string | number | boolean;
        variableName: string;
        operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains";
    }, {
        value: string | number | boolean;
        variableName: string;
        operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains";
    }>>;
    variableChanges: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
    rewardXp: z.ZodOptional<z.ZodNumber>;
    feedbackText: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    text: string;
    id: string;
    nextSceneId: string;
    condition?: {
        value: string | number | boolean;
        variableName: string;
        operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains";
    } | undefined;
    variableChanges?: Record<string, string | number | boolean> | undefined;
    rewardXp?: number | undefined;
    feedbackText?: string | undefined;
}, {
    text: string;
    id: string;
    nextSceneId: string;
    condition?: {
        value: string | number | boolean;
        variableName: string;
        operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains";
    } | undefined;
    variableChanges?: Record<string, string | number | boolean> | undefined;
    rewardXp?: number | undefined;
    feedbackText?: string | undefined;
}>;
export declare const CameraShotSchema: z.ZodObject<{
    type: z.ZodEnum<["establishing", "close_up", "dialogue", "over_the_shoulder", "exploration", "mission", "transition"]>;
    position: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
    target: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
    fov: z.ZodOptional<z.ZodNumber>;
    durationSeconds: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    type: "establishing" | "close_up" | "dialogue" | "over_the_shoulder" | "exploration" | "mission" | "transition";
    position: [number, number, number];
    target: [number, number, number];
    fov?: number | undefined;
    durationSeconds?: number | undefined;
}, {
    type: "establishing" | "close_up" | "dialogue" | "over_the_shoulder" | "exploration" | "mission" | "transition";
    position: [number, number, number];
    target: [number, number, number];
    fov?: number | undefined;
    durationSeconds?: number | undefined;
}>;
export declare const CharacterPlacementSchema: z.ZodObject<{
    characterId: z.ZodString;
    position: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
    rotation: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
    scale: z.ZodOptional<z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>>;
    initialAnimation: z.ZodOptional<z.ZodEnum<["idle", "walking", "running", "talking", "listening", "thinking", "surprised", "happy", "sad", "angry", "mission_success", "mission_failed"]>>;
    modelUrl: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    characterId: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale?: [number, number, number] | undefined;
    initialAnimation?: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed" | undefined;
    modelUrl?: string | undefined;
}, {
    characterId: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale?: [number, number, number] | undefined;
    initialAnimation?: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed" | undefined;
    modelUrl?: string | undefined;
}>;
export declare const ThinkOptionSchema: z.ZodObject<{
    id: z.ZodString;
    text: z.ZodString;
    isCorrect: z.ZodBoolean;
    explanation: z.ZodString;
}, "strip", z.ZodTypeAny, {
    text: string;
    id: string;
    isCorrect: boolean;
    explanation: string;
}, {
    text: string;
    id: string;
    isCorrect: boolean;
    explanation: string;
}>;
export declare const ThinkPromptSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    question: z.ZodString;
    conceptReminder: z.ZodString;
    options: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        text: z.ZodString;
        isCorrect: z.ZodBoolean;
        explanation: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        text: string;
        id: string;
        isCorrect: boolean;
        explanation: string;
    }, {
        text: string;
        id: string;
        isCorrect: boolean;
        explanation: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    options: {
        text: string;
        id: string;
        isCorrect: boolean;
        explanation: string;
    }[];
    id: string;
    title: string;
    question: string;
    conceptReminder: string;
}, {
    options: {
        text: string;
        id: string;
        isCorrect: boolean;
        explanation: string;
    }[];
    id: string;
    title: string;
    question: string;
    conceptReminder: string;
}>;
export declare const StorySceneSchema: z.ZodObject<{
    id: z.ZodString;
    storyId: z.ZodString;
    chapterId: z.ZodString;
    type: z.ZodEnum<["cinematic", "dialogue", "decision", "think", "lesson", "challenge", "simulation", "investigation", "reward", "ending"]>;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    environmentId: z.ZodString;
    camera: z.ZodObject<{
        type: z.ZodEnum<["establishing", "close_up", "dialogue", "over_the_shoulder", "exploration", "mission", "transition"]>;
        position: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
        target: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
        fov: z.ZodOptional<z.ZodNumber>;
        durationSeconds: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        type: "establishing" | "close_up" | "dialogue" | "over_the_shoulder" | "exploration" | "mission" | "transition";
        position: [number, number, number];
        target: [number, number, number];
        fov?: number | undefined;
        durationSeconds?: number | undefined;
    }, {
        type: "establishing" | "close_up" | "dialogue" | "over_the_shoulder" | "exploration" | "mission" | "transition";
        position: [number, number, number];
        target: [number, number, number];
        fov?: number | undefined;
        durationSeconds?: number | undefined;
    }>;
    characters: z.ZodArray<z.ZodObject<{
        characterId: z.ZodString;
        position: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
        rotation: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
        scale: z.ZodOptional<z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>>;
        initialAnimation: z.ZodOptional<z.ZodEnum<["idle", "walking", "running", "talking", "listening", "thinking", "surprised", "happy", "sad", "angry", "mission_success", "mission_failed"]>>;
        modelUrl: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        characterId: string;
        position: [number, number, number];
        rotation: [number, number, number];
        scale?: [number, number, number] | undefined;
        initialAnimation?: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed" | undefined;
        modelUrl?: string | undefined;
    }, {
        characterId: string;
        position: [number, number, number];
        rotation: [number, number, number];
        scale?: [number, number, number] | undefined;
        initialAnimation?: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed" | undefined;
        modelUrl?: string | undefined;
    }>, "many">;
    dialogue: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        characterId: z.ZodString;
        characterName: z.ZodString;
        text: z.ZodString;
        emotion: z.ZodEnum<["idle", "walking", "running", "talking", "listening", "thinking", "surprised", "happy", "sad", "angry", "mission_success", "mission_failed"]>;
        audioId: z.ZodOptional<z.ZodString>;
        audioUrl: z.ZodOptional<z.ZodString>;
        subtitles: z.ZodOptional<z.ZodArray<z.ZodObject<{
            startMs: z.ZodNumber;
            endMs: z.ZodNumber;
            text: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            startMs: number;
            endMs: number;
            text: string;
        }, {
            startMs: number;
            endMs: number;
            text: string;
        }>, "many">>;
        durationMs: z.ZodOptional<z.ZodNumber>;
        pauseAfterMs: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        text: string;
        id: string;
        characterId: string;
        characterName: string;
        emotion: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed";
        audioId?: string | undefined;
        audioUrl?: string | undefined;
        subtitles?: {
            startMs: number;
            endMs: number;
            text: string;
        }[] | undefined;
        durationMs?: number | undefined;
        pauseAfterMs?: number | undefined;
    }, {
        text: string;
        id: string;
        characterId: string;
        characterName: string;
        emotion: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed";
        audioId?: string | undefined;
        audioUrl?: string | undefined;
        subtitles?: {
            startMs: number;
            endMs: number;
            text: string;
        }[] | undefined;
        durationMs?: number | undefined;
        pauseAfterMs?: number | undefined;
    }>, "many">>;
    choices: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        text: z.ZodString;
        nextSceneId: z.ZodString;
        condition: z.ZodOptional<z.ZodObject<{
            variableName: z.ZodString;
            operator: z.ZodEnum<["equals", "notEquals", "greaterThan", "lessThan", "contains"]>;
            value: z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>;
        }, "strip", z.ZodTypeAny, {
            value: string | number | boolean;
            variableName: string;
            operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains";
        }, {
            value: string | number | boolean;
            variableName: string;
            operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains";
        }>>;
        variableChanges: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
        rewardXp: z.ZodOptional<z.ZodNumber>;
        feedbackText: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        text: string;
        id: string;
        nextSceneId: string;
        condition?: {
            value: string | number | boolean;
            variableName: string;
            operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains";
        } | undefined;
        variableChanges?: Record<string, string | number | boolean> | undefined;
        rewardXp?: number | undefined;
        feedbackText?: string | undefined;
    }, {
        text: string;
        id: string;
        nextSceneId: string;
        condition?: {
            value: string | number | boolean;
            variableName: string;
            operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains";
        } | undefined;
        variableChanges?: Record<string, string | number | boolean> | undefined;
        rewardXp?: number | undefined;
        feedbackText?: string | undefined;
    }>, "many">>;
    nextSceneId: z.ZodOptional<z.ZodString>;
    missionId: z.ZodOptional<z.ZodString>;
    thinkPrompt: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        question: z.ZodString;
        conceptReminder: z.ZodString;
        options: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            text: z.ZodString;
            isCorrect: z.ZodBoolean;
            explanation: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            text: string;
            id: string;
            isCorrect: boolean;
            explanation: string;
        }, {
            text: string;
            id: string;
            isCorrect: boolean;
            explanation: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        options: {
            text: string;
            id: string;
            isCorrect: boolean;
            explanation: string;
        }[];
        id: string;
        title: string;
        question: string;
        conceptReminder: string;
    }, {
        options: {
            text: string;
            id: string;
            isCorrect: boolean;
            explanation: string;
        }[];
        id: string;
        title: string;
        question: string;
        conceptReminder: string;
    }>>;
    rewardXp: z.ZodOptional<z.ZodNumber>;
    unlockedAchievementId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "dialogue" | "cinematic" | "decision" | "think" | "lesson" | "challenge" | "simulation" | "investigation" | "reward" | "ending";
    id: string;
    title: string;
    storyId: string;
    chapterId: string;
    environmentId: string;
    camera: {
        type: "establishing" | "close_up" | "dialogue" | "over_the_shoulder" | "exploration" | "mission" | "transition";
        position: [number, number, number];
        target: [number, number, number];
        fov?: number | undefined;
        durationSeconds?: number | undefined;
    };
    characters: {
        characterId: string;
        position: [number, number, number];
        rotation: [number, number, number];
        scale?: [number, number, number] | undefined;
        initialAnimation?: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed" | undefined;
        modelUrl?: string | undefined;
    }[];
    dialogue?: {
        text: string;
        id: string;
        characterId: string;
        characterName: string;
        emotion: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed";
        audioId?: string | undefined;
        audioUrl?: string | undefined;
        subtitles?: {
            startMs: number;
            endMs: number;
            text: string;
        }[] | undefined;
        durationMs?: number | undefined;
        pauseAfterMs?: number | undefined;
    }[] | undefined;
    nextSceneId?: string | undefined;
    rewardXp?: number | undefined;
    description?: string | undefined;
    choices?: {
        text: string;
        id: string;
        nextSceneId: string;
        condition?: {
            value: string | number | boolean;
            variableName: string;
            operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains";
        } | undefined;
        variableChanges?: Record<string, string | number | boolean> | undefined;
        rewardXp?: number | undefined;
        feedbackText?: string | undefined;
    }[] | undefined;
    missionId?: string | undefined;
    thinkPrompt?: {
        options: {
            text: string;
            id: string;
            isCorrect: boolean;
            explanation: string;
        }[];
        id: string;
        title: string;
        question: string;
        conceptReminder: string;
    } | undefined;
    unlockedAchievementId?: string | undefined;
}, {
    type: "dialogue" | "cinematic" | "decision" | "think" | "lesson" | "challenge" | "simulation" | "investigation" | "reward" | "ending";
    id: string;
    title: string;
    storyId: string;
    chapterId: string;
    environmentId: string;
    camera: {
        type: "establishing" | "close_up" | "dialogue" | "over_the_shoulder" | "exploration" | "mission" | "transition";
        position: [number, number, number];
        target: [number, number, number];
        fov?: number | undefined;
        durationSeconds?: number | undefined;
    };
    characters: {
        characterId: string;
        position: [number, number, number];
        rotation: [number, number, number];
        scale?: [number, number, number] | undefined;
        initialAnimation?: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed" | undefined;
        modelUrl?: string | undefined;
    }[];
    dialogue?: {
        text: string;
        id: string;
        characterId: string;
        characterName: string;
        emotion: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed";
        audioId?: string | undefined;
        audioUrl?: string | undefined;
        subtitles?: {
            startMs: number;
            endMs: number;
            text: string;
        }[] | undefined;
        durationMs?: number | undefined;
        pauseAfterMs?: number | undefined;
    }[] | undefined;
    nextSceneId?: string | undefined;
    rewardXp?: number | undefined;
    description?: string | undefined;
    choices?: {
        text: string;
        id: string;
        nextSceneId: string;
        condition?: {
            value: string | number | boolean;
            variableName: string;
            operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains";
        } | undefined;
        variableChanges?: Record<string, string | number | boolean> | undefined;
        rewardXp?: number | undefined;
        feedbackText?: string | undefined;
    }[] | undefined;
    missionId?: string | undefined;
    thinkPrompt?: {
        options: {
            text: string;
            id: string;
            isCorrect: boolean;
            explanation: string;
        }[];
        id: string;
        title: string;
        question: string;
        conceptReminder: string;
    } | undefined;
    unlockedAchievementId?: string | undefined;
}>;
export declare const StoryChapterSchema: z.ZodObject<{
    id: z.ZodString;
    storyId: z.ZodString;
    order: z.ZodNumber;
    title: z.ZodString;
    description: z.ZodString;
    scenes: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        storyId: z.ZodString;
        chapterId: z.ZodString;
        type: z.ZodEnum<["cinematic", "dialogue", "decision", "think", "lesson", "challenge", "simulation", "investigation", "reward", "ending"]>;
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        environmentId: z.ZodString;
        camera: z.ZodObject<{
            type: z.ZodEnum<["establishing", "close_up", "dialogue", "over_the_shoulder", "exploration", "mission", "transition"]>;
            position: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
            target: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
            fov: z.ZodOptional<z.ZodNumber>;
            durationSeconds: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            type: "establishing" | "close_up" | "dialogue" | "over_the_shoulder" | "exploration" | "mission" | "transition";
            position: [number, number, number];
            target: [number, number, number];
            fov?: number | undefined;
            durationSeconds?: number | undefined;
        }, {
            type: "establishing" | "close_up" | "dialogue" | "over_the_shoulder" | "exploration" | "mission" | "transition";
            position: [number, number, number];
            target: [number, number, number];
            fov?: number | undefined;
            durationSeconds?: number | undefined;
        }>;
        characters: z.ZodArray<z.ZodObject<{
            characterId: z.ZodString;
            position: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
            rotation: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
            scale: z.ZodOptional<z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>>;
            initialAnimation: z.ZodOptional<z.ZodEnum<["idle", "walking", "running", "talking", "listening", "thinking", "surprised", "happy", "sad", "angry", "mission_success", "mission_failed"]>>;
            modelUrl: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            characterId: string;
            position: [number, number, number];
            rotation: [number, number, number];
            scale?: [number, number, number] | undefined;
            initialAnimation?: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed" | undefined;
            modelUrl?: string | undefined;
        }, {
            characterId: string;
            position: [number, number, number];
            rotation: [number, number, number];
            scale?: [number, number, number] | undefined;
            initialAnimation?: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed" | undefined;
            modelUrl?: string | undefined;
        }>, "many">;
        dialogue: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            characterId: z.ZodString;
            characterName: z.ZodString;
            text: z.ZodString;
            emotion: z.ZodEnum<["idle", "walking", "running", "talking", "listening", "thinking", "surprised", "happy", "sad", "angry", "mission_success", "mission_failed"]>;
            audioId: z.ZodOptional<z.ZodString>;
            audioUrl: z.ZodOptional<z.ZodString>;
            subtitles: z.ZodOptional<z.ZodArray<z.ZodObject<{
                startMs: z.ZodNumber;
                endMs: z.ZodNumber;
                text: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                startMs: number;
                endMs: number;
                text: string;
            }, {
                startMs: number;
                endMs: number;
                text: string;
            }>, "many">>;
            durationMs: z.ZodOptional<z.ZodNumber>;
            pauseAfterMs: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            text: string;
            id: string;
            characterId: string;
            characterName: string;
            emotion: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed";
            audioId?: string | undefined;
            audioUrl?: string | undefined;
            subtitles?: {
                startMs: number;
                endMs: number;
                text: string;
            }[] | undefined;
            durationMs?: number | undefined;
            pauseAfterMs?: number | undefined;
        }, {
            text: string;
            id: string;
            characterId: string;
            characterName: string;
            emotion: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed";
            audioId?: string | undefined;
            audioUrl?: string | undefined;
            subtitles?: {
                startMs: number;
                endMs: number;
                text: string;
            }[] | undefined;
            durationMs?: number | undefined;
            pauseAfterMs?: number | undefined;
        }>, "many">>;
        choices: z.ZodOptional<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            text: z.ZodString;
            nextSceneId: z.ZodString;
            condition: z.ZodOptional<z.ZodObject<{
                variableName: z.ZodString;
                operator: z.ZodEnum<["equals", "notEquals", "greaterThan", "lessThan", "contains"]>;
                value: z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>;
            }, "strip", z.ZodTypeAny, {
                value: string | number | boolean;
                variableName: string;
                operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains";
            }, {
                value: string | number | boolean;
                variableName: string;
                operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains";
            }>>;
            variableChanges: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
            rewardXp: z.ZodOptional<z.ZodNumber>;
            feedbackText: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            text: string;
            id: string;
            nextSceneId: string;
            condition?: {
                value: string | number | boolean;
                variableName: string;
                operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains";
            } | undefined;
            variableChanges?: Record<string, string | number | boolean> | undefined;
            rewardXp?: number | undefined;
            feedbackText?: string | undefined;
        }, {
            text: string;
            id: string;
            nextSceneId: string;
            condition?: {
                value: string | number | boolean;
                variableName: string;
                operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains";
            } | undefined;
            variableChanges?: Record<string, string | number | boolean> | undefined;
            rewardXp?: number | undefined;
            feedbackText?: string | undefined;
        }>, "many">>;
        nextSceneId: z.ZodOptional<z.ZodString>;
        missionId: z.ZodOptional<z.ZodString>;
        thinkPrompt: z.ZodOptional<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            question: z.ZodString;
            conceptReminder: z.ZodString;
            options: z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                text: z.ZodString;
                isCorrect: z.ZodBoolean;
                explanation: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                text: string;
                id: string;
                isCorrect: boolean;
                explanation: string;
            }, {
                text: string;
                id: string;
                isCorrect: boolean;
                explanation: string;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            options: {
                text: string;
                id: string;
                isCorrect: boolean;
                explanation: string;
            }[];
            id: string;
            title: string;
            question: string;
            conceptReminder: string;
        }, {
            options: {
                text: string;
                id: string;
                isCorrect: boolean;
                explanation: string;
            }[];
            id: string;
            title: string;
            question: string;
            conceptReminder: string;
        }>>;
        rewardXp: z.ZodOptional<z.ZodNumber>;
        unlockedAchievementId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "dialogue" | "cinematic" | "decision" | "think" | "lesson" | "challenge" | "simulation" | "investigation" | "reward" | "ending";
        id: string;
        title: string;
        storyId: string;
        chapterId: string;
        environmentId: string;
        camera: {
            type: "establishing" | "close_up" | "dialogue" | "over_the_shoulder" | "exploration" | "mission" | "transition";
            position: [number, number, number];
            target: [number, number, number];
            fov?: number | undefined;
            durationSeconds?: number | undefined;
        };
        characters: {
            characterId: string;
            position: [number, number, number];
            rotation: [number, number, number];
            scale?: [number, number, number] | undefined;
            initialAnimation?: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed" | undefined;
            modelUrl?: string | undefined;
        }[];
        dialogue?: {
            text: string;
            id: string;
            characterId: string;
            characterName: string;
            emotion: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed";
            audioId?: string | undefined;
            audioUrl?: string | undefined;
            subtitles?: {
                startMs: number;
                endMs: number;
                text: string;
            }[] | undefined;
            durationMs?: number | undefined;
            pauseAfterMs?: number | undefined;
        }[] | undefined;
        nextSceneId?: string | undefined;
        rewardXp?: number | undefined;
        description?: string | undefined;
        choices?: {
            text: string;
            id: string;
            nextSceneId: string;
            condition?: {
                value: string | number | boolean;
                variableName: string;
                operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains";
            } | undefined;
            variableChanges?: Record<string, string | number | boolean> | undefined;
            rewardXp?: number | undefined;
            feedbackText?: string | undefined;
        }[] | undefined;
        missionId?: string | undefined;
        thinkPrompt?: {
            options: {
                text: string;
                id: string;
                isCorrect: boolean;
                explanation: string;
            }[];
            id: string;
            title: string;
            question: string;
            conceptReminder: string;
        } | undefined;
        unlockedAchievementId?: string | undefined;
    }, {
        type: "dialogue" | "cinematic" | "decision" | "think" | "lesson" | "challenge" | "simulation" | "investigation" | "reward" | "ending";
        id: string;
        title: string;
        storyId: string;
        chapterId: string;
        environmentId: string;
        camera: {
            type: "establishing" | "close_up" | "dialogue" | "over_the_shoulder" | "exploration" | "mission" | "transition";
            position: [number, number, number];
            target: [number, number, number];
            fov?: number | undefined;
            durationSeconds?: number | undefined;
        };
        characters: {
            characterId: string;
            position: [number, number, number];
            rotation: [number, number, number];
            scale?: [number, number, number] | undefined;
            initialAnimation?: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed" | undefined;
            modelUrl?: string | undefined;
        }[];
        dialogue?: {
            text: string;
            id: string;
            characterId: string;
            characterName: string;
            emotion: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed";
            audioId?: string | undefined;
            audioUrl?: string | undefined;
            subtitles?: {
                startMs: number;
                endMs: number;
                text: string;
            }[] | undefined;
            durationMs?: number | undefined;
            pauseAfterMs?: number | undefined;
        }[] | undefined;
        nextSceneId?: string | undefined;
        rewardXp?: number | undefined;
        description?: string | undefined;
        choices?: {
            text: string;
            id: string;
            nextSceneId: string;
            condition?: {
                value: string | number | boolean;
                variableName: string;
                operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains";
            } | undefined;
            variableChanges?: Record<string, string | number | boolean> | undefined;
            rewardXp?: number | undefined;
            feedbackText?: string | undefined;
        }[] | undefined;
        missionId?: string | undefined;
        thinkPrompt?: {
            options: {
                text: string;
                id: string;
                isCorrect: boolean;
                explanation: string;
            }[];
            id: string;
            title: string;
            question: string;
            conceptReminder: string;
        } | undefined;
        unlockedAchievementId?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: string;
    storyId: string;
    description: string;
    order: number;
    scenes: {
        type: "dialogue" | "cinematic" | "decision" | "think" | "lesson" | "challenge" | "simulation" | "investigation" | "reward" | "ending";
        id: string;
        title: string;
        storyId: string;
        chapterId: string;
        environmentId: string;
        camera: {
            type: "establishing" | "close_up" | "dialogue" | "over_the_shoulder" | "exploration" | "mission" | "transition";
            position: [number, number, number];
            target: [number, number, number];
            fov?: number | undefined;
            durationSeconds?: number | undefined;
        };
        characters: {
            characterId: string;
            position: [number, number, number];
            rotation: [number, number, number];
            scale?: [number, number, number] | undefined;
            initialAnimation?: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed" | undefined;
            modelUrl?: string | undefined;
        }[];
        dialogue?: {
            text: string;
            id: string;
            characterId: string;
            characterName: string;
            emotion: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed";
            audioId?: string | undefined;
            audioUrl?: string | undefined;
            subtitles?: {
                startMs: number;
                endMs: number;
                text: string;
            }[] | undefined;
            durationMs?: number | undefined;
            pauseAfterMs?: number | undefined;
        }[] | undefined;
        nextSceneId?: string | undefined;
        rewardXp?: number | undefined;
        description?: string | undefined;
        choices?: {
            text: string;
            id: string;
            nextSceneId: string;
            condition?: {
                value: string | number | boolean;
                variableName: string;
                operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains";
            } | undefined;
            variableChanges?: Record<string, string | number | boolean> | undefined;
            rewardXp?: number | undefined;
            feedbackText?: string | undefined;
        }[] | undefined;
        missionId?: string | undefined;
        thinkPrompt?: {
            options: {
                text: string;
                id: string;
                isCorrect: boolean;
                explanation: string;
            }[];
            id: string;
            title: string;
            question: string;
            conceptReminder: string;
        } | undefined;
        unlockedAchievementId?: string | undefined;
    }[];
}, {
    id: string;
    title: string;
    storyId: string;
    description: string;
    order: number;
    scenes: {
        type: "dialogue" | "cinematic" | "decision" | "think" | "lesson" | "challenge" | "simulation" | "investigation" | "reward" | "ending";
        id: string;
        title: string;
        storyId: string;
        chapterId: string;
        environmentId: string;
        camera: {
            type: "establishing" | "close_up" | "dialogue" | "over_the_shoulder" | "exploration" | "mission" | "transition";
            position: [number, number, number];
            target: [number, number, number];
            fov?: number | undefined;
            durationSeconds?: number | undefined;
        };
        characters: {
            characterId: string;
            position: [number, number, number];
            rotation: [number, number, number];
            scale?: [number, number, number] | undefined;
            initialAnimation?: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed" | undefined;
            modelUrl?: string | undefined;
        }[];
        dialogue?: {
            text: string;
            id: string;
            characterId: string;
            characterName: string;
            emotion: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed";
            audioId?: string | undefined;
            audioUrl?: string | undefined;
            subtitles?: {
                startMs: number;
                endMs: number;
                text: string;
            }[] | undefined;
            durationMs?: number | undefined;
            pauseAfterMs?: number | undefined;
        }[] | undefined;
        nextSceneId?: string | undefined;
        rewardXp?: number | undefined;
        description?: string | undefined;
        choices?: {
            text: string;
            id: string;
            nextSceneId: string;
            condition?: {
                value: string | number | boolean;
                variableName: string;
                operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains";
            } | undefined;
            variableChanges?: Record<string, string | number | boolean> | undefined;
            rewardXp?: number | undefined;
            feedbackText?: string | undefined;
        }[] | undefined;
        missionId?: string | undefined;
        thinkPrompt?: {
            options: {
                text: string;
                id: string;
                isCorrect: boolean;
                explanation: string;
            }[];
            id: string;
            title: string;
            question: string;
            conceptReminder: string;
        } | undefined;
        unlockedAchievementId?: string | undefined;
    }[];
}>;
export declare const StoryCampaignSchema: z.ZodObject<{
    id: z.ZodString;
    slug: z.ZodString;
    title: z.ZodString;
    tagline: z.ZodString;
    description: z.ZodString;
    language: z.ZodEnum<["python", "javascript", "java", "cpp"]>;
    difficulty: z.ZodEnum<["beginner", "intermediate", "advanced"]>;
    version: z.ZodString;
    heroImageUrl: z.ZodOptional<z.ZodString>;
    defaultEnvironmentId: z.ZodString;
    chapters: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        storyId: z.ZodString;
        order: z.ZodNumber;
        title: z.ZodString;
        description: z.ZodString;
        scenes: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            storyId: z.ZodString;
            chapterId: z.ZodString;
            type: z.ZodEnum<["cinematic", "dialogue", "decision", "think", "lesson", "challenge", "simulation", "investigation", "reward", "ending"]>;
            title: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            environmentId: z.ZodString;
            camera: z.ZodObject<{
                type: z.ZodEnum<["establishing", "close_up", "dialogue", "over_the_shoulder", "exploration", "mission", "transition"]>;
                position: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
                target: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
                fov: z.ZodOptional<z.ZodNumber>;
                durationSeconds: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                type: "establishing" | "close_up" | "dialogue" | "over_the_shoulder" | "exploration" | "mission" | "transition";
                position: [number, number, number];
                target: [number, number, number];
                fov?: number | undefined;
                durationSeconds?: number | undefined;
            }, {
                type: "establishing" | "close_up" | "dialogue" | "over_the_shoulder" | "exploration" | "mission" | "transition";
                position: [number, number, number];
                target: [number, number, number];
                fov?: number | undefined;
                durationSeconds?: number | undefined;
            }>;
            characters: z.ZodArray<z.ZodObject<{
                characterId: z.ZodString;
                position: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
                rotation: z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>;
                scale: z.ZodOptional<z.ZodTuple<[z.ZodNumber, z.ZodNumber, z.ZodNumber], null>>;
                initialAnimation: z.ZodOptional<z.ZodEnum<["idle", "walking", "running", "talking", "listening", "thinking", "surprised", "happy", "sad", "angry", "mission_success", "mission_failed"]>>;
                modelUrl: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                characterId: string;
                position: [number, number, number];
                rotation: [number, number, number];
                scale?: [number, number, number] | undefined;
                initialAnimation?: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed" | undefined;
                modelUrl?: string | undefined;
            }, {
                characterId: string;
                position: [number, number, number];
                rotation: [number, number, number];
                scale?: [number, number, number] | undefined;
                initialAnimation?: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed" | undefined;
                modelUrl?: string | undefined;
            }>, "many">;
            dialogue: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                characterId: z.ZodString;
                characterName: z.ZodString;
                text: z.ZodString;
                emotion: z.ZodEnum<["idle", "walking", "running", "talking", "listening", "thinking", "surprised", "happy", "sad", "angry", "mission_success", "mission_failed"]>;
                audioId: z.ZodOptional<z.ZodString>;
                audioUrl: z.ZodOptional<z.ZodString>;
                subtitles: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    startMs: z.ZodNumber;
                    endMs: z.ZodNumber;
                    text: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    startMs: number;
                    endMs: number;
                    text: string;
                }, {
                    startMs: number;
                    endMs: number;
                    text: string;
                }>, "many">>;
                durationMs: z.ZodOptional<z.ZodNumber>;
                pauseAfterMs: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                text: string;
                id: string;
                characterId: string;
                characterName: string;
                emotion: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed";
                audioId?: string | undefined;
                audioUrl?: string | undefined;
                subtitles?: {
                    startMs: number;
                    endMs: number;
                    text: string;
                }[] | undefined;
                durationMs?: number | undefined;
                pauseAfterMs?: number | undefined;
            }, {
                text: string;
                id: string;
                characterId: string;
                characterName: string;
                emotion: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed";
                audioId?: string | undefined;
                audioUrl?: string | undefined;
                subtitles?: {
                    startMs: number;
                    endMs: number;
                    text: string;
                }[] | undefined;
                durationMs?: number | undefined;
                pauseAfterMs?: number | undefined;
            }>, "many">>;
            choices: z.ZodOptional<z.ZodArray<z.ZodObject<{
                id: z.ZodString;
                text: z.ZodString;
                nextSceneId: z.ZodString;
                condition: z.ZodOptional<z.ZodObject<{
                    variableName: z.ZodString;
                    operator: z.ZodEnum<["equals", "notEquals", "greaterThan", "lessThan", "contains"]>;
                    value: z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>;
                }, "strip", z.ZodTypeAny, {
                    value: string | number | boolean;
                    variableName: string;
                    operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains";
                }, {
                    value: string | number | boolean;
                    variableName: string;
                    operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains";
                }>>;
                variableChanges: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
                rewardXp: z.ZodOptional<z.ZodNumber>;
                feedbackText: z.ZodOptional<z.ZodString>;
            }, "strip", z.ZodTypeAny, {
                text: string;
                id: string;
                nextSceneId: string;
                condition?: {
                    value: string | number | boolean;
                    variableName: string;
                    operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains";
                } | undefined;
                variableChanges?: Record<string, string | number | boolean> | undefined;
                rewardXp?: number | undefined;
                feedbackText?: string | undefined;
            }, {
                text: string;
                id: string;
                nextSceneId: string;
                condition?: {
                    value: string | number | boolean;
                    variableName: string;
                    operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains";
                } | undefined;
                variableChanges?: Record<string, string | number | boolean> | undefined;
                rewardXp?: number | undefined;
                feedbackText?: string | undefined;
            }>, "many">>;
            nextSceneId: z.ZodOptional<z.ZodString>;
            missionId: z.ZodOptional<z.ZodString>;
            thinkPrompt: z.ZodOptional<z.ZodObject<{
                id: z.ZodString;
                title: z.ZodString;
                question: z.ZodString;
                conceptReminder: z.ZodString;
                options: z.ZodArray<z.ZodObject<{
                    id: z.ZodString;
                    text: z.ZodString;
                    isCorrect: z.ZodBoolean;
                    explanation: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    text: string;
                    id: string;
                    isCorrect: boolean;
                    explanation: string;
                }, {
                    text: string;
                    id: string;
                    isCorrect: boolean;
                    explanation: string;
                }>, "many">;
            }, "strip", z.ZodTypeAny, {
                options: {
                    text: string;
                    id: string;
                    isCorrect: boolean;
                    explanation: string;
                }[];
                id: string;
                title: string;
                question: string;
                conceptReminder: string;
            }, {
                options: {
                    text: string;
                    id: string;
                    isCorrect: boolean;
                    explanation: string;
                }[];
                id: string;
                title: string;
                question: string;
                conceptReminder: string;
            }>>;
            rewardXp: z.ZodOptional<z.ZodNumber>;
            unlockedAchievementId: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: "dialogue" | "cinematic" | "decision" | "think" | "lesson" | "challenge" | "simulation" | "investigation" | "reward" | "ending";
            id: string;
            title: string;
            storyId: string;
            chapterId: string;
            environmentId: string;
            camera: {
                type: "establishing" | "close_up" | "dialogue" | "over_the_shoulder" | "exploration" | "mission" | "transition";
                position: [number, number, number];
                target: [number, number, number];
                fov?: number | undefined;
                durationSeconds?: number | undefined;
            };
            characters: {
                characterId: string;
                position: [number, number, number];
                rotation: [number, number, number];
                scale?: [number, number, number] | undefined;
                initialAnimation?: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed" | undefined;
                modelUrl?: string | undefined;
            }[];
            dialogue?: {
                text: string;
                id: string;
                characterId: string;
                characterName: string;
                emotion: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed";
                audioId?: string | undefined;
                audioUrl?: string | undefined;
                subtitles?: {
                    startMs: number;
                    endMs: number;
                    text: string;
                }[] | undefined;
                durationMs?: number | undefined;
                pauseAfterMs?: number | undefined;
            }[] | undefined;
            nextSceneId?: string | undefined;
            rewardXp?: number | undefined;
            description?: string | undefined;
            choices?: {
                text: string;
                id: string;
                nextSceneId: string;
                condition?: {
                    value: string | number | boolean;
                    variableName: string;
                    operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains";
                } | undefined;
                variableChanges?: Record<string, string | number | boolean> | undefined;
                rewardXp?: number | undefined;
                feedbackText?: string | undefined;
            }[] | undefined;
            missionId?: string | undefined;
            thinkPrompt?: {
                options: {
                    text: string;
                    id: string;
                    isCorrect: boolean;
                    explanation: string;
                }[];
                id: string;
                title: string;
                question: string;
                conceptReminder: string;
            } | undefined;
            unlockedAchievementId?: string | undefined;
        }, {
            type: "dialogue" | "cinematic" | "decision" | "think" | "lesson" | "challenge" | "simulation" | "investigation" | "reward" | "ending";
            id: string;
            title: string;
            storyId: string;
            chapterId: string;
            environmentId: string;
            camera: {
                type: "establishing" | "close_up" | "dialogue" | "over_the_shoulder" | "exploration" | "mission" | "transition";
                position: [number, number, number];
                target: [number, number, number];
                fov?: number | undefined;
                durationSeconds?: number | undefined;
            };
            characters: {
                characterId: string;
                position: [number, number, number];
                rotation: [number, number, number];
                scale?: [number, number, number] | undefined;
                initialAnimation?: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed" | undefined;
                modelUrl?: string | undefined;
            }[];
            dialogue?: {
                text: string;
                id: string;
                characterId: string;
                characterName: string;
                emotion: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed";
                audioId?: string | undefined;
                audioUrl?: string | undefined;
                subtitles?: {
                    startMs: number;
                    endMs: number;
                    text: string;
                }[] | undefined;
                durationMs?: number | undefined;
                pauseAfterMs?: number | undefined;
            }[] | undefined;
            nextSceneId?: string | undefined;
            rewardXp?: number | undefined;
            description?: string | undefined;
            choices?: {
                text: string;
                id: string;
                nextSceneId: string;
                condition?: {
                    value: string | number | boolean;
                    variableName: string;
                    operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains";
                } | undefined;
                variableChanges?: Record<string, string | number | boolean> | undefined;
                rewardXp?: number | undefined;
                feedbackText?: string | undefined;
            }[] | undefined;
            missionId?: string | undefined;
            thinkPrompt?: {
                options: {
                    text: string;
                    id: string;
                    isCorrect: boolean;
                    explanation: string;
                }[];
                id: string;
                title: string;
                question: string;
                conceptReminder: string;
            } | undefined;
            unlockedAchievementId?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
        storyId: string;
        description: string;
        order: number;
        scenes: {
            type: "dialogue" | "cinematic" | "decision" | "think" | "lesson" | "challenge" | "simulation" | "investigation" | "reward" | "ending";
            id: string;
            title: string;
            storyId: string;
            chapterId: string;
            environmentId: string;
            camera: {
                type: "establishing" | "close_up" | "dialogue" | "over_the_shoulder" | "exploration" | "mission" | "transition";
                position: [number, number, number];
                target: [number, number, number];
                fov?: number | undefined;
                durationSeconds?: number | undefined;
            };
            characters: {
                characterId: string;
                position: [number, number, number];
                rotation: [number, number, number];
                scale?: [number, number, number] | undefined;
                initialAnimation?: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed" | undefined;
                modelUrl?: string | undefined;
            }[];
            dialogue?: {
                text: string;
                id: string;
                characterId: string;
                characterName: string;
                emotion: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed";
                audioId?: string | undefined;
                audioUrl?: string | undefined;
                subtitles?: {
                    startMs: number;
                    endMs: number;
                    text: string;
                }[] | undefined;
                durationMs?: number | undefined;
                pauseAfterMs?: number | undefined;
            }[] | undefined;
            nextSceneId?: string | undefined;
            rewardXp?: number | undefined;
            description?: string | undefined;
            choices?: {
                text: string;
                id: string;
                nextSceneId: string;
                condition?: {
                    value: string | number | boolean;
                    variableName: string;
                    operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains";
                } | undefined;
                variableChanges?: Record<string, string | number | boolean> | undefined;
                rewardXp?: number | undefined;
                feedbackText?: string | undefined;
            }[] | undefined;
            missionId?: string | undefined;
            thinkPrompt?: {
                options: {
                    text: string;
                    id: string;
                    isCorrect: boolean;
                    explanation: string;
                }[];
                id: string;
                title: string;
                question: string;
                conceptReminder: string;
            } | undefined;
            unlockedAchievementId?: string | undefined;
        }[];
    }, {
        id: string;
        title: string;
        storyId: string;
        description: string;
        order: number;
        scenes: {
            type: "dialogue" | "cinematic" | "decision" | "think" | "lesson" | "challenge" | "simulation" | "investigation" | "reward" | "ending";
            id: string;
            title: string;
            storyId: string;
            chapterId: string;
            environmentId: string;
            camera: {
                type: "establishing" | "close_up" | "dialogue" | "over_the_shoulder" | "exploration" | "mission" | "transition";
                position: [number, number, number];
                target: [number, number, number];
                fov?: number | undefined;
                durationSeconds?: number | undefined;
            };
            characters: {
                characterId: string;
                position: [number, number, number];
                rotation: [number, number, number];
                scale?: [number, number, number] | undefined;
                initialAnimation?: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed" | undefined;
                modelUrl?: string | undefined;
            }[];
            dialogue?: {
                text: string;
                id: string;
                characterId: string;
                characterName: string;
                emotion: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed";
                audioId?: string | undefined;
                audioUrl?: string | undefined;
                subtitles?: {
                    startMs: number;
                    endMs: number;
                    text: string;
                }[] | undefined;
                durationMs?: number | undefined;
                pauseAfterMs?: number | undefined;
            }[] | undefined;
            nextSceneId?: string | undefined;
            rewardXp?: number | undefined;
            description?: string | undefined;
            choices?: {
                text: string;
                id: string;
                nextSceneId: string;
                condition?: {
                    value: string | number | boolean;
                    variableName: string;
                    operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains";
                } | undefined;
                variableChanges?: Record<string, string | number | boolean> | undefined;
                rewardXp?: number | undefined;
                feedbackText?: string | undefined;
            }[] | undefined;
            missionId?: string | undefined;
            thinkPrompt?: {
                options: {
                    text: string;
                    id: string;
                    isCorrect: boolean;
                    explanation: string;
                }[];
                id: string;
                title: string;
                question: string;
                conceptReminder: string;
            } | undefined;
            unlockedAchievementId?: string | undefined;
        }[];
    }>, "many">;
    totalMissions: z.ZodNumber;
    estimatedHours: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: string;
    description: string;
    slug: string;
    tagline: string;
    language: "python" | "javascript" | "java" | "cpp";
    difficulty: "beginner" | "intermediate" | "advanced";
    version: string;
    defaultEnvironmentId: string;
    chapters: {
        id: string;
        title: string;
        storyId: string;
        description: string;
        order: number;
        scenes: {
            type: "dialogue" | "cinematic" | "decision" | "think" | "lesson" | "challenge" | "simulation" | "investigation" | "reward" | "ending";
            id: string;
            title: string;
            storyId: string;
            chapterId: string;
            environmentId: string;
            camera: {
                type: "establishing" | "close_up" | "dialogue" | "over_the_shoulder" | "exploration" | "mission" | "transition";
                position: [number, number, number];
                target: [number, number, number];
                fov?: number | undefined;
                durationSeconds?: number | undefined;
            };
            characters: {
                characterId: string;
                position: [number, number, number];
                rotation: [number, number, number];
                scale?: [number, number, number] | undefined;
                initialAnimation?: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed" | undefined;
                modelUrl?: string | undefined;
            }[];
            dialogue?: {
                text: string;
                id: string;
                characterId: string;
                characterName: string;
                emotion: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed";
                audioId?: string | undefined;
                audioUrl?: string | undefined;
                subtitles?: {
                    startMs: number;
                    endMs: number;
                    text: string;
                }[] | undefined;
                durationMs?: number | undefined;
                pauseAfterMs?: number | undefined;
            }[] | undefined;
            nextSceneId?: string | undefined;
            rewardXp?: number | undefined;
            description?: string | undefined;
            choices?: {
                text: string;
                id: string;
                nextSceneId: string;
                condition?: {
                    value: string | number | boolean;
                    variableName: string;
                    operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains";
                } | undefined;
                variableChanges?: Record<string, string | number | boolean> | undefined;
                rewardXp?: number | undefined;
                feedbackText?: string | undefined;
            }[] | undefined;
            missionId?: string | undefined;
            thinkPrompt?: {
                options: {
                    text: string;
                    id: string;
                    isCorrect: boolean;
                    explanation: string;
                }[];
                id: string;
                title: string;
                question: string;
                conceptReminder: string;
            } | undefined;
            unlockedAchievementId?: string | undefined;
        }[];
    }[];
    totalMissions: number;
    estimatedHours: number;
    heroImageUrl?: string | undefined;
}, {
    id: string;
    title: string;
    description: string;
    slug: string;
    tagline: string;
    language: "python" | "javascript" | "java" | "cpp";
    difficulty: "beginner" | "intermediate" | "advanced";
    version: string;
    defaultEnvironmentId: string;
    chapters: {
        id: string;
        title: string;
        storyId: string;
        description: string;
        order: number;
        scenes: {
            type: "dialogue" | "cinematic" | "decision" | "think" | "lesson" | "challenge" | "simulation" | "investigation" | "reward" | "ending";
            id: string;
            title: string;
            storyId: string;
            chapterId: string;
            environmentId: string;
            camera: {
                type: "establishing" | "close_up" | "dialogue" | "over_the_shoulder" | "exploration" | "mission" | "transition";
                position: [number, number, number];
                target: [number, number, number];
                fov?: number | undefined;
                durationSeconds?: number | undefined;
            };
            characters: {
                characterId: string;
                position: [number, number, number];
                rotation: [number, number, number];
                scale?: [number, number, number] | undefined;
                initialAnimation?: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed" | undefined;
                modelUrl?: string | undefined;
            }[];
            dialogue?: {
                text: string;
                id: string;
                characterId: string;
                characterName: string;
                emotion: "idle" | "walking" | "running" | "talking" | "listening" | "thinking" | "surprised" | "happy" | "sad" | "angry" | "mission_success" | "mission_failed";
                audioId?: string | undefined;
                audioUrl?: string | undefined;
                subtitles?: {
                    startMs: number;
                    endMs: number;
                    text: string;
                }[] | undefined;
                durationMs?: number | undefined;
                pauseAfterMs?: number | undefined;
            }[] | undefined;
            nextSceneId?: string | undefined;
            rewardXp?: number | undefined;
            description?: string | undefined;
            choices?: {
                text: string;
                id: string;
                nextSceneId: string;
                condition?: {
                    value: string | number | boolean;
                    variableName: string;
                    operator: "equals" | "notEquals" | "greaterThan" | "lessThan" | "contains";
                } | undefined;
                variableChanges?: Record<string, string | number | boolean> | undefined;
                rewardXp?: number | undefined;
                feedbackText?: string | undefined;
            }[] | undefined;
            missionId?: string | undefined;
            thinkPrompt?: {
                options: {
                    text: string;
                    id: string;
                    isCorrect: boolean;
                    explanation: string;
                }[];
                id: string;
                title: string;
                question: string;
                conceptReminder: string;
            } | undefined;
            unlockedAchievementId?: string | undefined;
        }[];
    }[];
    totalMissions: number;
    estimatedHours: number;
    heroImageUrl?: string | undefined;
}>;
export interface ValidationIssue {
    type: 'error' | 'warning';
    message: string;
    location: string;
}
export declare function validateStoryGraph(campaign: StoryCampaign): ValidationIssue[];
//# sourceMappingURL=index.d.ts.map