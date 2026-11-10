'use client';

import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface ReactorConsoleProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  onLoaded?: (info: { meshCount: number }) => void;
}

export function ReactorConsole({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onLoaded,
}: ReactorConsoleProps) {
  const groupRef = useRef<any>(null);
  const { scene } = useGLTF('/models/reactor_console.glb');

  useEffect(() => {
    if (scene && onLoaded) {
      let meshCount = 0;
      scene.traverse((child) => {
        if ((child as any).isMesh) meshCount++;
      });
      onLoaded({ meshCount });
    }
  }, [scene, onLoaded]);

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/models/reactor_console.glb');
