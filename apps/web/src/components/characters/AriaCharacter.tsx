'use client';

import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
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
  const { scene, animations } = useGLTF('/models/aria.glb');
  const { actions, mixer } = useAnimations(animations, scene);
  const activeActionRef = useRef<any>(null);
  const activeClipRef = useRef<string>('');

  // Report load metadata to parent/HUD if callback provided
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
      // Fallback to idle if requested clip not found
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

  // Listen for one-shot animation finishes
  useEffect(() => {
    if (!mixer) return;

    const handleFinished = (e: any) => {
      if (onAnimationComplete && e.action) {
        onAnimationComplete(e.action.getClip().name);
      }
    };

    mixer.addEventListener('finished', handleFinished);
    return () => {
      mixer.removeEventListener('finished', handleFinished);
    };
  }, [mixer, onAnimationComplete]);

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/models/aria.glb');
