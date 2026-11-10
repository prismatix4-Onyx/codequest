'use client';

import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type AriaAnimationState =
  | 'idle'
  | 'talking'
  | 'listening'
  | 'thinking'
  | 'surprised'
  | 'happy'
  | 'concerned'
  | 'mission_success';

interface AriaCharacterProps {
  currentAnimation?: AriaAnimationState;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  onAnimationComplete?: (actionName: string) => void;
  onLoaded?: (info: { animationNames: string[]; meshCount: number }) => void;
}

const CLIP_NAME_MAP: Record<AriaAnimationState, string> = {
  idle: 'ARIA_Idle',
  talking: 'ARIA_Talking',
  listening: 'ARIA_Listening',
  thinking: 'ARIA_Thinking',
  surprised: 'ARIA_Surprised',
  happy: 'ARIA_Happy',
  concerned: 'ARIA_Concerned',
  mission_success: 'ARIA_Mission_Success',
};

const ONE_SHOT_STATES: AriaAnimationState[] = ['surprised', 'mission_success', 'happy'];

export function AriaCharacter({
  currentAnimation = 'idle',
  position = [0, 0, 0],
  rotation = [0, Math.PI, 0],
  scale = 1,
  onAnimationComplete,
  onLoaded,
}: AriaCharacterProps) {
  const groupRef = useRef<any>(null);
  const holoGlobeRef = useRef<any>(null);
  const orbitRingRef = useRef<any>(null);
  const dataPanelRef = useRef<any>(null);

  const { scene, animations } = useGLTF('/models/aria.glb');
  const { actions } = useAnimations(animations, scene);
  const activeActionRef = useRef<any>(null);
  const activeClipRef = useRef<string>('');

  // Report load metadata to parent
  useEffect(() => {
    if (onLoaded && animations) {
      let meshCount = 0;
      scene.traverse((child) => {
        if ((child as any).isMesh) meshCount++;
      });
      onLoaded({
        animationNames: animations.map((a) => a.name),
        meshCount,
      });
    }
  }, [animations, scene, onLoaded]);

  // Handle animation transitions with cross-fading
  useEffect(() => {
    if (!actions || animations.length === 0) return;

    const targetClipName = CLIP_NAME_MAP[currentAnimation] || 'ARIA_Idle';
    const targetAction = actions[targetClipName];

    if (!targetAction) {
      const fallbackAction = actions['ARIA_Idle'];
      if (fallbackAction) {
        fallbackAction.reset().fadeIn(0.2).play();
        activeActionRef.current = fallbackAction;
        activeClipRef.current = 'ARIA_Idle';
      }
      return;
    }

    if (activeClipRef.current === targetClipName) return;

    const prevAction = activeActionRef.current;
    if (prevAction) {
      prevAction.fadeOut(0.3);
    }

    const isOneShot = ONE_SHOT_STATES.includes(currentAnimation);

    targetAction.reset();
    targetAction.setEffectiveTimeScale(1);
    targetAction.setEffectiveWeight(1);
    targetAction.clampWhenFinished = isOneShot;
    targetAction.loop = isOneShot ? THREE.LoopOnce : THREE.LoopRepeat;
    targetAction.fadeIn(0.3).play();

    activeActionRef.current = targetAction;
    activeClipRef.current = targetClipName;
  }, [currentAnimation, actions, animations]);

  // Frame tick for Holographic Globe and data panels (Screenshot 3)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (holoGlobeRef.current) {
      // Gentle floating bob
      holoGlobeRef.current.position.y = 1.05 + Math.sin(t * 2.0) * 0.04;
      // Rotation of the digital globe
      holoGlobeRef.current.rotation.y = t * 0.6;
    }

    if (orbitRingRef.current) {
      orbitRingRef.current.rotation.x = t * 0.9;
      orbitRingRef.current.rotation.z = Math.sin(t * 1.2) * 0.4;
    }

    if (dataPanelRef.current) {
      dataPanelRef.current.position.y = 1.15 + Math.cos(t * 1.8) * 0.03;
      dataPanelRef.current.rotation.y = -0.3 + Math.sin(t * 0.8) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* 1. Underlying Base ARIA 3D Model */}
      <primitive object={scene} />

      {/* 2. Floating 3D Holographic Digital Globe in ARIA's Palm (Screenshot 3) */}
      <group position={[0.38, 0, 0.45]}>
        {/* Holographic Digital Earth / Station Globe */}
        <group ref={holoGlobeRef} position={[0, 1.05, 0]}>
          {/* Outer Geodesic Wireframe Sphere */}
          <mesh>
            <icosahedronGeometry args={[0.18, 2]} />
            <meshStandardMaterial
              color="#00f0ff"
              emissive="#00e5ff"
              emissiveIntensity={1.8}
              wireframe
              transparent
              opacity={0.85}
            />
          </mesh>

          {/* Inner Luminous Planetary Core */}
          <mesh>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={1.2}
              transparent
              opacity={0.65}
            />
          </mesh>

          {/* Concentric Rotating Orbital Latitude Rings */}
          <group ref={orbitRingRef}>
            <mesh rotation={[Math.PI / 4, 0, 0]}>
              <ringGeometry args={[0.22, 0.23, 32]} />
              <meshBasicMaterial color="#67e8f9" side={THREE.DoubleSide} />
            </mesh>
            <mesh rotation={[-Math.PI / 3, Math.PI / 6, 0]}>
              <ringGeometry args={[0.26, 0.27, 32]} />
              <meshBasicMaterial color="#00e5ff" side={THREE.DoubleSide} />
            </mesh>
          </group>

          {/* Soft Glow Light from the Globe */}
          <pointLight color="#00e5ff" intensity={1.8} distance={2.5} decay={2} />
        </group>

        {/* Floating Translucent Telemetry Hologram Cards next to Globe */}
        <group ref={dataPanelRef} position={[0.25, 1.15, 0]}>
          <mesh rotation={[0, -0.4, 0]}>
            <planeGeometry args={[0.28, 0.18]} />
            <meshStandardMaterial
              color="#00f0ff"
              emissive="#00e5ff"
              emissiveIntensity={1.2}
              transparent
              opacity={0.55}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0.08, -0.12, 0.05]} rotation={[0, -0.3, 0]}>
            <planeGeometry args={[0.18, 0.12]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0284c7"
              emissiveIntensity={1.0}
              transparent
              opacity={0.45}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </group>

      {/* 3. High-Tech Holographic Emitter Pedestal under ARIA's Feet */}
      <group position={[0, 0.01, 0]}>
        {/* Hexagonal Emitter Base */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.9, 0.98, 0.08, 6]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Concentric Glowing Emitter Ring */}
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.65, 0.78, 32]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00e5ff"
            emissiveIntensity={2.0}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Subtle Pedestal Uplight */}
        <pointLight position={[0, 0.4, 0]} color="#00e5ff" intensity={1.2} distance={3.0} />
      </group>
    </group>
  );
}

useGLTF.preload('/models/aria.glb');