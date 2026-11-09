'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Play,
  Sparkles,
  Cpu,
  Volume2,
  Terminal,
  ShieldCheck,
  ChevronRight,
  Flame,
  Compass,
} from 'lucide-react';
import { Button, Card, Badge } from '@codequest/ui';
import { StationBridgeScene } from '@/components/3d/StationBridgeScene';
import { CinematicBootLoader } from '@/components/auth/CinematicBootLoader';
import { AuthPortal } from '@/components/auth/AuthPortal';
import { useStore } from '@/store/useStore';

export default function LandingPage() {
  const [bootState, setBootState] = useState<'loading' | 'auth' | 'ready'>('loading');
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);
  const isAuthenticated = useStore((s) => s.isAuthenticated);

  useEffect(() => {
    // Check if user has an existing saved session
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('codequest_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setBootState('ready');
          return;
        } catch {
          // ignore
        }
      }
      setBootState('auth');
    }
  }, [setUser]);

  const handleBootComplete = () => {
    if (isAuthenticated) {
      setBootState('ready');
    } else {
      setBootState('auth');
    }
  };

  const handleAuthSuccess = () => {
    setBootState('ready');
  };

  // 1. If not authenticated or on auth screen, ONLY render the login page
  if (bootState === 'auth' || !isAuthenticated) {
    return <AuthPortal onSuccess={handleAuthSuccess} />;
  }

  // 2. Animated Cinematic Loading Screen (if explicitly booting)
  if (bootState === 'loading') {
    return <CinematicBootLoader onComplete={handleBootComplete} />;
  }

  // 3. Authenticated Landing Page & Interactive 3D Experience
  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      {/* Hero Section with Live 3D Scene Viewport */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-slate-800">
        {/* Background 3D Canvas */}
        <div className="absolute inset-0 z-0 opacity-80 pointer-events-auto">
          <StationBridgeScene />
        </div>

        {/* Ambient Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-vignette pointer-events-none z-10" />

        {/* Hero Copy & CTA */}
        <div className="relative z-20 max-w-5xl mx-auto px-6 py-20 text-center flex flex-col items-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cinematic 3D Interactive Programming</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-none">
            WRITE REAL CODE.
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
              CHANGE THE STORY.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed">
            Step aboard Orbital Station Aethelgard. Meet ARIA. Diagnose failing reactors, think
            critically, write real Python programs, and witness your code transform 3D worlds in
            real time.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <Link href="/play">
              <Button variant="glow-cyan" size="lg" className="flex items-center gap-2 group px-8">
                <Play className="w-5 h-5 fill-current text-cyan-300 group-hover:scale-110 transition-transform" />
                <span className="font-bold">Enter The Last Protocol</span>
              </Button>
            </Link>

            <Link href="/explorer">
              <Button variant="secondary" size="lg" className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-slate-300" />
                <span>Explore Worlds</span>
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-6 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Real Python Execution
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              Edge-TTS Voice Acting
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              Monaco Code Studio
            </span>
          </div>
        </div>
      </section>

      {/* Core Philosophy Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="amber" className="mb-3">
            Pedagogical Engine
          </Badge>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-100">
            Engineered for Deep Retention, Not Rote Typing
          </h2>
          <p className="mt-4 text-slate-400 text-sm md:text-base leading-relaxed">
            CODEQUEST rejects conventional multiple-choice LMS templates. Every mission binds
            logical computational reasoning with narrative consequence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 border-cyan-500/30 hover:border-cyan-400/60 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Think Before You Code</h3>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Before opening Monaco editor, analyze output streams, predict outcomes, and eliminate
              conceptual misfires before writing a line of code.
            </p>
          </Card>

          <Card className="p-6 border-indigo-500/30 hover:border-indigo-400/60 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Isolated Deterministic Sandbox</h3>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              User submissions execute inside protected isolated workers with memory boundaries,
              strict execution timeouts, and comprehensive hidden test suites.
            </p>
          </Card>

          <Card className="p-6 border-emerald-500/30 hover:border-emerald-400/60 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Volume2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Real Character Voice Synthesis</h3>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed">
              Meet ARIA and fellow companions powered by a dedicated Edge-TTS voice generation
              microservice with synchronized subtitles and lip-sync waveforms.
            </p>
          </Card>
        </div>
      </section>

      {/* Featured Campaign Showcase */}
      <section className="py-16 bg-slate-900/40 border-t border-slate-800 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                Featured Adventure
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100">
                The Last Protocol — Chapter 1
              </h2>
            </div>

            <Link href="/explorer">
              <span className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1">
                <span>View All 4 Campaigns</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          </div>

          <Card className="p-8 border-cyan-500/30 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="cyan">Python Foundations</Badge>
                  <Badge variant="emerald">Beginner Friendly</Badge>
                  <span className="text-xs text-slate-400">~3.5 Hours</span>
                </div>

                <h3 className="text-2xl font-bold text-white">
                  Reboot Orbital Station Aethelgard
                </h3>

                <p className="text-slate-300 text-sm leading-relaxed">
                  The primary reactor has collapsed. ARIA is trapped in auxiliary containment. Use
                  Python standard output, variables, conditionals, and functions to bypass emergency
                  lockdowns and stabilize the life support matrix.
                </p>

                <div className="pt-2">
                  <Link href="/play">
                    <Button variant="glow-cyan" size="md" className="flex items-center gap-2">
                      <Play className="w-4 h-4 fill-current" />
                      <span>Start Chapter 1 Vertical Slice</span>
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="h-64 rounded-xl border border-slate-700 bg-slate-950 overflow-hidden relative">
                <StationBridgeScene />
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
