'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import { AriaCharacter, AriaAnimationState } from '@/components/characters/AriaCharacter';
import { OrpheusBridge } from '@/components/environments/OrpheusBridge';
import { ReactorCore, ReactorState } from '@/components/props/ReactorCore';
import { ReactorConsole } from '@/components/props/ReactorConsole';
import { HolographicDisplay } from '@/components/props/HolographicDisplay';
import { CinematicCamera } from './CinematicCamera';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface WorldCanvasProps {
  cinematicTime?: number;
  isCinematicPlaying?: boolean;
  enableOrbitControls?: boolean;
  ariaAnimation?: AriaAnimationState;
  reactorState?: ReactorState;
  qualityPreset?: 'low' | 'medium' | 'high' | 'auto';
}

export function WorldCanvas({
  cinematicTime = 0,
  isCinematicPlaying = false,
  enableOrbitControls = false,
  ariaAnimation = 'idle',
  reactorState = 'critical',
  qualityPreset = 'auto',
}: WorldCanvasProps) {
  const [hasWebGlError, setHasWebGlError] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGlError(true);
      }
    } catch {
      setHasWebGlError(true);
    }
  }, []);

  if (hasWebGlError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-950 text-slate-300 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-400 mb-3" />
        <h3 className="text-lg font-bold text-white mb-1">WebGL 3D Acceleration Unavailable</h3>
        <p className="text-xs text-slate-400 max-w-md mb-4">
          Your browser or device does not currently have WebGL hardware acceleration enabled.
          You can still play the programming missions and terminal challenges.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry 3D Initialization
        </button>
      </div>
    );
  }

  const starCount = qualityPreset === 'low' ? 1000 : qualityPreset === 'medium' ? 2000 : 3500;

  return (
    <div className="relative w-full h-full bg-[#030712] select-none">
      <Canvas
        camera={{ position: [0, 5.5, 14.0], fov: 45 }}
        gl={{ antialias: qualityPreset !== 'low', powerPreference: 'high-performance' }}
        className="w-full h-full"
      >
        {/* Background Deep Space Stars */}
        <Stars radius={70} depth={50} count={starCount} factor={4} saturation={0} fade speed={1.2} />

        {/* Cinematic Artistic Lighting (Independent of UI theme) */}
        <ambientLight intensity={0.45} />
        <directionalLight position={[6, 9, 6]} intensity={1.2} color="#f0f5ff" />
        <pointLight position={[-4, 3, -1]} intensity={2.0} color="#00e5ff" distance={16} />
        <pointLight position={[4, 3, -1]} intensity={1.5} color="#818cf8" distance={14} />

        {/* Camera Control: Driven by Cinematic timeline or manual orbit */}
        {enableOrbitControls ? (
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={1.2}
            maxDistance={18}
            target={[0, 1.2, 0]}
          />
        ) : (
          <CinematicCamera currentTime={cinematicTime} isPlaying={isCinematicPlaying} />
        )}

        {/* Modular 3D Scene Components */}
        <Suspense fallback={null}>
          <group position={[0, 0, 0]}>
            {/* 1. ORPHEUS Bridge Architecture */}
            <OrpheusBridge position={[0, 0, 0]} />

            {/* 2. ARIA Holographic Pedestal & Character */}
            <AriaCharacter
              currentAnimation={ariaAnimation}
              position={[0, 0.05, 0]}
              rotation={[0, Math.PI, 0]}
            />

            {/* 3. Reactor Core with State-reactive glow */}
            <ReactorCore
              state={reactorState}
              position={[0, 0, -3.5]}
              rotation={[0, 0, 0]}
            />

            {/* 4. Reactor Console & Holographic HUD */}
            <ReactorConsole position={[1.8, 0, 0.8]} rotation={[0, -0.4, 0]} />
            <HolographicDisplay position={[-1.8, 0, 0.8]} rotation={[0, 0.4, 0]} />
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
}
