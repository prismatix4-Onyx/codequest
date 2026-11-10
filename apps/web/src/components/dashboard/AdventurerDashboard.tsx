'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Play,
  Sparkles,
  Terminal,
  BookOpen,
  Compass,
  Award,
  Zap,
  ArrowRight,
  Flame,
  ShieldCheck,
  Code2,
  Cpu,
  Layers,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { WorldLanguageModal } from './WorldLanguageModal';
import { soundFx } from '@/utils/soundEffects';

export function AdventurerDashboard() {
  const user = useStore((s) => s.user);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-fadeIn">
      {/* 1. Adventurer Status Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-slate-900/40 border border-slate-200 dark:border-slate-800 backdrop-blur-xl shadow-xl">
        <div className="space-y-1.5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Adventurer Command Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Greetings, {user.username}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
            Your orbital telemetry is active. Step aboard Station Aethelgard, solve cinematic programming challenges, and guide the animated story with real code.
          </p>
        </div>

        {/* User Stats Card */}
        <div className="flex items-center gap-3 sm:gap-4 bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-sm shrink-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-md font-bold text-lg">
            {user.level}
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>Adventurer Level</span>
              <span className="text-amber-500 font-bold">•</span>
              <span className="text-amber-500 font-bold">{user.xp} XP</span>
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              Systems Cadet
            </div>
            {/* XP Progress Bar */}
            <div className="w-28 sm:w-36 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-indigo-500 rounded-full"
                style={{ width: `${Math.min(100, (user.xp % 250) / 2.5)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Hero Action: ENTER THE WORLD Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-indigo-500/30 bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-950 p-7 sm:p-10 shadow-2xl text-white flex flex-col md:flex-row items-center justify-between gap-8 group">
        {/* Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-violet-600/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Python World Ready</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Ready to Enter the World?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Launch directly into Orbital Station Aethelgard. Work alongside ARIA, diagnose the malfunctioning reactor with real Python scripts, and steer the unfolding narrative.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4">
            <button
              onClick={() => {
                soundFx.playClick();
                setIsLanguageModalOpen(true);
              }}
              onMouseEnter={() => soundFx.playHover()}
              className="px-7 py-3.5 rounded-2xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:to-violet-500 shadow-xl shadow-indigo-500/30 active:scale-[0.99] transition-all flex items-center gap-2.5 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Enter the World</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>

            <Link
              href="/curriculum"
              onMouseEnter={() => soundFx.playHover()}
              className="px-5 py-3.5 rounded-2xl font-semibold text-xs sm:text-sm text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-all flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Review Curriculum</span>
            </Link>
          </div>
        </div>

        {/* 3D World Card Preview Mockup */}
        <div className="relative z-10 w-full md:w-80 rounded-2xl overflow-hidden border border-white/15 bg-slate-900/90 shadow-2xl p-4 flex flex-col gap-3 group-hover:border-indigo-400/50 transition-colors">
          <div className="relative h-36 rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent z-10" />
            <div className="text-center p-3 relative z-20">
              <span className="text-[10px] font-mono text-cyan-400 tracking-wider uppercase block">
                3D WebGL Simulation
              </span>
              <span className="text-sm font-bold text-white block mt-0.5">
                Station Aethelgard
              </span>
            </div>
            {/* Spinning decorative orbit ring */}
            <div className="absolute w-28 h-28 rounded-full border border-indigo-500/30 border-dashed animate-spin [animation-duration:15s]" />
          </div>

          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex justify-between text-slate-400">
              <span>Active Language</span>
              <span className="font-semibold text-white">Python 3.12</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Chapter</span>
              <span className="font-semibold text-white">Chapter 1: The Cold Awakening</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Diagnostic Status</span>
              <span className="font-semibold text-rose-400">Containment Alert</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Python Curriculum */}
        <Link
          href="/curriculum"
          onMouseEnter={() => soundFx.playHover()}
          className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-xl transition-all duration-200 group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Python Curriculum Tree
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              4 mastery stages covering Foundations, Logic, Functions, Data Structures, and OOP. Learn before tackling story missions.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <span>Explore Curriculum</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 2: World Explorer */}
        <Link
          href="/explorer"
          onMouseEnter={() => soundFx.playHover()}
          className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-xl transition-all duration-200 group flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              Orbital World Explorer
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Inspect Station Aethelgard sectors, inspect telemetry nodes, and review story lore archives across Earth orbit.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-purple-600 dark:text-purple-400">
            <span>Open Explorer</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 3: Code Studio Sandbox */}
        <div
          onClick={() => {
            soundFx.playClick();
            setIsLanguageModalOpen(true);
          }}
          onMouseEnter={() => soundFx.playHover()}
          className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-xl transition-all duration-200 group flex flex-col justify-between cursor-pointer"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Interactive Story Studio
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Write real Python programs in our Monaco code environment, execute in isolated browser sandboxes, and observe 3D world reactions.
            </p>
          </div>
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span>Launch Story World</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* World Language Selector Modal */}
      <WorldLanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
      />
    </div>
  );
}
