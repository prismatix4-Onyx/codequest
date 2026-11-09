'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, CheckCircle2, ChevronRight, Code2, Sparkles, Award } from 'lucide-react';
import { Card, Badge, Button } from '@codequest/ui';
import { PYTHON_CURRICULUM } from '@codequest/python-curriculum';

export default function CurriculumPage() {
  const [selectedConceptId, setSelectedConceptId] = useState<string>(PYTHON_CURRICULUM[0].id);

  const selectedConcept =
    PYTHON_CURRICULUM.find((c) => c.id === selectedConceptId) || PYTHON_CURRICULUM[0];

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" />
          <span>Curriculum Mastery Engine</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100">
          Python Programming Curriculum
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Structured across 4 mastery stages: Foundations, Control & Modularization, Data
          Structures & OOP, and Algorithms. Progress through story missions to prove mastery.
        </p>
      </div>

      {/* Main Layout: Left Modules Navigation, Right Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Concept List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {[1, 2, 3, 4].map((stageNum) => {
            const stageModules = PYTHON_CURRICULUM.filter((c) => c.stage === stageNum);
            const stageTitles: Record<number, string> = {
              1: 'Stage 1: Programming Foundations',
              2: 'Stage 2: Control & Modularization',
              3: 'Stage 3: Data Structures & OOP',
              4: 'Stage 4: Algorithms & Problem Solving',
            };

            return (
              <div key={stageNum} className="space-y-2">
                <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider px-1 pt-2">
                  {stageTitles[stageNum]}
                </div>

                {stageModules.map((concept) => {
                  const isSelected = concept.id === selectedConceptId;

                  return (
                    <button
                      key={concept.id}
                      onClick={() => setSelectedConceptId(concept.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                        isSelected
                          ? 'bg-cyan-950/40 border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-7 h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center ${
                            isSelected
                              ? 'bg-cyan-500 text-slate-950'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {concept.moduleOrder}
                        </div>
                        <div>
                          <div
                            className={`text-xs md:text-sm font-semibold transition-colors ${
                              isSelected
                                ? 'text-cyan-300'
                                : 'text-slate-200 group-hover:text-white'
                            }`}
                          >
                            {concept.title}
                          </div>
                        </div>
                      </div>

                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          isSelected ? 'text-cyan-400 translate-x-1' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Concept Detail View (7 cols) */}
        <div className="lg:col-span-7">
          <Card className="p-6 md:p-8 border-cyan-500/30 bg-slate-900/90 space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="cyan">Stage {selectedConcept.stage}</Badge>
                <Badge variant="slate">Module {selectedConcept.moduleOrder}</Badge>
              </div>
              <h2 className="text-2xl font-bold text-slate-100">{selectedConcept.title}</h2>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                {selectedConcept.summary}
              </p>
            </div>

            {/* Learning Objectives */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                Learning Objectives
              </h3>
              <div className="space-y-2">
                {selectedConcept.objectives.map((obj, i) => (
                  <div key={i} className="flex items-start space-x-2 text-xs md:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Code Examples */}
            {selectedConcept.examples.map((ex, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <Code2 className="w-4 h-4" />
                  <span>Interactive Code Example: {ex.title}</span>
                </div>
                <div className="rounded-xl border border-slate-800 bg-black/80 p-4 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
                  <pre>{ex.code}</pre>
                </div>
                <p className="text-xs text-slate-400 italic">{ex.explanation}</p>
              </div>
            ))}

            {/* Story Mission Integration */}
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-cyan-300">Associated Story Campaign</div>
                <div className="text-xs text-slate-400">
                  {selectedConcept.stage === 1
                    ? 'The Last Protocol — Chapter 1'
                    : 'The Forgotten Kingdom / Beyond the Signal'}
                </div>
              </div>
              <Link href="/play">
                <Button variant="glow-cyan" size="sm">
                  Practice In Mission
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
