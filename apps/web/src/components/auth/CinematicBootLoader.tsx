'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Terminal, Radio, Shield, Sparkles, ChevronRight } from 'lucide-react';

interface CinematicBootLoaderProps {
  onComplete: () => void;
}

const BOOT_LOGS = [
  'INITIALIZING QUANTUM COMPILER (PYTHON 3.12 KERNEL)...',
  'ESTABLISHING TELEMETRY LINK TO ORBITAL STATION AETHELGARD...',
  'CALIBRATING ARIA NEURAL DIALOGUE CORE...',
  'SYNCHRONIZING EDGE-TTS ACOUSTIC BUFFER...',
  'MOUNTING SANDBOX SUBPROCESS EXECUTION MATRIX...',
  'STATION INTERFACE READY. SYSTEM NOMINAL.',
];

export function CinematicBootLoader({ onComplete }: CinematicBootLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [logIndex, setLogIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(), 400);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 8) + 3;
        return next > 100 ? 100 : next;
      });
    }, 90);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    const idx = Math.min(
      Math.floor((progress / 100) * BOOT_LOGS.length),
      BOOT_LOGS.length - 1
    );
    setLogIndex(idx);
  }, [progress]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-slate-100 select-none overflow-hidden px-4"
    >
      {/* Background Matrix Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/20 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Center Holographic Logo Unit */}
      <div className="relative z-10 flex flex-col items-center max-w-lg w-full text-center">
        {/* Pulsing Orbital Ring Logo */}
        <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
            className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/40 shadow-[0_0_30px_rgba(6,182,212,0.3)]"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
            className="absolute inset-2 rounded-full border border-indigo-500/50"
          />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.7)]">
            <Cpu className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-black tracking-widest text-white mb-2 font-mono">
          CODEQUEST
          <span className="text-cyan-400 text-sm ml-2 font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-400/30">
            v2.0
          </span>
        </h1>
        <p className="text-xs text-slate-400 uppercase tracking-widest font-mono mb-8">
          Cinematic 3D Interactive Programming
        </p>

        {/* Progress Bar Container */}
        <div className="w-full bg-slate-900 border border-slate-800 rounded-full h-3 p-0.5 overflow-hidden shadow-inner mb-4">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.8)]"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.2 }}
          />
        </div>

        {/* Status Percentage & Diagnostics Row */}
        <div className="w-full flex items-center justify-between text-xs font-mono text-slate-400 mb-6">
          <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>NEURAL SYNC</span>
          </span>
          <span className="text-cyan-300 font-black text-sm">{progress}%</span>
        </div>

        {/* Live Terminal Diagnostic Stream */}
        <div className="w-full h-12 flex items-center justify-center p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] font-mono text-slate-300 text-center">
          <Terminal className="w-3.5 h-3.5 text-cyan-400 shrink-0 mr-2" />
          <span className="truncate">{BOOT_LOGS[logIndex]}</span>
        </div>

        {/* Skip Button */}
        <button
          onClick={onComplete}
          className="mt-8 text-xs font-mono text-slate-500 hover:text-cyan-400 flex items-center gap-1 transition-colors"
        >
          <span>Skip Initialization</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}
