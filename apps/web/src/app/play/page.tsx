'use client';

import React, { useEffect, useState } from 'react';
import { StationBridgeScene } from '@/components/3d/StationBridgeScene';
import { StoryDialogueOverlay } from '@/components/story/StoryDialogueOverlay';
import { DecisionModal } from '@/components/story/DecisionModal';
import { ThinkBeforeYouCodeModal } from '@/components/story/ThinkBeforeYouCodeModal';
import { CodeStudio } from '@/components/editor/CodeStudio';
import { CodeUsernameTerminal } from '@/components/story/CodeUsernameTerminal';
import { useStore } from '@/store/useStore';
import { Play, Sparkles, Terminal, Code2 } from 'lucide-react';
import { Button } from '@codequest/ui';
import { soundFx } from '@/utils/soundEffects';

export default function PlayPage() {
  const user = useStore((s) => s.user);
  const currentScene = useStore((s) => s.currentScene);
  const startCampaign = useStore((s) => s.startCampaign);
  const environmentState = useStore((s) => s.environmentState);
  const isEditorOpen = useStore((s) => s.isEditorOpen);
  const openMission = useStore((s) => s.openMission);
  const advanceDialogue = useStore((s) => s.advanceDialogue);

  const [isUsernameTerminalOpen, setIsUsernameTerminalOpen] = useState(false);

  useEffect(() => {
    // Initialize campaign if not already started
    startCampaign();

    // Check if adventurer has customized their username through coding
    if (typeof window !== 'undefined') {
      const isCustom = localStorage.getItem('cq_adventure_name_set');
      if (!isCustom) {
        // Pop the interactive username coding prompt right after introductory scene loads
        const timer = setTimeout(() => {
          setIsUsernameTerminalOpen(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [startCampaign]);

  const handleUsernameComplete = (newUsername: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cq_adventure_name_set', 'true');
    }
    setIsUsernameTerminalOpen(false);
    advanceDialogue();
  };

  return (
    <div className="relative flex-1 w-full h-[calc(100vh-61px)] overflow-hidden bg-slate-950 flex flex-col">
      {/* 3D Cinematic Game Viewport (Full Screen) */}
      <div className="absolute inset-0 z-0">
        <StationBridgeScene />
      </div>

      {/* Top Scene HUD Header */}
      <div className="relative z-10 p-4 md:p-6 flex items-start justify-between pointer-events-none">
        <div className="glass-panel px-4 py-2 rounded-xl border border-slate-700/60 pointer-events-auto">
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ORBITAL STATION AETHELGARD</span>
          </div>
          <h2 className="text-sm md:text-base font-bold text-slate-100">
            {currentScene?.title || 'Nexus Bridge Diagnostics'}
          </h2>
        </div>

        {/* Right HUD Controls: Username Coding Terminal & Diagnostics Badge */}
        <div className="flex items-center space-x-3 pointer-events-auto">
          {/* Quick Trigger for Username Coding REPL */}
          <button
            onClick={() => {
              soundFx.playClick();
              setIsUsernameTerminalOpen(true);
            }}
            onMouseEnter={() => soundFx.playHover()}
            title="Open Interactive Username Coding REPL"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/50 text-indigo-300 text-xs font-mono font-semibold transition-all shadow-md cursor-pointer backdrop-blur-md"
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>username=input()</span>
          </button>

          {/* System Diagnostics Badge */}
          <div className="glass-panel px-3 py-1.5 rounded-lg border border-slate-700/60 flex items-center space-x-2">
            <span
              className={`w-2.5 h-2.5 rounded-full animate-ping ${
                environmentState.powerState === 'online' ? 'bg-cyan-400' : 'bg-rose-500'
              }`}
            />
            <span
              className={`text-xs font-mono font-bold tracking-wider ${
                environmentState.powerState === 'online' ? 'text-cyan-300' : 'text-rose-400'
              }`}
            >
              {environmentState.statusText}
            </span>
          </div>
        </div>
      </div>

      {/* Floating Mission Quick Launcher if in challenge scene and editor was closed */}
      {currentScene?.type === 'challenge' && !isEditorOpen && (
        <div className="absolute top-20 right-6 z-20">
          <Button
            variant="glow-cyan"
            size="md"
            onClick={() => openMission(currentScene.missionId || 'mission-lp-01')}
            className="flex items-center gap-2 shadow-cyan-500/50"
          >
            <Terminal className="w-4 h-4" />
            <span>Open Code Studio</span>
          </Button>
        </div>
      )}

      {/* Interactive Story Components */}
      <StoryDialogueOverlay />
      <DecisionModal />
      <ThinkBeforeYouCodeModal />

      {/* In-Game Interactive Username Coding Terminal */}
      <CodeUsernameTerminal
        isOpen={isUsernameTerminalOpen}
        onComplete={handleUsernameComplete}
      />

      {/* Monaco Code Studio Dock */}
      <CodeStudio />
    </div>
  );
}
