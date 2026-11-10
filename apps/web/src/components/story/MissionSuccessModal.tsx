'use client';

import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, ChevronRight, Eye, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { Button, Card } from '@codequest/ui';
import { useStore } from '@/store/useStore';
import { soundFx } from '@/utils/soundEffects';

export function MissionSuccessModal() {
  const currentScene = useStore((s) => s.currentScene);
  const user = useStore((s) => s.user);
  const reactorState = useStore((s) => s.reactorState);
  const storyEngine = useStore((s) => s.storyEngine);
  const advanceDialogue = useStore((s) => s.advanceDialogue);

  const [isOpen, setIsOpen] = useState(false);
  const [isInspecting3D, setIsInspecting3D] = useState(false);

  // Trigger whenever the scene enters reward or ending state with reactor operational
  useEffect(() => {
    if (
      (currentScene?.type === 'reward' || currentScene?.type === 'ending') &&
      reactorState === 'operational'
    ) {
      setIsOpen(true);
      setIsInspecting3D(false);
      soundFx.playSuccess();
    } else {
      setIsOpen(false);
    }
  }, [currentScene?.type, reactorState]);

  if (!isOpen) return null;

  // Minimized banner when cadet chooses "Inspect 3D Command Deck"
  if (isInspecting3D) {
    return (
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 animate-fadeIn">
        <div className="glass-panel px-5 py-3 rounded-2xl border border-emerald-500/50 shadow-2xl flex items-center space-x-4 bg-slate-900/90 backdrop-blur-md">
          <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>REACTOR NOMINAL — FREE INSPECTION MODE</span>
          </div>
          <Button
            variant="glow-cyan"
            size="sm"
            onClick={() => {
              soundFx.playClick();
              setIsInspecting3D(false);
            }}
            className="text-xs"
          >
            Return to Mission Debrief
          </Button>
        </div>
      </div>
    );
  }

  const handleContinue = () => {
    soundFx.playClick();
    if (currentScene?.nextSceneId) {
      storyEngine.goToScene(currentScene.nextSceneId);
      const next = storyEngine.getCurrentScene();
      useStore.setState({
        currentScene: next,
        currentDialogue: next?.dialogue?.[0] || null,
        dialogueIndex: 0,
        totalDialogue: next?.dialogue?.length || 0,
      });
      useStore.getState().replayDialogueVoice();
    } else {
      advanceDialogue();
    }
  };

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <Card className="w-full max-w-2xl border-emerald-500/50 p-6 md:p-8 bg-slate-900/95 shadow-[0_0_60px_rgba(16,185,129,0.25)] relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header Badge */}
        <div className="flex items-center justify-between mb-4 border-b border-slate-700/60 pb-4 relative z-10">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 shadow-inner">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Protocol Synchronized</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-100">
                {currentScene?.title || 'Station Core Restored'}
              </h2>
            </div>
          </div>

          <div className="hidden sm:flex flex-col items-end font-mono">
            <span className="text-[10px] text-slate-400 uppercase">Station Core</span>
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% OPERATIONAL
            </span>
          </div>
        </div>

        {/* Dialogue Card */}
        {currentScene?.dialogue?.[0] && (
          <div className="my-4 p-4 rounded-xl bg-slate-800/60 border border-cyan-500/30 text-slate-200 relative z-10">
            <div className="text-xs font-mono font-bold text-cyan-400 mb-1 flex items-center gap-1">
              <span>ARIA // AI GUARDIAN</span>
            </div>
            <p className="text-sm md:text-base leading-relaxed italic text-slate-100">
              "{currentScene.dialogue[0].text}"
            </p>
          </div>
        )}

        {/* Rewards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-5 relative z-10">
          {/* XP Card */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/30 flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-amber-400 font-mono font-bold">EXPERIENCE REWARD</div>
              <div className="text-lg font-bold text-white flex items-center gap-1.5">
                <span>+150 XP</span>
                <span className="text-xs text-slate-400 font-normal">
                  (Level {user.level || 1})
                </span>
              </div>
            </div>
          </div>

          {/* Achievement Unlocked */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-purple-500/10 to-indigo-600/5 border border-purple-500/30 flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-400/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-purple-400 font-mono font-bold">ACHIEVEMENT UNLOCKED</div>
              <div className="text-sm font-bold text-white">First Boot</div>
              <div className="text-[11px] text-slate-400">Restored primary reactor telemetry</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-700/60 relative z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              soundFx.playClick();
              setIsInspecting3D(true);
            }}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 order-2 sm:order-1"
          >
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>Inspect 3D Command Deck</span>
          </Button>

          <Button
            variant="glow-cyan"
            size="md"
            onClick={handleContinue}
            className="w-full sm:w-auto flex items-center justify-center gap-2 shadow-emerald-500/30 order-1 sm:order-2"
          >
            <span>Proceed to Next Transmission</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
