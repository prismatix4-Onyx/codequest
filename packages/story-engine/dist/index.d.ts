import type { StoryCampaign, StoryScene, StoryChoice, PlayerStoryProgress, DialogueLine } from '@codequest/shared-types';
export interface StoryEngineListener {
    onSceneChange?: (scene: StoryScene) => void;
    onDialogueStep?: (line: DialogueLine, index: number, total: number) => void;
    onMissionTriggered?: (missionId: string) => void;
    onStoryFinished?: (campaignId: string) => void;
}
export declare class StoryEngine {
    private campaign;
    private currentScene;
    private currentDialogueIndex;
    private progress;
    private listeners;
    constructor(campaign: StoryCampaign, initialProgress?: Partial<PlayerStoryProgress>);
    subscribe(listener: StoryEngineListener): () => void;
    start(): StoryScene | null;
    getCurrentScene(): StoryScene | null;
    getProgress(): PlayerStoryProgress;
    getCurrentDialogue(): DialogueLine | null;
    getCurrentDialogueIndex(): number;
    getTotalDialogueCount(): number;
    advanceDialogue(): boolean;
    makeChoice(choiceId: string): boolean;
    goToScene(sceneId: string): boolean;
    markMissionComplete(missionId: string, nextSceneId?: string): void;
    getAvailableChoices(): StoryChoice[];
    setVariable(name: string, value: string | number | boolean): void;
    getVariable(name: string): string | number | boolean | undefined;
    private evaluateCondition;
    private findSceneById;
    private notifySceneChange;
}
//# sourceMappingURL=index.d.ts.map