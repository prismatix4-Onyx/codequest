'use client';

import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface HolographicDisplayProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  onLoaded?: (info: { meshCount: number }) => void;
}

export function HolographicDisplay({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onLoaded,
}: HolographicDisplayProps) {
  const groupRef = useRef<any>(null);
  const { scene } = useGLTF('/models/holographic_display.glb');

  useEffect(() => {
    if (scene && onLoaded) {
      let meshCount = 0;
      scene.traverse((child) => {
        if ((child as any).isMesh) meshCount++;
      });
      onLoaded({ meshCount });
    }
  }, [scene, onLoaded]);

  // Subtle holographic flicker and hover
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.getElapsedTime();
      groupRef.current.position.y = position[1] + Math.sin(t * 2.0) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={scene} />
      {/* Cyan holographic ambient glow */}
      <pointLight color="#00e5ff" intensity={1.5} distance={4} decay={2} position={[0, 1.2, 0]} />
    </group>
  );
}

useGLTF.preload('/models/holographic_display.glb');
