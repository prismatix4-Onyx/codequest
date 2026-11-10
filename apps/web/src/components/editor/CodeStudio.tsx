'use client';

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Terminal,
  FileCode2,
  Zap,
  Minimize2,
  Maximize2,
  Lock,
} from 'lucide-react';
import { Button, Card, Badge } from '@codequest/ui';
import { useStore } from '@/store/useStore';
import { soundFx } from '@/utils/soundEffects';

export function CodeStudio() {
  const activeMission = useStore((s) => s.activeMission);
  const code = useStore((s) => s.code);
  const setCode = useStore((s) => s.setCode);
  const resetCode = useStore((s) => s.resetCode);
  const isExecuting = useStore((s) => s.isExecuting);
  const executionResult = useStore((s) => s.executionResult);
  const runCodeSubmission = useStore((s) => s.runCodeSubmission);
  const runCodeOnly = useStore((s) => s.runCodeOnly);
  const isEditorOpen = useStore((s) => s.isEditorOpen);
  const closeMission = useStore((s) => s.closeMission);
  const useHint = useStore((s) => s.useHint);

  const [activeTab, setActiveTab] = useState<'editor' | 'story' | 'tests' | 'hints'>('editor');
  const [unlockedHintLevel, setUnlockedHintLevel] = useState<number>(0);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);

  if (!isEditorOpen || !activeMission) return null;

  const handleUnlockHint = () => {
    if (unlockedHintLevel < activeMission.hints.length) {
      setUnlockedHintLevel((prev) => prev + 1);
      useHint();
    }
  };

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 bg-slate-950/95 border-t border-cyan-500/30 transition-all duration-300 flex flex-col shadow-2xl backdrop-blur-2xl ${
        isMaximized ? 'top-0 h-full' : 'h-[65vh] md:h-[60vh]'
      }`}
    >
      {/* Top Studio Control Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs md:text-sm font-semibold">
            <FileCode2 className="w-4 h-4" />
            <span>MISSION: {activeMission.title}</span>
          </div>
          <Badge variant="cyan" className="hidden sm:inline-flex">
            Python 3.12
          </Badge>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetCode}
            title="Reset Starter Code"
            className="flex items-center gap-1 text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1.5 text-slate-400 hover:text-white"
          >
            {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>

          {/* 1. Run Code (Local Execution Sandbox Test) */}
          <Button
            variant="secondary"
            size="sm"
            isLoading={isExecuting}
            disabled={isExecuting}
            onClick={async () => {
              soundFx.playClick();
              await runCodeOnly();
            }}
            className="flex items-center gap-1.5 px-3 border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200"
            title="Run Code in Python Sandbox (Tests Execution Without Submitting)"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Run Code</span>
          </Button>

          {/* 2. Submit Solution (Trusted Evaluation against all test cases) */}
          <Button
            variant="glow-cyan"
            size="sm"
            isLoading={isExecuting}
            disabled={isExecuting}
            onClick={async () => {
              soundFx.playClick();
              await runCodeSubmission();
              const latest = useStore.getState().executionResult;
              if (latest?.allPassed) {
                soundFx.playSuccess();
              } else {
                soundFx.playError();
              }
            }}
            className="flex items-center gap-1.5 px-4 font-bold"
            title="Submit Solution to Trusted Evaluator to Stabilize Reactor"
          >
            <Zap className="w-4 h-4 fill-current text-cyan-300" />
            <span>Submit Protocol</span>
          </Button>
        </div>
      </div>

      {/* Main Studio Body: Grid Layout on Desktop, Tabs on Mobile */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Column: Story Context & Mission Objectives (3 cols) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col border-r border-slate-800 bg-slate-900/40 p-4 overflow-y-auto space-y-4">
          <div>
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
              Station Story Context
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {activeMission.storyContext}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5">
              Target Objective
            </h4>
            <pre className="text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
              {activeMission.objective}
            </pre>
          </div>

          {/* Progressive Hints Section */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                Progressive Hints
              </span>
              {unlockedHintLevel < activeMission.hints.length && (
                <button
                  onClick={handleUnlockHint}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  Unlock Level {unlockedHintLevel + 1}
                </button>
              )}
            </div>

            {unlockedHintLevel === 0 ? (
              <div className="text-xs text-slate-500 italic p-2 rounded bg-slate-900/60 border border-slate-800">
                Independent problem solving yields maximum mastery. Unlock hints if needed.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {activeMission.hints.slice(0, unlockedHintLevel).map((h) => (
                  <div
                    key={h.level}
                    className="p-2.5 rounded-lg bg-slate-800/90 border border-amber-500/30 text-xs"
                  >
                    <div className="font-bold text-amber-300 mb-1">
                      Hint Level {h.level}: {h.title}
                    </div>
                    <pre className="text-slate-200 font-mono whitespace-pre-wrap">{h.content}</pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center Column: Monaco Python Editor (6 cols) */}
        <div className="col-span-1 lg:col-span-6 flex flex-col bg-[#1e1e1e] overflow-hidden">
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="python"
              theme="vs-dark"
              value={code}
              onChange={(val) => setCode(val || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: 'JetBrains Mono, Fira Code, monospace',
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                wordWrap: 'on',
              }}
            />
          </div>
        </div>

        {/* Right Column: Execution Output & Test Results (3 cols) */}
        <div className="col-span-1 lg:col-span-3 flex flex-col border-l border-slate-800 bg-slate-900/60 p-4 overflow-y-auto space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-300 uppercase">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Terminal & Verification</span>
            </div>
            {executionResult && (
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded ${
                  executionResult.allPassed
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {executionResult.allPassed ? 'ALL PASSED' : 'CHECK FAILED'}
              </span>
            )}
          </div>

          {/* Test Cases List */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-400">Deterministic Test Suite:</div>
            {activeMission.testCases.map((tc, idx) => {
              const runResult = executionResult?.testResults.find((r) => r.testId === tc.id);
              const passed = runResult?.passed;

              return (
                <div
                  key={tc.id}
                  className={`p-2.5 rounded-lg border text-xs transition-colors ${
                    runResult
                      ? passed
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                        : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                      : 'bg-slate-800/40 border-slate-700/60 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold">
                      Test {idx + 1}: {tc.description}
                    </span>
                    {runResult ? (
                      passed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      )
                    ) : tc.isHidden ? (
                      <Lock className="w-3 h-3 text-slate-500" />
                    ) : null}
                  </div>
                  {!tc.isHidden && (
                    <div className="font-mono text-[11px] text-slate-300 bg-slate-900/80 p-1.5 rounded mt-1 overflow-x-auto">
                      Expected: {tc.expectedOutput}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Console Standard Output & Execution Stream */}
          <div className="flex-1 flex flex-col min-h-[9rem] bg-black/80 rounded-xl p-3 border border-slate-800 font-mono text-xs">
            <div className="flex items-center justify-between text-slate-500 mb-1.5 border-b border-slate-800 pb-1.5">
              <span>Interactive Python Stream</span>
              <span className="text-[10px] text-slate-600">CPython 3.12</span>
            </div>

            {executionResult ? (
              <div className="space-y-1 overflow-y-auto flex-1">
                <div className="text-slate-400 text-[11px]">&gt;&gt;&gt; python mission_script.py</div>
                {executionResult.stdout && (
                  <pre className="text-cyan-300 whitespace-pre-wrap leading-relaxed">
                    {executionResult.stdout}
                  </pre>
                )}
                {executionResult.stderr && (
                  <pre className="text-rose-400 whitespace-pre-wrap leading-relaxed border-t border-rose-900/40 pt-1">
                    {executionResult.stderr}
                  </pre>
                )}
                <div className={`text-[11px] pt-1 border-t border-slate-800/80 ${executionResult.allPassed ? 'text-emerald-400 font-bold' : 'text-amber-400'}`}>
                  [STATUS] Process exited with code {executionResult.allPassed ? '0 (SUCCESS)' : '1 (REPAIR_REQUIRED)'}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-600 italic">
                Awaiting program execution... Press &quot;Run Program&quot; to test your code.
              </div>
            )}
          </div>

          {/* Feedback & Transfer Advice */}
          {executionResult?.feedback && (
            <div className="p-2.5 rounded-lg bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-200">
              <div className="font-bold text-cyan-300 mb-0.5">ARIA Feedback:</div>
              <div>{executionResult.feedback}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
