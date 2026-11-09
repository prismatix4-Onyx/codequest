'use client';

import React from 'react';
import { GitBranch, Zap, ShieldAlert } from 'lucide-react';
import { Button, Card } from '@codequest/ui';
import { useStore } from '@/store/useStore';

export function DecisionModal() {
  const currentScene = useStore((s) => s.currentScene);
  const makeChoice = useStore((s) => s.makeChoice);

  if (!currentScene || currentScene.type !== 'decision' || !currentScene.choices) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <Card className="w-full max-w-2xl border-cyan-500/40 p-6 md:p-8 bg-slate-900/90 shadow-[0_0_50px_rgba(6,182,212,0.25)]">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30">
            <GitBranch className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100">{currentScene.title}</h3>
            <p className="text-sm text-slate-400">{currentScene.description}</p>
          </div>
        </div>

        <div className="space-y-4 my-6">
          {currentScene.choices.map((choice, idx) => (
            <button
              key={choice.id}
              onClick={() => makeChoice(choice.id)}
              className="w-full text-left p-4 rounded-xl border border-slate-700 bg-slate-800/60 hover:bg-cyan-950/40 hover:border-cyan-400/60 transition-all duration-200 group flex items-start justify-between"
            >
              <div className="space-y-1">
                <div className="text-sm md:text-base font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                  Option {idx + 1}: {choice.text}
                </div>
                {choice.feedbackText && (
                  <div className="text-xs text-slate-400">{choice.feedbackText}</div>
                )}
              </div>

              {choice.rewardXp && (
                <span className="flex items-center space-x-1 text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded-md shrink-0 ml-3">
                  <Zap className="w-3.5 h-3.5" />
                  <span>+{choice.rewardXp} XP</span>
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center text-xs text-slate-400 gap-1.5 justify-center">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          <span>Every decision modifies station variables and steers narrative progression.</span>
        </div>
      </Card>
    </div>
  );
}
