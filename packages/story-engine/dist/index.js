"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoryEngine = void 0;
class StoryEngine {
    campaign;
    currentScene = null;
    currentDialogueIndex = 0;
    progress;
    listeners = [];
    constructor(campaign, initialProgress) {
        this.campaign = campaign;
        const firstChapter = campaign.chapters[0];
        const firstScene = firstChapter?.scenes[0];
        this.progress = {
            userId: initialProgress?.userId || 'guest-user',
            storyId: campaign.id,
            currentChapterId: initialProgress?.currentChapterId || firstChapter?.id || '',
            currentSceneId: initialProgress?.currentSceneId || firstScene?.id || '',
            completedSceneIds: initialProgress?.completedSceneIds || [],
            variables: initialProgress?.variables || {},
            inventory: initialProgress?.inventory || [],
            unlockedCheckpoints: initialProgress?.unlockedCheckpoints || [],
            completedMissionIds: initialProgress?.completedMissionIds || [],
            lastSavedAt: new Date().toISOString(),
        };
        if (this.progress.currentSceneId) {
            this.currentScene = this.findSceneById(this.progress.currentSceneId);
        }
    }
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter((l) => l !== listener);
        };
    }
    start() {
        if (!this.currentScene) {
            const firstChapter = this.campaign.chapters[0];
            const firstScene = firstChapter?.scenes[0];
            if (firstScene) {
                this.goToScene(firstScene.id);
            }
        }
        else {
            this.notifySceneChange(this.currentScene);
        }
        return this.currentScene;
    }
    getCurrentScene() {
        return this.currentScene;
    }
    getProgress() {
        return { ...this.progress, lastSavedAt: new Date().toISOString() };
    }
    getCurrentDialogue() {
        if (!this.currentScene || !this.currentScene.dialogue)
            return null;
        return this.currentScene.dialogue[this.currentDialogueIndex] || null;
    }
    getCurrentDialogueIndex() {
        return this.currentDialogueIndex;
    }
    getTotalDialogueCount() {
        return this.currentScene?.dialogue?.length || 0;
    }
    advanceDialogue() {
        if (!this.currentScene || !this.currentScene.dialogue)
            return false;
        if (this.currentDialogueIndex < this.currentScene.dialogue.length - 1) {
            this.currentDialogueIndex++;
            const line = this.currentScene.dialogue[this.currentDialogueIndex];
            this.listeners.forEach((l) => l.onDialogueStep?.(line, this.currentDialogueIndex, this.currentScene.dialogue.length));
            return true;
        }
        // Dialogue finished in current scene; check auto nextScene or mission trigger
        if (this.currentScene.missionId) {
            this.listeners.forEach((l) => l.onMissionTriggered?.(this.currentScene.missionId));
        }
        else if (this.currentScene.nextSceneId) {
            this.goToScene(this.currentScene.nextSceneId);
        }
        return false;
    }
    makeChoice(choiceId) {
        if (!this.currentScene || !this.currentScene.choices)
            return false;
        const choice = this.currentScene.choices.find((c) => c.id === choiceId);
        if (!choice)
            return false;
        if (choice.condition && !this.evaluateCondition(choice.condition)) {
            return false; // Choice condition not met
        }
        // Apply variable changes
        if (choice.variableChanges) {
            Object.assign(this.progress.variables, choice.variableChanges);
        }
        return this.goToScene(choice.nextSceneId);
    }
    goToScene(sceneId) {
        const next = this.findSceneById(sceneId);
        if (!next)
            return false;
        if (this.currentScene) {
            if (!this.progress.completedSceneIds.includes(this.currentScene.id)) {
                this.progress.completedSceneIds.push(this.currentScene.id);
            }
        }
        this.currentScene = next;
        this.currentDialogueIndex = 0;
        this.progress.currentSceneId = next.id;
        this.progress.currentChapterId = next.chapterId;
        if (next.type === 'reward' || next.type === 'ending') {
            if (!this.progress.unlockedCheckpoints.includes(next.id)) {
                this.progress.unlockedCheckpoints.push(next.id);
            }
        }
        this.notifySceneChange(next);
        if (next.type === 'ending') {
            this.listeners.forEach((l) => l.onStoryFinished?.(this.campaign.id));
        }
        return true;
    }
    markMissionComplete(missionId, nextSceneId) {
        if (!this.progress.completedMissionIds.includes(missionId)) {
            this.progress.completedMissionIds.push(missionId);
        }
        const targetSceneId = nextSceneId || this.currentScene?.nextSceneId;
        if (targetSceneId) {
            this.goToScene(targetSceneId);
        }
    }
    getAvailableChoices() {
        if (!this.currentScene || !this.currentScene.choices)
            return [];
        return this.currentScene.choices.filter((c) => !c.condition || this.evaluateCondition(c.condition));
    }
    setVariable(name, value) {
        this.progress.variables[name] = value;
    }
    getVariable(name) {
        return this.progress.variables[name];
    }
    evaluateCondition(cond) {
        const val = this.progress.variables[cond.variableName];
        switch (cond.operator) {
            case 'equals':
                return val === cond.value;
            case 'notEquals':
                return val !== cond.value;
            case 'greaterThan':
                return typeof val === 'number' && typeof cond.value === 'number' && val > cond.value;
            case 'lessThan':
                return typeof val === 'number' && typeof cond.value === 'number' && val < cond.value;
            case 'contains':
                return typeof val === 'string' && typeof cond.value === 'string' && val.includes(cond.value);
            default:
                return false;
        }
    }
    findSceneById(sceneId) {
        for (const ch of this.campaign.chapters) {
            const match = ch.scenes.find((s) => s.id === sceneId);
            if (match)
                return match;
        }
        return null;
    }
    notifySceneChange(scene) {
        this.listeners.forEach((l) => l.onSceneChange?.(scene));
        if (scene.dialogue && scene.dialogue.length > 0) {
            const firstLine = scene.dialogue[0];
            this.listeners.forEach((l) => l.onDialogueStep?.(firstLine, 0, scene.dialogue.length));
        }
    }
}
exports.StoryEngine = StoryEngine;
//# sourceMappingURL=index.js.map