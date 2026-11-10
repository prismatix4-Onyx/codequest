'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Sparkles,
  Terminal,
  Code2,
  Lock,
  ArrowRight,
  CheckCircle2,
  Filter,
  X,
  Play,
  Flame,
  Globe2,
} from 'lucide-react';
import { soundFx } from '@/utils/soundEffects';

interface LanguageOption {
  id: string;
  name: string;
  version: string;
  tagline: string;
  worldName: string;
  description: string;
  status: 'available' | 'coming_soon';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  bannerGradient: string;
  badgeColor: string;
}

const LANGUAGES: LanguageOption[] = [
  {
    id: 'python',
    name: 'Python',
    version: '3.12 (Active Core)',
    tagline: 'The Last Protocol: Orbital Station Aethelgard',
    worldName: 'Orbital Station Aethelgard',
    description:
      'Awaken aboard a drifting orbital research station. Partner with ARIA, diagnose failing reactor containment, and write authentic Python scripts to restore the neural telemetry stream.',
    status: 'available',
    difficulty: 'Beginner',
    tags: ['Scripting', 'Variables', 'OOP', 'AI Diagnostics', 'Conditionals'],
    bannerGradient: 'from-indigo-600 via-blue-600 to-violet-700',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  },
  {
    id: 'typescript',
    name: 'TypeScript & JavaScript',
    version: 'ES2024 (In Forge)',
    tagline: 'Neon Syndicate: Cyberpunk Sub-Grid',
    worldName: 'Neo-Kowloon Grid',
    description:
      'Navigate neon-drenched subterranean server banks. Master async streams, type contracts, and event loops to outmaneuver corporate security proxies.',
    status: 'coming_soon',
    difficulty: 'Intermediate',
    tags: ['Web', 'Async', 'Type Systems', 'Events'],
    bannerGradient: 'from-sky-600 to-cyan-700',
    badgeColor: 'bg-slate-500/10 text-slate-500 border-slate-500/30',
  },
  {
    id: 'rust',
    name: 'Rust',
    version: '1.80 (In Forge)',
    tagline: 'Sub-Orbital Kernels: Zero-Cost Citadel',
    worldName: 'Deep Forge Void Complex',
    description:
      'Reconstruct low-level orbital thrusters and memory buffers without a garbage collector. Conquer the borrow checker to save deep space transports.',
    status: 'coming_soon',
    difficulty: 'Advanced',
    tags: ['Systems', 'Borrow Checker', 'Concurrency', 'Safety'],
    bannerGradient: 'from-amber-600 to-orange-700',
    badgeColor: 'bg-slate-500/10 text-slate-500 border-slate-500/30',
  },
  {
    id: 'cpp',
    name: 'C++',
    version: 'C++23 (In Forge)',
    tagline: 'Quantum Engine: Low-Level Odyssey',
    worldName: 'Aethelgard Core Reactor',
    description:
      'Dive into memory-mapped I/O, manual pointer arithmetic, and SIMD parallel vector units inside the primary singularity drive.',
    status: 'coming_soon',
    difficulty: 'Advanced',
    tags: ['Systems', 'Pointers', 'Performance', 'Hardware'],
    bannerGradient: 'from-blue-700 to-indigo-800',
    badgeColor: 'bg-slate-500/10 text-slate-500 border-slate-500/30',
  },
];

interface WorldLanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WorldLanguageModal({ isOpen, onClose }: WorldLanguageModalProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'coming_soon'>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('python');

  if (!isOpen) return null;

  const filteredLanguages = LANGUAGES.filter((lang) => {
    const matchesSearch =
      lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter = statusFilter === 'all' || lang.status === statusFilter;

    return matchesSearch && matchesFilter;
  });

  const handleEnterWorld = (langId: string) => {
    soundFx.playClick();
    if (langId === 'python') {
      soundFx.playSuccess();
      router.push('/play');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/25 text-white">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Select Your Adventure Language
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Choose a programming world to initialize your interactive story campaign
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Filter Options */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by language, world, or concept (e.g. Python, OOP, Loops)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 self-start sm:self-auto shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
            <button
              onClick={() => {
                soundFx.playTabSwitch();
                setStatusFilter('all');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              All Worlds
            </button>
            <button
              onClick={() => {
                soundFx.playTabSwitch();
                setStatusFilter('available');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                statusFilter === 'available'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              Available Now (Python)
            </button>
            <button
              onClick={() => {
                soundFx.playTabSwitch();
                setStatusFilter('coming_soon');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                statusFilter === 'coming_soon'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              In Forge
            </button>
          </div>
        </div>

        {/* Language Grid */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {filteredLanguages.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Code2 className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
              <p className="text-sm font-medium">No worlds found matching your criteria</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="mt-2 text-xs text-indigo-500 hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredLanguages.map((lang) => {
              const isAvailable = lang.status === 'available';
              const isSelected = selectedLanguage === lang.id;

              return (
                <div
                  key={lang.id}
                  onClick={() => {
                    if (isAvailable) {
                      soundFx.playClick();
                      setSelectedLanguage(lang.id);
                    }
                  }}
                  className={`relative p-5 rounded-2xl border transition-all duration-200 ${
                    isAvailable
                      ? isSelected
                        ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-lg shadow-indigo-500/10'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-indigo-300 dark:hover:border-slate-700 cursor-pointer'
                      : 'border-slate-200 dark:border-slate-800/60 bg-slate-50/60 dark:bg-slate-950/40 opacity-70 cursor-not-allowed'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left Info */}
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Code2 className="w-5 h-5 text-indigo-500" />
                          {lang.name}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">({lang.version})</span>

                        {isAvailable ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            AVAILABLE NOW
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            COMING SOON
                          </span>
                        )}
                        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                          {lang.difficulty}
                        </span>
                      </div>

                      <h4 className="text-sm font-semibold text-indigo-600 dark:text-indigo-300">
                        {lang.tagline}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                        {lang.description}
                      </p>

                      {/* Tag badges */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {lang.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right CTA */}
                    <div className="flex items-center shrink-0">
                      {isAvailable ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEnterWorld(lang.id);
                          }}
                          className="w-full md:w-auto px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:to-violet-500 shadow-md shadow-indigo-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          <span>Enter Game Environment</span>
                        </button>
                      ) : (
                        <div className="text-xs text-slate-400 italic flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800/50">
                          <Lock className="w-3.5 h-3.5" />
                          <span>World In Development</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Interactive Python 3.12 Sandboxed World • Full 3D Station Environment</span>
          </div>
          <span className="font-mono text-[11px]">1 of 4 Worlds Active</span>
        </div>
      </div>
    </div>
  );
}
