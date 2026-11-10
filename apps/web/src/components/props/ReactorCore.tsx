'use client';

import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type ReactorState = 'offline' | 'critical' | 'recovering' | 'operational';

interface ReactorCoreProps {
  state?: ReactorState;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  onLoaded?: (info: { animationNames: string[]; meshCount: number }) => void;
}

export function ReactorCore({
  state = 'critical',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onLoaded,
}: ReactorCoreProps) {
  const groupRef = useRef<any>(null);
  const { scene, animations } = useGLTF('/models/reactor_core.glb');
  const { actions } = useAnimations(animations, scene);

  // References to materials for runtime state mutation
  const plasmaMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const glowMatRef = useRef<THREE.MeshStandardMaterial | null>(null);

  // Play the Reactor_Core_Oscillation animation
  useEffect(() => {
    if (actions && actions['Reactor_Core_Oscillation']) {
      actions['Reactor_Core_Oscillation'].reset().play();
    }
  }, [actions]);

  // Clone materials on load so state changes don't affect other instances
  useEffect(() => {
    if (!scene) return;

    let meshCount = 0;
    scene.traverse((child) => {
      const mesh = child as any;
      if (mesh.isMesh) {
        meshCount++;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat) {
          // If this is plasma or glow material, keep a reference
          if (mat.name.includes('Plasma') || mesh.name.includes('Plasma') || mesh.name.includes('Core')) {
            plasmaMatRef.current = mat;
          }
          if (mat.name.includes('Glow') || mesh.name.includes('Ring')) {
            glowMatRef.current = mat;
          }
        }
      }
    });

    if (onLoaded && animations) {
      onLoaded({
        animationNames: animations.map((a) => a.name),
        meshCount,
      });
    }
  }, [scene, animations, onLoaded]);

  // Per-frame state-based visual pulse (uses clock directly, no React state re-renders)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (state === 'offline') {
      if (plasmaMatRef.current) {
        plasmaMatRef.current.emissive = new THREE.Color(0x050a12);
        plasmaMatRef.current.emissiveIntensity = 0.05;
      }
      if (glowMatRef.current) {
        glowMatRef.current.emissive = new THREE.Color(0x020509);
        glowMatRef.current.emissiveIntensity = 0.02;
      }
    } else if (state === 'critical') {
      // Rapid unstable flashing red/crimson alarm pulse
      const flash = (Math.sin(t * 7.5) + 1) * 0.5;
      const intensity = 1.0 + flash * 2.5;
      if (plasmaMatRef.current) {
        plasmaMatRef.current.emissive = new THREE.Color(0xff1133);
        plasmaMatRef.current.emissiveIntensity = intensity;
      }
      if (glowMatRef.current) {
        glowMatRef.current.emissive = new THREE.Color(0xff3300);
        glowMatRef.current.emissiveIntensity = intensity * 0.8;
      }
    } else if (state === 'recovering') {
      // Transitioning stabilization: shifting between amber and cyan
      const blend = (Math.sin(t * 3.0) + 1) * 0.5;
      const color = new THREE.Color(0xffaa00).lerp(new THREE.Color(0x00e5ff), blend);
      const intensity = 0.8 + Math.sin(t * 4.0) * 0.4;
      if (plasmaMatRef.current) {
        plasmaMatRef.current.emissive = color;
        plasmaMatRef.current.emissiveIntensity = intensity;
      }
      if (glowMatRef.current) {
        glowMatRef.current.emissive = color;
        glowMatRef.current.emissiveIntensity = intensity * 0.7;
      }
    } else if (state === 'operational') {
      // Pure stable cyan glow with gentle breathing rhythm
      const pulse = Math.sin(t * 1.5) * 0.25 + 1.1;
      if (plasmaMatRef.current) {
        plasmaMatRef.current.emissive = new THREE.Color(0x00e5ff);
        plasmaMatRef.current.emissiveIntensity = pulse * 1.6;
      }
      if (glowMatRef.current) {
        glowMatRef.current.emissive = new THREE.Color(0x00b4d8);
        glowMatRef.current.emissiveIntensity = pulse * 1.2;
      }
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={scene} position={[0, -1.0, -2.5]} />
      {/* Dynamic reactor point light matching visual state */}
      {state === 'critical' && (
        <pointLight color="#ff1744" intensity={4.5} distance={12} decay={2} position={[0, 1.1, 0]} />
      )}
      {state === 'recovering' && (
        <pointLight color="#00e5ff" intensity={3.0} distance={10} decay={2} position={[0, 1.1, 0]} />
      )}
      {state === 'operational' && (
        <pointLight color="#00f0ff" intensity={3.5} distance={12} decay={2} position={[0, 1.1, 0]} />
      )}
    </group>
  );
}

useGLTF.preload('/models/reactor_core.glb');
