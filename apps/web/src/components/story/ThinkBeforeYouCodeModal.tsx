'use client';

import React, { useState } from 'react';
import { Brain, CheckCircle2, XCircle, ArrowRight, Lightbulb } from 'lucide-react';
import { Button, Card } from '@codequest/ui';
import { useStore } from '@/store/useStore';

export function ThinkBeforeYouCodeModal() {
  const currentScene = useStore((s) => s.currentScene);
  const storyEngine = useStore((s) => s.storyEngine);
  const addXp = useStore((s) => s.addXp);

  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);

  if (!currentScene || currentScene.type !== 'think' || !currentScene.thinkPrompt) {
    return null;
  }

  const prompt = currentScene.thinkPrompt;
  const selectedOption = prompt.options.find((o) => o.id === selectedOptionId);
  const isCorrect = selectedOption?.isCorrect ?? false;

  const handleSelect = (optionId: string) => {
    setSelectedOptionId(optionId);
    setHasAnswered(true);
    const opt = prompt.options.find((o) => o.id === optionId);
    if (opt?.isCorrect) {
      addXp(25);
    }
  };

  const handleProceed = () => {
    if (currentScene.nextSceneId) {
      storyEngine.goToScene(currentScene.nextSceneId);
      const next = storyEngine.getCurrentScene();
      useStore.setState({
        currentScene: next,
        currentDialogue: next?.dialogue?.[0] || null,
        dialogueIndex: 0,
        totalDialogue: next?.dialogue?.length || 0,
      });

      if (next?.missionId) {
        useStore.getState().openMission(next.missionId);
      }
    }
  };

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <Card className="w-full max-w-2xl border-cyan-500/40 p-6 md:p-8 bg-slate-900/90 shadow-[0_0_50px_rgba(6,182,212,0.25)]">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-cyan-400 font-bold">
              Think Before You Code
            </div>
            <h3 className="text-lg md:text-xl font-bold text-slate-100">{prompt.title}</h3>
          </div>
        </div>

        {/* Concept Reminder Banner */}
        <div className="flex items-start space-x-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs md:text-sm my-3">
          <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{prompt.conceptReminder}</span>
        </div>

        {/* Question Text */}
        <div className="my-4 text-slate-200 text-sm md:text-base font-medium">
          {prompt.question}
        </div>

        {/* Multiple Choice Options */}
        <div className="space-y-3 my-4">
          {prompt.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            let borderStyle = 'border-slate-700 bg-slate-800/60 hover:border-slate-500';
            if (hasAnswered) {
              if (opt.isCorrect) borderStyle = 'border-emerald-500/80 bg-emerald-950/40';
              else if (isSelected && !opt.isCorrect)
                borderStyle = 'border-rose-500/80 bg-rose-950/40';
            } else if (isSelected) {
              borderStyle = 'border-cyan-400 bg-cyan-950/40';
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all duration-200 font-mono text-xs md:text-sm flex items-center justify-between ${borderStyle}`}
              >
                <span>{opt.text}</span>
                {hasAnswered && opt.isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                {hasAnswered && isSelected && !opt.isCorrect && (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Feedback */}
        {hasAnswered && selectedOption && (
          <div
            className={`p-3.5 rounded-lg border text-xs md:text-sm my-4 transition-all ${
              isCorrect
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
            }`}
          >
            <div className="font-bold mb-1">{isCorrect ? 'Logic Confirmed' : 'Reasoning Gap'}</div>
            <div>{selectedOption.explanation}</div>
          </div>
        )}

        {/* Continue Button */}
        <div className="flex justify-end pt-3 border-t border-slate-700/40">
          <Button
            variant="glow-cyan"
            size="md"
            disabled={!hasAnswered || !isCorrect}
            onClick={handleProceed}
            className="flex items-center gap-1.5"
          >
            <span>Open Monaco Code Studio</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
