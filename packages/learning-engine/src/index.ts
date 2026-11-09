import type {
  ProgressiveHint,
  ConceptMasteryRecord,
  ExecutionResult,
  ThinkPrompt,
  ThinkOption,
} from '@codequest/shared-types';

export class HintManager {
  private hints: ProgressiveHint[];
  private unlockedLevel: number = 0;

  constructor(hints: ProgressiveHint[]) {
    this.hints = hints.sort((a, b) => a.level - b.level);
  }

  public getUnlockedHints(): ProgressiveHint[] {
    return this.hints.filter((h) => h.level <= this.unlockedLevel);
  }

  public unlockNextHint(): ProgressiveHint | null {
    if (this.unlockedLevel < 4) {
      this.unlockedLevel++;
      const hint = this.hints.find((h) => h.level === this.unlockedLevel);
      if (hint) {
        hint.isUnlocked = true;
        return hint;
      }
    }
    return null;
  }

  public getCurrentLevel(): number {
    return this.unlockedLevel;
  }

  public hasMoreHints(): boolean {
    return this.unlockedLevel < Math.min(4, this.hints.length);
  }
}

export class ThinkBeforeYouCodeEngine {
  private prompt: ThinkPrompt;
  private selectedOptionId: string | null = null;
  private isCompleted: boolean = false;

  constructor(prompt: ThinkPrompt) {
    this.prompt = prompt;
  }

  public getPrompt(): ThinkPrompt {
    return this.prompt;
  }

  public selectOption(optionId: string): {
    isCorrect: boolean;
    explanation: string;
    option: ThinkOption | undefined;
  } {
    this.selectedOptionId = optionId;
    const option = this.prompt.options.find((o) => o.id === optionId);
    const isCorrect = option ? option.isCorrect : false;

    if (isCorrect) {
      this.isCompleted = true;
    }

    return {
      isCorrect,
      explanation: option ? option.explanation : 'Option not found',
      option,
    };
  }

  public isStageCompleted(): boolean {
    return this.isCompleted;
  }
}

export class MasteryEvaluator {
  public static calculateMastery(
    previous: ConceptMasteryRecord,
    result: ExecutionResult,
    hintsUsed: number
  ): ConceptMasteryRecord {
    const totalAttempts = previous.totalAttempts + 1;
    let challengesCompleted = previous.challengesCompleted;
    let newMastery = previous.masteryPercentage;

    if (result.allPassed) {
      challengesCompleted++;
      // Score penalty for excessive hint dependency
      const hintPenalty = Math.min(30, hintsUsed * 7.5);
      const attemptBonus = Math.max(10, 40 - Math.min(totalAttempts * 5, 25));
      const targetGain = Math.max(5, attemptBonus - hintPenalty);

      newMastery = Math.min(100, previous.masteryPercentage + targetGain);
    } else {
      // Small penalty on syntax/runtime error
      newMastery = Math.max(0, previous.masteryPercentage - 2);
    }

    return {
      userId: previous.userId,
      conceptId: previous.conceptId,
      masteryPercentage: Math.round(newMastery),
      challengesCompleted,
      totalAttempts,
      hintsUsedCount: previous.hintsUsedCount + hintsUsed,
      lastPracticedAt: new Date().toISOString(),
      needsReview: newMastery < 50 && totalAttempts > 3,
    };
  }

  public static generateFeedback(result: ExecutionResult): string {
    if (result.allPassed) {
      return 'Outstanding! All test cases passed with zero execution anomalies.';
    }

    if (result.status === 'syntax_error') {
      return `Syntax Error Detected: Please review line indentation, missing colons, or unmatched quotes.\nDetails: ${result.stderr || result.error}`;
    }

    if (result.status === 'timeout') {
      return 'Execution Timed Out: An infinite loop or blocking operation was detected. Verify your termination conditions.';
    }

    if (result.status === 'runtime_error') {
      return `Runtime Exception: An error occurred during execution. Inspect variable types and boundaries.\nDetails: ${result.stderr || result.error}`;
    }

    const failedCount = result.testResults.filter((t) => !t.passed).length;
    return `${failedCount} test case(s) did not match the expected specifications. Review edge cases and expected data formats.`;
  }
}
