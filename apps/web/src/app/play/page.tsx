'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { WorldCanvas } from '@/components/canvas/WorldCanvas';
import { CinematicPlayer } from '@/components/story/CinematicPlayer';
import { StoryDialogueOverlay } from '@/components/story/StoryDialogueOverlay';
import { DecisionModal } from '@/components/story/DecisionModal';
import { ThinkBeforeYouCodeModal } from '@/components/story/ThinkBeforeYouCodeModal';
import { MissionSuccessModal } from '@/components/story/MissionSuccessModal';
import { CodeStudio } from '@/components/editor/CodeStudio';
import { CodeUsernameTerminal } from '@/components/story/CodeUsernameTerminal';
import { useStore } from '@/store/useStore';
import { Play, Sparkles, Terminal, Code2, RotateCcw, Activity } from 'lucide-react';
import { Button } from '@codequest/ui';
import { soundFx } from '@/utils/soundEffects';

function PlayPageContent() {
  const searchParams = useSearchParams();
  const user = useStore((s) => s.user);
  const currentScene = useStore((s) => s.currentScene);
  const startCampaign = useStore((s) => s.startCampaign);
  const environmentState = useStore((s) => s.environmentState);
  const reactorState = useStore((s) => s.reactorState);
  const ariaAnimation = useStore((s) => s.ariaAnimation);
  const isEditorOpen = useStore((s) => s.isEditorOpen);
  const openMission = useStore((s) => s.openMission);
  const advanceDialogue = useStore((s) => s.advanceDialogue);

  const [isUsernameTerminalOpen, setIsUsernameTerminalOpen] = useState(false);
  const [isPlayingCinematic, setIsPlayingCinematic] = useState(false);

  useEffect(() => {
    // Stop any residual speech synthesis from previous pages
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    // If explicitly requested via ?intro=true, open cinematic
    if (searchParams.get('intro') === 'true') {
      setIsPlayingCinematic(true);
      return;
    }

    if (typeof window !== 'undefined') {
      const isCustomName = localStorage.getItem('cq_adventure_name_set');
      const hasWatchedCinematic = localStorage.getItem('cq_cinematic_completed');

      if (!isCustomName) {
        // Step 1: Prompt the adventurer to initialize their username via code
        const timer = setTimeout(() => {
          setIsUsernameTerminalOpen(true);
        }, 800);
        return () => clearTimeout(timer);
      } else if (!hasWatchedCinematic) {
        // Step 2: Play the cinematic if username is set and cinematic hasn't been completed yet
        setIsPlayingCinematic(true);
      } else {
        // Step 3: Only start campaign story dialogue if not playing cinematic
        startCampaign();
      }
    }
  }, [startCampaign, searchParams]);

  const handleUsernameComplete = (newUsername: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cq_adventure_name_set', 'true');
    }
    setIsUsernameTerminalOpen(false);
    // After username is initialized, trigger the cinematic opening
    setIsPlayingCinematic(true);
  };

  const handleCinematicComplete = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cq_cinematic_completed', 'true');
    }
    setIsPlayingCinematic(false);

    // Transition smoothly to ARIA's diagnostic handshake briefing
    const engine = useStore.getState().storyEngine;
    engine.goToScene('scene-lp-2-briefing');
    const nextScene = engine.getCurrentScene();
    useStore.setState({
      currentScene: nextScene,
      currentDialogue: nextScene?.dialogue?.[0] || null,
      dialogueIndex: 0,
      totalDialogue: nextScene?.dialogue?.length || 0,
      ariaAnimation: 'talking',
    });
    useStore.getState().replayDialogueVoice();
    soundFx.playSuccess();
  };

  const handleReplayCinematic = () => {
    soundFx.playClick();
    setIsPlayingCinematic(true);
  };

  return (
    <div className="relative flex-1 w-full h-[calc(100vh-61px)] overflow-hidden bg-slate-950 flex flex-col">
      {/* 1. Cinematic Opening Player Overlay (When active) */}
      {isPlayingCinematic ? (
        <div className="absolute inset-0 z-30 animate-fadeIn">
          <CinematicPlayer
            onComplete={handleCinematicComplete}
            onSkip={handleCinematicComplete}
            initialAutoplay={true}
          />
        </div>
      ) : (
        /* 2. Live 3D World Canvas Viewport (ORPHEUS Bridge, ARIA, Reactor Core) */
        <div className="absolute inset-0 z-0">
          <WorldCanvas
            enableOrbitControls={true}
            ariaAnimation={ariaAnimation}
            reactorState={reactorState}
          />
        </div>
      )}

      {/* Top Scene HUD Header */}
      {!isPlayingCinematic && (
        <div className="relative z-10 p-4 md:p-6 flex items-start justify-between pointer-events-none">
          <div className="glass-panel px-4 py-2 rounded-xl border border-slate-700/60 pointer-events-auto">
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ORPHEUS BRIDGE — CHAPTER 1</span>
            </div>
            <h2 className="text-sm md:text-base font-bold text-slate-100">
              {currentScene?.title || 'The Silent Vessel'}
            </h2>
          </div>

          {/* Right HUD Controls: Replay Cinematic, Username REPL & Diagnostics Badge */}
          <div className="flex items-center space-x-3 pointer-events-auto">
            {/* Replay Cinematic Button */}
            <button
              onClick={handleReplayCinematic}
              title="Replay Opening Cinematic Sequence"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-all shadow-md cursor-pointer backdrop-blur-md"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Replay Intro</span>
            </button>

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
      )}

      {/* Floating Mission Quick Launcher if in challenge scene and editor was closed */}
      {!isPlayingCinematic && currentScene?.type === 'challenge' && !isEditorOpen && (
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

      {/* Interactive Story Components (When not in full cinematic mode) */}
      {!isPlayingCinematic && (
        <>
          <StoryDialogueOverlay />
          <DecisionModal />
          <ThinkBeforeYouCodeModal />
          <MissionSuccessModal />
        </>
      )}

      {/* In-Game Interactive Username Coding Terminal */}
      <CodeUsernameTerminal
        isOpen={isUsernameTerminalOpen}
        onComplete={handleUsernameComplete}
      />

      {/* Monaco Code Studio Dock */}
      {!isPlayingCinematic && <CodeStudio />}
    </div>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={<div className="w-full h-screen bg-slate-950 flex items-center justify-center text-cyan-400">Loading Game World...</div>}>
      <PlayPageContent />
    </Suspense>
  );
}
