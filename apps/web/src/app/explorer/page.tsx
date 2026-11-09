'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, Play, Lock, CheckCircle, Clock, Zap, BookOpen } from 'lucide-react';
import { Card, Button, Badge } from '@codequest/ui';

interface CampaignCardItem {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  hours: number;
  isUnlocked: boolean;
  isCompleted?: boolean;
  coverGradient: string;
}

const CAMPAIGNS: CampaignCardItem[] = [
  {
    id: 'campaign-last-protocol',
    slug: 'last-protocol',
    title: 'The Last Protocol',
    tagline: 'Reboot the forgotten orbital station before atmospheric containment collapses.',
    description:
      'High in Earth orbit, Station Aethelgard has gone dark. Partner with ARIA, the station AI guardian, to diagnose reactors, write Python subroutines, and restore planetary telemetry.',
    difficulty: 'beginner',
    language: 'Python',
    hours: 3.5,
    isUnlocked: true,
    coverGradient: 'from-cyan-900/60 via-slate-900 to-slate-950',
  },
  {
    id: 'campaign-forgotten-kingdom',
    slug: 'forgotten-kingdom',
    title: 'The Forgotten Kingdom',
    tagline: 'Unearth ancient clockwork algorithms and master OOP to save a digital realm.',
    description:
      'Explore subterranean clockwork citadels. Harness Python classes, inheritance, and dictionary registries to awaken long-dormant automatons and decode mechanical archives.',
    difficulty: 'intermediate',
    language: 'Python',
    hours: 5.0,
    isUnlocked: true,
    coverGradient: 'from-amber-900/60 via-slate-900 to-slate-950',
  },
  {
    id: 'campaign-beyond-the-signal',
    slug: 'beyond-the-signal',
    title: 'Beyond the Signal',
    tagline: 'Intercept deep-space transmissions using exception handling and stream processing.',
    description:
      'Deep space listening posts have picked up anomalous radio harmonics. Build resilient data pipelines using Python file streams, custom exception handlers, and recursive decryptors.',
    difficulty: 'intermediate',
    language: 'Python',
    hours: 6.0,
    isUnlocked: false,
    coverGradient: 'from-indigo-900/60 via-slate-900 to-slate-950',
  },
  {
    id: 'campaign-silent-witness',
    slug: 'silent-witness',
    title: 'The Silent Witness',
    tagline: 'Cyber-forensic investigation utilizing advanced data structures and graph traversal.',
    description:
      'A planetary power grid blackout was not an accident. Investigate transaction ledgers, reconstruct memory dumps, and traverse execution graphs with advanced algorithmic structures.',
    difficulty: 'advanced',
    language: 'Python',
    hours: 8.0,
    isUnlocked: false,
    coverGradient: 'from-rose-900/60 via-slate-900 to-slate-950',
  },
];

export default function ExplorerPage() {
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');

  const filtered = CAMPAIGNS.filter(
    (c) => filterDifficulty === 'all' || c.difficulty === filterDifficulty
  );

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>Story Universe Navigation</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100">World Explorer</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Choose a narrative campaign. Each world features unique characters, dynamic 3D
            environments, voice acting, and real Python challenges.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center space-x-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setFilterDifficulty(diff)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                filterDifficulty === diff
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Campaign Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((camp) => (
          <Card
            key={camp.id}
            className={`p-6 border-slate-800 bg-gradient-to-br ${camp.coverGradient} flex flex-col justify-between hover:border-cyan-500/40 transition-all group`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Badge variant={camp.difficulty === 'beginner' ? 'emerald' : camp.difficulty === 'intermediate' ? 'cyan' : 'rose'}>
                    {camp.difficulty}
                  </Badge>
                  <Badge variant="slate">{camp.language}</Badge>
                </div>

                <div className="flex items-center space-x-1 text-xs text-slate-400 font-mono">
                  <Clock className="w-3.5 h-3.5" />
                  <span>~{camp.hours} hrs</span>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-slate-100 group-hover:text-cyan-300 transition-colors mb-2">
                {camp.title}
              </h3>

              <p className="text-xs md:text-sm text-cyan-300/80 font-medium mb-3">
                {camp.tagline}
              </p>

              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                {camp.description}
              </p>
            </div>

            <div className="pt-6 border-t border-slate-800/80 mt-6 flex items-center justify-between">
              {camp.isUnlocked ? (
                <Link href={camp.slug === 'last-protocol' ? '/play' : '#'}>
                  <Button variant="glow-cyan" size="sm" className="flex items-center gap-1.5">
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Enter Campaign</span>
                  </Button>
                </Link>
              ) : (
                <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-mono">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Prerequisite: Complete Stage 1</span>
                </div>
              )}

              <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>+500 XP</span>
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
