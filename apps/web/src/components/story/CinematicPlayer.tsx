'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { WorldCanvas } from '@/components/canvas/WorldCanvas';
import {
  CINEMATIC_SHOTS,
  TOTAL_CINEMATIC_DURATION,
  CinematicShot,
} from './CinematicTimeline';
import { AriaAnimationState } from '@/components/characters/AriaCharacter';
import { ReactorState } from '@/components/props/ReactorCore';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Volume2,
  VolumeX,
  MessageSquare,
  Sparkles,
  AlertTriangle,
  Code2,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { soundFx } from '@/utils/soundEffects';

interface CinematicPlayerProps {
  onComplete: () => void;
  onSkip?: () => void;
  initialAutoplay?: boolean;
}

export function CinematicPlayer({
  onComplete,
  onSkip,
  initialAutoplay = true,
}: CinematicPlayerProps) {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(initialAutoplay);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [qualityPreset, setQualityPreset] = useState<'low' | 'medium' | 'high' | 'auto'>('auto');

  // Animation frame tracker
  const lastTimestampRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastSpokenShotRef = useRef<number | null>(null);

  // Active shot computation
  const activeShot: CinematicShot =
    CINEMATIC_SHOTS.find((s) => currentTime >= s.startTime && currentTime < s.endTime) ||
    CINEMATIC_SHOTS[CINEMATIC_SHOTS.length - 1];

  const currentAriaAnim: AriaAnimationState = activeShot?.ariaAnimation || 'idle';
  const currentReactorState: ReactorState = activeShot?.reactorState || 'critical';

  // Voice narration and sound effects per shot
  useEffect(() => {
    if (!isPlaying || isMuted) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    if (activeShot?.id !== lastSpokenShotRef.current) {
      lastSpokenShotRef.current = activeShot.id;

      if (activeShot?.dialogue && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();

        const speaker = activeShot.dialogue.speaker || '';
        const rawText = activeShot.dialogue.text || '';
        const cleanText = rawText.replace(/\([^)]*\)/g, '').trim();

        // Sound effects per narrative moment
        if (speaker.includes('ORPHEUS') || speaker.includes('SYSTEM')) {
          soundFx.playWarning();
        } else if (speaker.includes('ARIA')) {
          soundFx.playHover();
        }

        if (cleanText) {
          const utterance = new SpeechSynthesisUtterance(cleanText);
          const isSystem = speaker.includes('ORPHEUS') || speaker.includes('SYSTEM');

          utterance.rate = isSystem ? 0.95 : 1.05;
          utterance.pitch = isSystem ? 0.85 : 1.15;
          utterance.volume = 1.0;

          const voices = window.speechSynthesis.getVoices();
          const targetVoice = isSystem
            ? voices.find(
                (v) =>
                  v.lang.startsWith('en') &&
                  (v.name.includes('David') ||
                    v.name.includes('Male') ||
                    v.name.includes('Microsoft'))
              )
            : voices.find(
                (v) =>
                  v.lang.startsWith('en') &&
                  (v.name.includes('Female') ||
                    v.name.includes('Zira') ||
                    v.name.includes('Samantha') ||
                    v.name.includes('Google US English') ||
                    v.name.includes('Natural'))
              );

          if (targetVoice) {
            utterance.voice = targetVoice;
          }

          window.speechSynthesis.speak(utterance);
        }
      }
    }
  }, [activeShot?.id, isPlaying, isMuted, activeShot?.dialogue]);

  // Clean up any ongoing audio when player unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Deterministic tick loop
  useEffect(() => {
    if (!isPlaying) {
      lastTimestampRef.current = null;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const tick = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }
      const deltaSec = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      setCurrentTime((prev) => {
        const next = prev + deltaSec;
        if (next >= TOTAL_CINEMATIC_DURATION) {
          setIsPlaying(false);
          onComplete();
          return TOTAL_CINEMATIC_DURATION;
        }
        return next;
      });

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, onComplete]);

  // Controls Handlers
  const handleTogglePlay = useCallback(() => {
    soundFx.playClick();
    if (currentTime >= TOTAL_CINEMATIC_DURATION) {
      lastSpokenShotRef.current = null;
      setCurrentTime(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => {
        const next = !prev;
        if (!next && typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.pause();
        } else if (next && typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        return next;
      });
    }
  }, [currentTime]);

  const handleSkip = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    soundFx.playClick();
    setIsPlaying(false);
    setCurrentTime(TOTAL_CINEMATIC_DURATION);
    if (onSkip) {
      onSkip();
    } else {
      onComplete();
    }
  }, [onSkip, onComplete]);

  const handleReplay = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    soundFx.playClick();
    lastSpokenShotRef.current = null;
    setCurrentTime(0);
    setIsPlaying(true);
  }, []);

  const handleToggleMute = useCallback(() => {
    soundFx.playClick();
    setIsMuted((prev) => {
      const next = !prev;
      if (next && typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return next;
    });
  }, []);

  const handleToggleSubtitles = useCallback(() => {
    soundFx.playClick();
    setShowSubtitles((prev) => !prev);
  }, []);

  // Format seconds to mm:ss
  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progressPct = (currentTime / TOTAL_CINEMATIC_DURATION) * 100;

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-black">
      {/* 3D Real-Time World Viewport */}
      <WorldCanvas
        cinematicTime={currentTime}
        isCinematicPlaying={isPlaying}
        ariaAnimation={currentAriaAnim}
        reactorState={currentReactorState}
        qualityPreset={qualityPreset}
      />

      {/* Top Shot Title & Time Telemetry HUD */}
      <div className="absolute top-4 inset-x-4 md:inset-x-8 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-950/75 border border-slate-800/80 backdrop-blur-md pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest">
              Chapter 1: The Awakening
            </span>
            <span className="text-xs font-semibold text-white">
              Shot {activeShot.id}/6 — {activeShot.name}
            </span>
          </div>
        </div>

        {/* Quality Preset Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950/75 border border-slate-800/80 backdrop-blur-md pointer-events-auto text-xs">
          {(['low', 'medium', 'high', 'auto'] as const).map((q) => (
            <button
              key={q}
              onClick={() => setQualityPreset(q)}
              className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-mono transition-colors ${
                qualityPreset === q ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Center Mission Announcement Banner (Shot 6) */}
      {activeShot.missionPrompt && (
        <div className="absolute inset-x-6 top-1/3 -translate-y-1/2 z-20 flex flex-col items-center text-center animate-fadeIn pointer-events-none">
          <div className="px-6 py-4 rounded-2xl bg-slate-950/90 border border-cyan-500/50 backdrop-blur-xl shadow-2xl shadow-cyan-500/20 max-w-lg pointer-events-auto">
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[10px] font-mono font-bold tracking-widest uppercase">
              {activeShot.missionPrompt.title}
            </span>
            <h2 className="text-xl md:text-2xl font-black text-white mt-2 tracking-wide uppercase">
              {activeShot.missionPrompt.subtitle}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Initialize reactor stabilization protocols through the Python terminal.
            </p>
            <button
              onClick={handleSkip}
              className="mt-4 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 flex items-center gap-2 mx-auto transition-transform active:scale-95"
            >
              <Code2 className="w-4 h-4" />
              Open Reactor Terminal
            </button>
          </div>
        </div>
      )}

      {/* Subtitles Overlay Bar */}
      {showSubtitles && activeShot.dialogue && (
        <div className="absolute bottom-20 inset-x-4 md:inset-x-20 z-20 flex justify-center pointer-events-none">
          <div className="px-5 py-3 rounded-2xl bg-slate-950/85 border border-slate-700/60 backdrop-blur-xl max-w-2xl text-center shadow-2xl pointer-events-auto animate-fadeIn">
            <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{activeShot.dialogue.speaker}</span>
            </div>
            <p className="text-sm md:text-base text-white font-medium leading-relaxed">
              &ldquo;{activeShot.dialogue.text}&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* Bottom Cinematic Control Dock */}
      <div className="absolute bottom-4 inset-x-4 md:inset-x-12 z-20 flex flex-col gap-2 pointer-events-none">
        {/* Scrub Progress Bar */}
        <div
          className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden cursor-pointer pointer-events-auto relative group"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPct = (e.clientX - rect.left) / rect.width;
            setCurrentTime(clickPct * TOTAL_CINEMATIC_DURATION);
          }}
        >
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-500 transition-all duration-75"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Action Controls Row */}
        <div className="flex items-center justify-between px-4 py-2.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 backdrop-blur-xl pointer-events-auto text-xs text-slate-300">
          <div className="flex items-center gap-3">
            {/* Play/Pause Button */}
            <button
              onClick={handleTogglePlay}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md active:scale-95"
              title={isPlaying ? 'Pause Cinematic' : 'Play Cinematic'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            {/* Replay */}
            <button
              onClick={handleReplay}
              className="p-2 rounded-xl bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
              title="Replay from Beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Timestamp */}
            <span className="font-mono text-xs text-slate-400">
              {formatTime(currentTime)} / {formatTime(TOTAL_CINEMATIC_DURATION)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Subtitles Toggle */}
            <button
              onClick={handleToggleSubtitles}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                showSubtitles
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-800/50 text-slate-400 border-slate-700/60'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>CC</span>
            </button>

            {/* Sound FX Mute Toggle */}
            <button
              onClick={handleToggleMute}
              className={`p-2 rounded-xl border transition-all ${
                isMuted
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-slate-800/50 text-slate-300 border-slate-700/60 hover:text-white'
              }`}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Skip Cinematic Button */}
            <button
              onClick={handleSkip}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-white font-medium text-xs transition-all active:scale-95 ml-1"
            >
              <span>Skip Intro</span>
              <FastForward className="w-3.5 h-3.5 text-indigo-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
