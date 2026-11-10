'use client';

import React, { useState, Suspense, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Link from 'next/link';
import {
  Sparkles,
  Layers,
  Activity,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  Sliders,
  Maximize2,
} from 'lucide-react';
import { AriaCharacter, AriaAnimationState } from '@/components/characters/AriaCharacter';
import { OrpheusBridge } from '@/components/environments/OrpheusBridge';
import { ReactorCore, ReactorState } from '@/components/props/ReactorCore';
import { ReactorConsole } from '@/components/props/ReactorConsole';
import { HolographicDisplay } from '@/components/props/HolographicDisplay';

type AssetSelection = 'all' | 'aria' | 'bridge' | 'reactor' | 'console' | 'hologram';

interface AssetItem {
  id: AssetSelection;
  name: string;
  path: string;
  polyEstimate: string;
}

const ASSETS: AssetItem[] = [
  { id: 'all', name: 'Full Composite Scene', path: 'All Models Integrated', polyEstimate: '~30,000' },
  { id: 'aria', name: 'ARIA AI Companion', path: '/models/aria.glb', polyEstimate: '22,172' },
  { id: 'bridge', name: 'ORPHEUS Bridge', path: '/models/orpheus_bridge.glb', polyEstimate: '2,292' },
  { id: 'reactor', name: 'Reactor Core', path: '/models/reactor_core.glb', polyEstimate: '5,340' },
  { id: 'console', name: 'Reactor Console', path: '/models/reactor_console.glb', polyEstimate: '24' },
  { id: 'hologram', name: 'Holographic Display', path: '/models/holographic_display.glb', polyEstimate: '122' },
];

const ARIA_ANIMATIONS: { key: AriaAnimationState; label: string }[] = [
  { key: 'idle', label: 'ARIA_Idle' },
  { key: 'talking', label: 'ARIA_Talking' },
  { key: 'listening', label: 'ARIA_Listening' },
  { key: 'thinking', label: 'ARIA_Thinking' },
  { key: 'surprised', label: 'ARIA_Surprised' },
  { key: 'happy', label: 'ARIA_Happy' },
  { key: 'concerned', label: 'ARIA_Concerned' },
  { key: 'mission_success', label: 'ARIA_Mission_Success' },
];

const REACTOR_STATES: ReactorState[] = ['critical', 'recovering', 'operational', 'offline'];

function ThreeAssetTestContent() {
  const searchParams = useSearchParams();
  const initialAsset = (searchParams.get('asset') as AssetSelection) || 'all';
  const initialAnim = (searchParams.get('anim') as AriaAnimationState) || 'idle';
  const initialState = (searchParams.get('state') as ReactorState) || 'critical';

  const [selectedAsset, setSelectedAsset] = useState<AssetSelection>(initialAsset);
  const [ariaAnimation, setAriaAnimation] = useState<AriaAnimationState>(initialAnim);
  const [reactorState, setReactorState] = useState<ReactorState>(initialState);

  useEffect(() => {
    const a = searchParams.get('asset') as AssetSelection;
    if (a) setSelectedAsset(a);
    const anim = searchParams.get('anim') as AriaAnimationState;
    if (anim) setAriaAnimation(anim);
    const st = searchParams.get('state') as ReactorState;
    if (st) setReactorState(st);
  }, [searchParams]);
  const [assetStats, setAssetStats] = useState<{
    animationNames: string[];
    meshCount: number;
    loadedAt: string;
  }>({
    animationNames: [],
    meshCount: 0,
    loadedAt: 'Pending...',
  });

  const handleAriaLoaded = (info: { animationNames: string[]; meshCount: number }) => {
    setAssetStats({
      animationNames: info.animationNames,
      meshCount: info.meshCount,
      loadedAt: new Date().toLocaleTimeString(),
    });
  };

  return (
    <div className="relative w-full h-screen bg-[#070B14] overflow-hidden flex flex-col font-sans select-none text-slate-100">
      {/* Top Header Bar */}
      <header className="h-14 px-6 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 text-xs text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Portal</span>
          </Link>
          <div className="h-4 w-[1px] bg-slate-700/60" />
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-semibold tracking-wide text-white">
              CODEQUEST 3D Asset Inspection Lab
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
              Phase 5
            </span>
          </div>
        </div>

        {/* Asset Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800/60">
          {ASSETS.map((asset) => (
            <button
              key={asset.id}
              onClick={() => setSelectedAsset(asset.id)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedAsset === asset.id
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {asset.name}
            </button>
          ))}
        </div>
      </header>

      {/* Main 3D Viewport with HUD Overlays */}
      <div className="flex-1 relative w-full h-full">
        {/* Three.js R3F Canvas */}
        <Canvas
          camera={{
            position: selectedAsset === 'all' ? [0, 1.8, 4.5] : [0, 1.4, 3.2],
            fov: selectedAsset === 'all' ? 50 : 45,
          }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          {/* Deep Space Background Stars */}
          <Stars radius={60} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

          {/* Artistic Space Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 8, 5]} intensity={1.2} color="#f0f4ff" />
          <pointLight position={[-4, 3, -2]} intensity={2.0} color="#00e5ff" distance={15} />
          <pointLight position={[0, 4, 0]} intensity={1.5} color="#818cf8" distance={12} />

          {/* Orbit Controls for 360 Examination */}
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={1.0}
            maxDistance={18.0}
            maxPolarAngle={Math.PI / 2 + 0.05}
            target={[0, 1.1, 0]}
          />

          {/* Suspense Boundary for Async GLB Loaders */}
          <Suspense fallback={null}>
            {/* 1. All Assets Composite View */}
            {selectedAsset === 'all' && (
              <group position={[0, 0, 0]}>
                <OrpheusBridge position={[0, 0, 0]} />
                <AriaCharacter
                  currentAnimation={ariaAnimation}
                  position={[0, 0.05, 0]}
                  rotation={[0, Math.PI, 0]}
                  onLoaded={handleAriaLoaded}
                />
                <ReactorCore
                  state={reactorState}
                  position={[0, 0, -3.5]}
                  rotation={[0, 0, 0]}
                />
                <ReactorConsole position={[1.8, 0, 0.8]} rotation={[0, -0.4, 0]} />
                <HolographicDisplay position={[-1.8, 0, 0.8]} rotation={[0, 0.4, 0]} />
              </group>
            )}

            {/* 2. Isolated ARIA Character */}
            {selectedAsset === 'aria' && (
              <AriaCharacter
                currentAnimation={ariaAnimation}
                position={[0, 0, 0]}
                rotation={[0, Math.PI, 0]}
                onLoaded={handleAriaLoaded}
              />
            )}

            {/* 3. Isolated ORPHEUS Bridge */}
            {selectedAsset === 'bridge' && <OrpheusBridge position={[0, 0, 0]} />}

            {/* 4. Isolated Reactor Core */}
            {selectedAsset === 'reactor' && (
              <ReactorCore state={reactorState} position={[0, 0, 0]} />
            )}

            {/* 5. Isolated Reactor Console */}
            {selectedAsset === 'console' && <ReactorConsole position={[0, 0, 0]} />}

            {/* 6. Isolated Holographic Display */}
            {selectedAsset === 'hologram' && <HolographicDisplay position={[0, 0, 0]} />}
          </Suspense>
        </Canvas>

        {/* HUD Overlay — Left Side: Model & Inspection Telemetry */}
        <div className="absolute top-4 left-4 z-10 w-80 space-y-3 pointer-events-none">
          <div className="p-4 rounded-2xl bg-slate-900/85 border border-slate-800/80 backdrop-blur-xl shadow-2xl pointer-events-auto">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Asset Telemetry
              </span>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> GLB Ready
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Current View:</span>
                <span className="font-semibold text-white">
                  {ASSETS.find((a) => a.id === selectedAsset)?.name}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Polycount Target:</span>
                <span className="font-mono text-indigo-300">
                  {ASSETS.find((a) => a.id === selectedAsset)?.polyEstimate}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">GLB Source:</span>
                <span className="font-mono text-[11px] text-slate-400 truncate max-w-[160px]">
                  {ASSETS.find((a) => a.id === selectedAsset)?.path}
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Loaded At:</span>
                <span className="font-mono text-[11px] text-slate-400">{assetStats.loadedAt}</span>
              </div>
            </div>
          </div>

          {/* Reactor Controls (when composite or reactor selected) */}
          {(selectedAsset === 'all' || selectedAsset === 'reactor') && (
            <div className="p-4 rounded-2xl bg-slate-900/85 border border-slate-800/80 backdrop-blur-xl shadow-2xl pointer-events-auto">
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 mb-2.5">
                <Activity className="w-3.5 h-3.5" />
                Reactor Visual State
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {REACTOR_STATES.map((st) => (
                  <button
                    key={st}
                    onClick={() => setReactorState(st)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-mono capitalize transition-all border ${
                      reactorState === st
                        ? st === 'critical'
                          ? 'bg-rose-600/30 border-rose-500 text-rose-200'
                          : st === 'operational'
                          ? 'bg-cyan-600/30 border-cyan-500 text-cyan-200'
                          : 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                        : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* HUD Overlay — Right Side: ARIA 8-Animation Trigger Pad */}
        {(selectedAsset === 'all' || selectedAsset === 'aria') && (
          <div className="absolute top-4 right-4 z-10 w-72 p-4 rounded-2xl bg-slate-900/85 border border-slate-800/80 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                ARIA Animation Actions (8)
              </span>
              <span className="text-[10px] font-mono text-slate-400">Armature Rig</span>
            </div>

            <div className="space-y-1.5">
              {ARIA_ANIMATIONS.map((anim) => (
                <button
                  key={anim.key}
                  onClick={() => setAriaAnimation(anim.key)}
                  className={`w-full px-3 py-1.5 rounded-xl text-xs font-mono flex items-center justify-between transition-all border ${
                    ariaAnimation === anim.key
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                      : 'bg-slate-950/50 text-slate-300 border-slate-800/80 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <span>{anim.label}</span>
                  {ariaAnimation === anim.key && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Active State:</span>
              <span className="font-mono text-indigo-300 font-semibold">{ariaAnimation}</span>
            </div>
          </div>
        )}

        {/* HUD Bottom Hint Bar */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-800/70 backdrop-blur-md text-xs text-slate-400 flex items-center gap-3 shadow-lg pointer-events-none">
          <span className="flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            Left Click + Drag to Orbit
          </span>
          <span>•</span>
          <span>Right Click + Drag to Pan</span>
          <span>•</span>
          <span>Scroll Wheel to Zoom</span>
        </div>
      </div>
    </div>
  );
}

export default function ThreeAssetTestPage() {
  return (
    <Suspense fallback={<div className="w-full h-screen bg-[#070B14] flex items-center justify-center text-indigo-400">Loading 3D Inspection Lab...</div>}>
      <ThreeAssetTestContent />
    </Suspense>
  );
}
