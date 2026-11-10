'use client';

import React, { useRef, useEffect, useMemo } from 'react';
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
  const outerRingRef = useRef<any>(null);
  const innerRingRef = useRef<any>(null);
  const coreMeshRef = useRef<any>(null);
  const domeMatRef = useRef<any>(null);

  // Load existing base model if available
  const { scene, animations } = useGLTF('/models/reactor_core.glb');
  const { actions } = useAnimations(animations, scene);

  // References to materials for runtime state mutation
  const plasmaMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const glowMatRef = useRef<THREE.MeshStandardMaterial | null>(null);

  // Play animation if available
  useEffect(() => {
    if (actions && actions['Reactor_Core_Oscillation']) {
      actions['Reactor_Core_Oscillation'].reset().play();
    }
  }, [actions]);

  // Clone materials on load
  useEffect(() => {
    if (!scene) return;

    let meshCount = 0;
    scene.traverse((child) => {
      const mesh = child as any;
      if (mesh.isMesh) {
        meshCount++;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (mat) {
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

  // Particle positions for central plasma spark field
  const sparkParticles = useMemo(() => {
    const count = 48;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 0.4 + Math.random() * 0.8;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = 1.6 + r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return positions;
  }, []);

  // Per-frame cinematic animation & lighting state
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // 1. Concentric counter-rotating mechanical gantry rings
    if (outerRingRef.current) {
      outerRingRef.current.rotation.y = -t * 0.25;
      outerRingRef.current.rotation.x = Math.sin(t * 0.5) * 0.05;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.y = t * 0.55;
      innerRingRef.current.rotation.z = Math.cos(t * 0.6) * 0.06;
    }

    // 2. Dynamic state pulses
    let targetColor = new THREE.Color(0x00f0ff);
    let targetEmissive = 1.5;

    if (state === 'offline') {
      targetColor = new THREE.Color(0x0a1220);
      targetEmissive = 0.05;
    } else if (state === 'critical') {
      // Rapid violent crimson/orange emergency flashing
      const strobe = Math.sin(t * 8.0) > 0.1 ? 1 : 0.2;
      const flash = (Math.sin(t * 6.0) + 1) * 0.5;
      targetColor = new THREE.Color(0xff1144).lerp(new THREE.Color(0xff6600), flash);
      targetEmissive = 1.2 + flash * 2.2 * strobe;
    } else if (state === 'recovering') {
      // Calming amber-cyan wave
      const blend = (Math.sin(t * 3.0) + 1) * 0.5;
      targetColor = new THREE.Color(0xffaa00).lerp(new THREE.Color(0x00e5ff), blend);
      targetEmissive = 1.0 + Math.sin(t * 4.0) * 0.5;
    } else if (state === 'operational') {
      // Serene brilliant emerald-cyan plasma core
      const pulse = Math.sin(t * 2.2) * 0.25 + 0.95;
      targetColor = new THREE.Color(0x00f5d4).lerp(new THREE.Color(0x00b4d8), Math.sin(t) * 0.5 + 0.5);
      targetEmissive = 2.0 * pulse;
    }

    // Apply to central core mesh
    if (coreMeshRef.current) {
      const mat = coreMeshRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.color.copy(targetColor);
        mat.emissive.copy(targetColor);
        mat.emissiveIntensity = targetEmissive;
      }
      coreMeshRef.current.scale.setScalar(0.95 + Math.sin(t * 4.0) * 0.06);
    }

    // Apply to base model plasma if loaded
    if (plasmaMatRef.current) {
      plasmaMatRef.current.emissive.copy(targetColor);
      plasmaMatRef.current.emissiveIntensity = targetEmissive;
    }
    if (glowMatRef.current) {
      glowMatRef.current.emissive.copy(targetColor);
      glowMatRef.current.emissiveIntensity = targetEmissive * 0.8;
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {/* 1. Underlying Base GLB Mesh */}
      <primitive object={scene} position={[0, -1.0, -2.5]} />

      {/* 2. Concentric Mechanical Gantry Rings & Glass Dome (Matching Reference Screenshots 1 & 2) */}
      <group position={[0, 0, 0]}>
        {/* Transparent Crystalline Geodesic Glass Containment Dome */}
        <mesh position={[0, 1.6, 0]}>
          <sphereGeometry args={[2.1, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
          <meshPhysicalMaterial
            ref={domeMatRef}
            color="#99f6e4"
            transmission={0.92}
            opacity={1}
            transparent
            roughness={0.06}
            ior={1.52}
            thickness={1.4}
            clearcoat={1.0}
            clearcoatRoughness={0.08}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Luminous Glowing Dome Collar Ring */}
        <mesh position={[0, 0.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.95, 2.15, 48]} />
          <meshStandardMaterial
            color={state === 'critical' ? '#ff2244' : '#00e5ff'}
            emissive={state === 'critical' ? '#ff1133' : '#00f0ff'}
            emissiveIntensity={state === 'critical' ? 2.5 : 1.8}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Concentric Rotating Outer Ring with Mechanical Teeth Brackets */}
        <group ref={outerRingRef} position={[0, 1.6, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.75, 0.06, 16, 48]} />
            <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.25} />
          </mesh>
          {/* Mechanical Emitter Pylons on Outer Ring */}
          {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, idx) => (
            <group key={idx} rotation={[0, angle, 0]} position={[0, 0, 0]}>
              <mesh position={[1.75, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.08, 0.12, 0.35, 12]} />
                <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
              </mesh>
              <mesh position={[1.6, 0, 0]}>
                <sphereGeometry args={[0.06, 12, 12]} />
                <meshStandardMaterial
                  color={state === 'critical' ? '#ff3344' : '#38bdf8'}
                  emissive={state === 'critical' ? '#ff0033' : '#00e5ff'}
                  emissiveIntensity={2.0}
                />
              </mesh>
            </group>
          ))}
        </group>

        {/* Concentric Rotating Inner Magnetic Ring */}
        <group ref={innerRingRef} position={[0, 1.6, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[1.35, 0.045, 16, 40]} />
            <meshStandardMaterial
              color="#0f172a"
              emissive={state === 'critical' ? '#ff4400' : '#06b6d4'}
              emissiveIntensity={1.2}
              metalness={0.9}
            />
          </mesh>
        </group>

        {/* 3. Central Blinding Fusion Plasma Core (Spherical Singularity) */}
        <mesh ref={coreMeshRef} position={[0, 1.6, 0]}>
          <sphereGeometry args={[0.65, 32, 32]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={2.5}
            roughness={0.1}
          />
        </mesh>

        {/* Plasma Corona Aura Sphere */}
        <mesh position={[0, 1.6, 0]}>
          <sphereGeometry args={[0.85, 24, 24]} />
          <meshStandardMaterial
            color={state === 'critical' ? '#ff2200' : '#00f5d4'}
            emissive={state === 'critical' ? '#ff1100' : '#00f5d4'}
            emissiveIntensity={1.5}
            transparent
            opacity={0.35}
            side={THREE.BackSide}
          />
        </mesh>

        {/* Central Core Point Light */}
        <pointLight
          position={[0, 1.6, 0]}
          color={state === 'critical' ? '#ff1133' : state === 'recovering' ? '#00e5ff' : '#00f5d4'}
          intensity={state === 'critical' ? 4.0 : 3.0}
          distance={16}
          decay={1.8}
        />

        {/* 4. Plasma Spark Particle Cloud */}
        <points position={[0, 0, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={sparkParticles.length / 3}
              array={sparkParticles}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.065}
            color={state === 'critical' ? '#ffa040' : '#67e8f9'}
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </points>

        {/* 5. Radial Circuit Tracks Emitting Across Floor to Bridge */}
        <group position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4, Math.PI, (5 * Math.PI) / 4, (3 * Math.PI) / 2, (7 * Math.PI) / 4].map((rad, i) => (
            <mesh key={i} rotation={[0, 0, rad]} position={[1.8 * Math.cos(rad / 2), 1.8 * Math.sin(rad / 2), 0]}>
              <planeGeometry args={[0.04, 2.5]} />
              <meshStandardMaterial
                color={state === 'critical' ? '#ff1133' : '#00f0ff'}
                emissive={state === 'critical' ? '#ff0022' : '#00e5ff'}
                emissiveIntensity={1.2}
              />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/models/reactor_core.glb');