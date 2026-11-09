'use client';

import React from 'react';
import { Volume2, VolumeX, RotateCcw, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@codequest/ui';
import { useStore } from '@/store/useStore';

export function StoryDialogueOverlay() {
  const currentScene = useStore((s) => s.currentScene);
  const currentDialogue = useStore((s) => s.currentDialogue);
  const dialogueIndex = useStore((s) => s.dialogueIndex);
  const totalDialogue = useStore((s) => s.totalDialogue);
  const isDialoguePlaying = useStore((s) => s.isDialoguePlaying);
  const advanceDialogue = useStore((s) => s.advanceDialogue);
  const replayDialogueVoice = useStore((s) => s.replayDialogueVoice);
  const preferences = useStore((s) => s.preferences);
  const updatePreferences = useStore((s) => s.updatePreferences);
  const audioEngine = useStore((s) => s.audioEngine);

  if (!currentDialogue) return null;

  const toggleMute = () => {
    const isMuted = audioEngine.toggleMute();
    updatePreferences({ voiceVolume: isMuted ? 0 : 0.85 });
  };

  return (
    <div className="absolute bottom-6 inset-x-4 md:inset-x-12 z-20 flex flex-col items-center pointer-events-none">
      <div className="w-full max-w-4xl glass-panel p-5 rounded-2xl shadow-2xl border border-cyan-500/30 pointer-events-auto transition-all duration-300">
        {/* Top Header Row */}
        <div className="flex items-center justify-between mb-3 border-b border-slate-700/50 pb-2">
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 rounded-full text-xs font-bold tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              {currentDialogue.characterName}
            </span>

            {/* Audio Waveform Indicator */}
            {isDialoguePlaying && (
              <div className="flex items-center space-x-1">
                {[0.4, 0.9, 0.5, 1.0, 0.6].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 bg-cyan-400 rounded-full animate-pulse"
                    style={{
                      height: `${h * 16}px`,
                      animationDelay: `${i * 120}ms`,
                    }}
                  />
                ))}
                <span className="text-xs text-cyan-400/80 font-mono ml-1">VOICE TRANSMITTING</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={replayDialogueVoice}
              title="Replay Voice Audio"
              className="p-1.5 text-slate-400 hover:text-cyan-300 transition-colors rounded-lg hover:bg-slate-800"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={toggleMute}
              title="Toggle Audio Mute"
              className="p-1.5 text-slate-400 hover:text-cyan-300 transition-colors rounded-lg hover:bg-slate-800"
            >
              {preferences.voiceVolume > 0 ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4 text-rose-400" />
              )}
            </button>
            <span className="text-xs text-slate-400 font-mono">
              {dialogueIndex + 1} / {totalDialogue}
            </span>
          </div>
        </div>

        {/* Dialogue Body & Subtitle */}
        <div className="py-2 text-slate-100 text-base md:text-lg leading-relaxed font-sans min-h-[4rem]">
          {currentDialogue.text}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-700/40 mt-2">
          <span className="text-xs text-slate-400 italic">
            {currentScene?.type === 'challenge'
              ? 'Press Continue to initialize Monaco Code Studio'
              : 'Press Continue to advance dialogue'}
          </span>

          <Button
            variant="glow-cyan"
            size="md"
            onClick={advanceDialogue}
            className="flex items-center gap-1.5 shadow-cyan-500/30"
          >
            <span>{dialogueIndex < totalDialogue - 1 ? 'Next' : 'Continue'}</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
