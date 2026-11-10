'use client';

import React, { useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface OrpheusBridgeProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  onLoaded?: (info: { meshCount: number }) => void;
}

export function OrpheusBridge({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onLoaded,
}: OrpheusBridgeProps) {
  const groupRef = useRef<any>(null);
  const { scene } = useGLTF('/models/orpheus_bridge.glb');
  const holoPanelsRef = useRef<any>(null);

  useEffect(() => {
    if (scene && onLoaded) {
      let meshCount = 0;
      scene.traverse((child) => {
        if ((child as any).isMesh) meshCount++;
      });
      onLoaded({ meshCount });
    }
  }, [scene, onLoaded]);

  // Subtle floating oscillation for holographic displays
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (holoPanelsRef.current) {
      holoPanelsRef.current.position.y = Math.sin(t * 1.5) * 0.03;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* 1. Underlying Base GLB Mesh */}
      <primitive object={scene} />

      {/* 2. Industrial Sci-Fi Catwalks with Glowing Blue Glass Grids (Screenshot 1) */}
      <group position={[0, 0, 0]}>
        {/* Central Raised Catwalk Pathway (Leading straight toward Reactor Core) */}
        <mesh position={[0, 0.08, -0.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.6, 5.0]} />
          <meshPhysicalMaterial
            color="#082f49"
            transmission={0.4}
            roughness={0.2}
            metalness={0.8}
            clearcoat={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Luminous Floor Grid Lines (Catwalk Borders) */}
        <mesh position={[-0.82, 0.09, -0.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.04, 5.0]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00e5ff"
            emissiveIntensity={2.0}
          />
        </mesh>
        <mesh position={[0.82, 0.09, -0.6]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.04, 5.0]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00e5ff"
            emissiveIntensity={2.0}
          />
        </mesh>

        {/* Left Transverse Bridge Catwalk */}
        <mesh position={[-2.2, 0.08, -1.2]} rotation={[-Math.PI / 2, 0, Math.PI / 4]}>
          <planeGeometry args={[1.2, 3.2]} />
          <meshPhysicalMaterial
            color="#082f49"
            transmission={0.35}
            roughness={0.25}
            metalness={0.8}
            clearcoat={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Right Transverse Bridge Catwalk */}
        <mesh position={[2.2, 0.08, -1.2]} rotation={[-Math.PI / 2, 0, -Math.PI / 4]}>
          <planeGeometry args={[1.2, 3.2]} />
          <meshPhysicalMaterial
            color="#082f49"
            transmission={0.35}
            roughness={0.25}
            metalness={0.8}
            clearcoat={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Industrial Safety Handrails along Left & Right Catwalks */}
        {[-0.85, 0.85].map((xOffset, i) => (
          <group key={i} position={[xOffset, 0.08, -0.6]}>
            {/* Top Handrail Bar */}
            <mesh position={[0, 0.85, 0]}>
              <boxGeometry args={[0.04, 0.04, 5.0]} />
              <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Mid Safety Bar */}
            <mesh position={[0, 0.45, 0]}>
              <boxGeometry args={[0.03, 0.03, 5.0]} />
              <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.3} />
            </mesh>
            {/* Vertical Stanchion Posts */}
            {[-2.2, -1.1, 0, 1.1, 2.2].map((zPos, j) => (
              <mesh key={j} position={[0, 0.42, zPos]}>
                <cylinderGeometry args={[0.025, 0.025, 0.85, 8]} />
                <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
              </mesh>
            ))}
          </group>
        ))}

        {/* Heavy Industrial Hydraulic Side Pipes (Connecting bulkhead to reactor) */}
        {[-3.5, 3.5].map((xPos, idx) => (
          <group key={idx} position={[xPos, 1.5, -2.8]}>
            {/* Main horizontal conduit cylinder */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.42, 0.42, 2.8, 16]} />
              <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.25} />
            </mesh>
            {/* Industrial Flange Couplings */}
            {[-0.8, 0, 0.8].map((offset, k) => (
              <mesh key={k} position={[offset, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.5, 0.5, 0.12, 16]} />
                <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
              </mesh>
            ))}
          </group>
        ))}

        {/* 3. Floating Volumetric Holographic Screens (Screenshot 1) */}
        <group ref={holoPanelsRef}>
          {/* Left Engineering Telemetry Screen */}
          <group position={[-2.4, 1.45, 0.2]} rotation={[0, 0.5, 0]}>
            <mesh>
              <planeGeometry args={[1.2, 0.75]} />
              <meshStandardMaterial
                color="#00f0ff"
                emissive="#00e5ff"
                emissiveIntensity={1.4}
                transparent
                opacity={0.65}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Screen Border Frame */}
            <mesh>
              <ringGeometry args={[0.65, 0.67, 4]} />
              <meshBasicMaterial color="#38bdf8" wireframe />
            </mesh>
          </group>

          {/* Right Core Diagnostics Screen */}
          <group position={[2.4, 1.45, 0.2]} rotation={[0, -0.5, 0]}>
            <mesh>
              <planeGeometry args={[1.2, 0.75]} />
              <meshStandardMaterial
                color="#00f0ff"
                emissive="#00e5ff"
                emissiveIntensity={1.4}
                transparent
                opacity={0.65}
                side={THREE.DoubleSide}
              />
            </mesh>
            {/* Screen Border Frame */}
            <mesh>
              <ringGeometry args={[0.65, 0.67, 4]} />
              <meshBasicMaterial color="#38bdf8" wireframe />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/models/orpheus_bridge.glb');