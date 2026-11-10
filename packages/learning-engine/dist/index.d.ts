import type { ProgressiveHint, ConceptMasteryRecord, ExecutionResult, ThinkPrompt, ThinkOption } from '@codequest/shared-types';
export declare class HintManager {
    private hints;
    private unlockedLevel;
    constructor(hints: ProgressiveHint[]);
    getUnlockedHints(): ProgressiveHint[];
    unlockNextHint(): ProgressiveHint | null;
    getCurrentLevel(): number;
    hasMoreHints(): boolean;
}
export declare class ThinkBeforeYouCodeEngine {
    private prompt;
    private selectedOptionId;
    private isCompleted;
    constructor(prompt: ThinkPrompt);
    getPrompt(): ThinkPrompt;
    selectOption(optionId: string): {
        isCorrect: boolean;
        explanation: string;
        option: ThinkOption | undefined;
    };
    isStageCompleted(): boolean;
}
export declare class MasteryEvaluator {
    static calculateMastery(previous: ConceptMasteryRecord, result: ExecutionResult, hintsUsed: number): ConceptMasteryRecord;
    static generateFeedback(result: ExecutionResult): string;
}
//# sourceMappingURL=index.d.ts.map