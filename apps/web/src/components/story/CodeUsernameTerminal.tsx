'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Play, CheckCircle2, Sparkles, ArrowRight, CornerDownLeft, Shield } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { soundFx } from '@/utils/soundEffects';

interface CodeUsernameTerminalProps {
  isOpen: boolean;
  onComplete: (username: string) => void;
}

export function CodeUsernameTerminal({ isOpen, onComplete }: CodeUsernameTerminalProps) {
  const user = useStore((s) => s.user);
  const setUser = useStore((s) => s.setUser);

  const [inputVal, setInputVal] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionOutput, setExecutionOutput] = useState<string[] | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleExecute = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed || isExecuting) return;

    soundFx.playClick();
    setIsExecuting(true);

    // Simulated authentic Python interpreter script execution
    setTimeout(() => {
      soundFx.playSuccess();
      const outputLines = [
        `>>> python identity_protocol.py`,
        `Enter your username: ${trimmed}`,
        `[STDOUT] Initializing Station Aethelgard clearance registry...`,
        `[STDOUT] Identity confirmed: '${trimmed}'. Security clearance granted to Sector 4.`,
        `[SYSTEM] Bound runtime variable 'username' = "${trimmed}" (type: str)`,
        `[STATUS] Process finished with exit code 0 (SUCCESS)`,
      ];

      setExecutionOutput(outputLines);
      setIsExecuting(false);
      setIsSuccess(true);

      // Save username to user profile
      const updatedUser = {
        ...user,
        username: trimmed,
      };
      setUser(updatedUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('codequest_user', JSON.stringify(updatedUser));
      }

      // Close and trigger ARIA dialogue continuation after 1.8s
      setTimeout(() => {
        onComplete(trimmed);
      }, 1800);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-indigo-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-mono text-xs sm:text-sm">
        {/* Top Terminal Bar */}
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            <span className="text-slate-400 font-semibold text-xs ml-2 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>AETHELGARD COMMAND REPL // PYTHON 3.12 KERNEL</span>
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
            identity_protocol.py
          </span>
        </div>

        {/* Python Script Header Display */}
        <div className="p-4 sm:p-5 bg-slate-950/70 border-b border-slate-800/80 text-slate-300 space-y-2">
          <div className="text-slate-500 italic">
            # -------------------------------------------------------------
            <br />
            # TASK: Initialize your explorer identity in the mainframe:
            <br />
            # -------------------------------------------------------------
          </div>
          <div className="text-indigo-300 font-semibold">
            username = <span className="text-emerald-400">input</span>(
            <span className="text-amber-300">&quot;Enter your username: &quot;</span>)
          </div>
          <div className="text-indigo-300 font-semibold">
            <span className="text-emerald-400">print</span>(
            <span className="text-amber-300">
              f&quot;Identity confirmed: &#39;&#123;username&#125;&#39;. Security clearance granted to Sector 4.&quot;
            </span>
            )
          </div>
        </div>

        {/* Interactive Terminal REPL Console */}
        <div className="p-5 sm:p-6 bg-black/90 flex-1 space-y-3 min-h-[220px]">
          <div className="text-slate-400 text-xs">
            Aethelgard OS v2.0 (CPython 3.12.7, default terminal stream)
          </div>

          {!executionOutput ? (
            <form onSubmit={handleExecute} className="space-y-4 pt-2">
              <div className="text-slate-400">
                &gt;&gt;&gt; python identity_protocol.py
              </div>

              <div className="flex items-center space-x-2 text-indigo-300 bg-slate-900/60 p-3 rounded-xl border border-indigo-500/30 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/20">
                <span className="text-amber-300 shrink-0 font-bold">
                  Enter your username:
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  required
                  placeholder="e.g. Orion, Nova, Cipher"
                  value={inputVal}
                  onFocus={() => soundFx.playFocus()}
                  onChange={(e) => setInputVal(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder:text-slate-600"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">
                  Type your explorer name and press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Enter ↵</kbd>
                </span>

                <button
                  type="submit"
                  disabled={!inputVal.trim() || isExecuting}
                  onMouseEnter={() => soundFx.playHover()}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all flex items-center gap-2 disabled:opacity-50 shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  {isExecuting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Executing...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Execute Script</span>
                      <CornerDownLeft className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Script Execution Results Stream */
            <div className="space-y-1.5 animate-fadeIn font-mono text-xs sm:text-sm">
              {executionOutput.map((line, idx) => {
                const isStdout = line.startsWith('[STDOUT]');
                const isSystem = line.startsWith('[SYSTEM]') || line.startsWith('[STATUS]');
                return (
                  <div
                    key={idx}
                    className={`${
                      isStdout
                        ? 'text-cyan-300 font-medium'
                        : isSystem
                        ? 'text-emerald-400 font-semibold'
                        : 'text-slate-300'
                    }`}
                  >
                    {line}
                  </div>
                );
              })}

              {isSuccess && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-pulse">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Clearance verified! Accessing Station Aethelgard diagnostic stream...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
