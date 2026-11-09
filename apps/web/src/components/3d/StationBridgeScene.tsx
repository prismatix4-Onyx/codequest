'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '@/store/useStore';
import { QUALITY_PRESETS } from '@codequest/game-engine';

// ----------------------------------------------------
// Smooth Camera Choreographer
// ----------------------------------------------------
function CameraDolly() {
  const currentScene = useStore((s) => s.currentScene);
  const targetPos = useRef(new THREE.Vector3(0, 2.5, 6.0));
  const targetLook = useRef(new THREE.Vector3(0, 1.4, 0));

  useFrame(({ camera }) => {
    if (currentScene?.camera) {
      const [px, py, pz] = currentScene.camera.position;
      const [tx, ty, tz] = currentScene.camera.target;
      targetPos.current.set(px, py, pz);
      targetLook.current.set(tx, ty, tz);
    }

    // Smooth lerp camera translation and orientation
    camera.position.x += (targetPos.current.x - camera.position.x) * 0.04;
    camera.position.y += (targetPos.current.y - camera.position.y) * 0.04;
    camera.position.z += (targetPos.current.z - camera.position.z) * 0.04;
    camera.lookAt(targetLook.current.x, targetLook.current.y, targetLook.current.z);
  });

  return null;
}

// ----------------------------------------------------
// 3D Character: ARIA (AI Companion)
// ----------------------------------------------------
function AriaCharacter({ emotion }: { emotion: string }) {
  const groupRef = useRef<any>(null);
  const headRef = useRef<any>(null);
  const visorRef = useRef<any>(null);
  const coreRef = useRef<any>(null);
  const leftRingRef = useRef<any>(null);
  const rightRingRef = useRef<any>(null);

  const envState = useStore((s) => s.environmentState);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (groupRef.current) {
      // Floating sinusoidal hover
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.08 + 1.2;

      // Celebrate spin if mission success
      if (emotion === 'mission_success') {
        groupRef.current.rotation.y = t * 3.0;
      } else {
        groupRef.current.rotation.y = Math.sin(t * 0.8) * 0.15;
      }
    }

    // Floating stabilizer rings rotation
    if (leftRingRef.current && rightRingRef.current) {
      leftRingRef.current.rotation.x = t * 1.2;
      leftRingRef.current.rotation.z = t * 0.9;
      rightRingRef.current.rotation.y = t * 1.4;
      rightRingRef.current.rotation.z = -t * 1.1;
    }

    // Power core pulsation
    if (coreRef.current) {
      const pulseSpeed = emotion === 'talking' ? 8.0 : 3.0;
      const scale = 1.0 + Math.sin(t * pulseSpeed) * 0.15;
      coreRef.current.scale.set(scale, scale, scale);
    }

    // Visor soundwave / expression animation
    if (visorRef.current) {
      const mat = visorRef.current.material as THREE.MeshStandardMaterial;
      if (emotion === 'talking') {
        mat.emissiveIntensity = 1.5 + Math.sin(t * 12.0) * 0.8;
      } else if (emotion === 'thinking') {
        mat.emissiveIntensity = 1.0 + Math.sin(t * 4.0) * 0.5;
      } else {
        mat.emissiveIntensity = 0.9;
      }
    }
  });

  const coreColor = envState.powerState === 'online' ? '#00e5ff' : '#ff2a5f';

  return (
    <group ref={groupRef} position={[0, 1.2, 0]}>
      {/* Head Unit */}
      <mesh ref={headRef} position={[0, 0.45, 0]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Holographic Visor */}
      <mesh ref={visorRef} position={[0, 0.45, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.1, 32]} />
        <meshStandardMaterial
          color={coreColor}
          emissive={coreColor}
          emissiveIntensity={1.2}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Floating Torso Chassis */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.15, 0.22, 0.45, 6]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.3}
          metalness={0.85}
        />
      </mesh>

      {/* Central Glowing Core */}
      <mesh ref={coreRef} position={[0, 0.08, 0.08]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial
          color={coreColor}
          emissive={coreColor}
          emissiveIntensity={2.0}
        />
      </mesh>

      {/* Floating Gyroscopic Rings */}
      <mesh ref={leftRingRef} position={[0, 0.05, 0]}>
        <torusGeometry args={[0.32, 0.015, 16, 48]} />
        <meshStandardMaterial
          color={coreColor}
          emissive={coreColor}
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.95}
        />
      </mesh>

      <mesh ref={rightRingRef} position={[0, 0.05, 0]}>
        <torusGeometry args={[0.38, 0.012, 16, 48]} />
        <meshStandardMaterial
          color="#94a3b8"
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
    </group>
  );
}

// ----------------------------------------------------
// Aethelgard Command Bridge Environment
// ----------------------------------------------------
function BridgeDeck() {
  const envState = useStore((s) => s.environmentState);
  const reactorRef = useRef<any>(null);
  const emergencyLightRef = useRef<any>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Reactor turbine spinning speed
    if (reactorRef.current) {
      reactorRef.current.rotation.z += 0.02 * envState.reactorRotationSpeed;
    }

    // Emergency beacon pulse
    if (emergencyLightRef.current) {
      if (envState.powerState === 'emergency') {
        emergencyLightRef.current.intensity = 2.0 + Math.sin(t * 4.0) * 1.8;
      } else {
        emergencyLightRef.current.intensity = 0.5;
      }
    }
  });

  const neonColor = envState.powerState === 'online' ? '#00e5ff' : '#ff2a5f';
  const ambientCol = envState.powerState === 'online' ? '#0369a1' : '#450a0a';

  return (
    <group>
      {/* Floor Deck with Hexagonal Panels */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[8, 8, 0.1, 32]} />
        <meshStandardMaterial
          color="#070c18"
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>

      {/* Emissive Neon Deck Ring */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.2, 3.26, 64]} />
        <meshBasicMaterial color={neonColor} />
      </mesh>

      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5.5, 5.58, 64]} />
        <meshBasicMaterial color={neonColor} />
      </mesh>

      {/* Holographic Console Pods */}
      {[-2.2, 2.2].map((x, i) => (
        <group key={i} position={[x, 0.5, 1.5]} rotation={[0, x > 0 ? -0.4 : 0.4, 0]}>
          <mesh>
            <boxGeometry args={[1.2, 0.8, 0.6]} />
            <meshStandardMaterial color="#0b1329" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.45, 0]} rotation={[-0.3, 0, 0]}>
            <planeGeometry args={[1.0, 0.4]} />
            <meshBasicMaterial color={neonColor} transparent opacity={0.65} />
          </mesh>
        </group>
      ))}

      {/* Massive Rear Reactor Turbine */}
      <group position={[0, 2.2, -5.5]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[2.8, 2.8, 0.6, 32]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
        </mesh>
        <group ref={reactorRef}>
          {[0, 1, 2, 3, 4, 5].map((idx) => (
            <mesh key={idx} rotation={[0, 0, (idx * Math.PI) / 3]}>
              <boxGeometry args={[0.2, 4.2, 0.1]} />
              <meshStandardMaterial
                color={neonColor}
                emissive={neonColor}
                emissiveIntensity={1.2}
              />
            </mesh>
          ))}
        </group>
        <pointLight
          color={neonColor}
          intensity={envState.powerState === 'online' ? 5.0 : 1.5}
          distance={10}
        />
      </group>

      {/* Emergency Beacon Point Light */}
      <pointLight
        ref={emergencyLightRef}
        position={[0, 3.8, 0]}
        color={envState.primaryColor}
        distance={12}
      />

      {/* Ambient Lighting */}
      <ambientLight color={ambientCol} intensity={envState.ambientIntensity} />
      <directionalLight position={[5, 8, 5]} intensity={0.6} color="#ffffff" castShadow />
    </group>
  );
}

// ----------------------------------------------------
// Main 3D Canvas Scene
// ----------------------------------------------------
export function StationBridgeScene() {
  const currentScene = useStore((s) => s.currentScene);
  const currentDialogue = useStore((s) => s.currentDialogue);
  const preferences = useStore((s) => s.preferences);

  const presetKey = preferences.qualityPreset === 'auto' ? 'medium' : preferences.qualityPreset;
  const config = QUALITY_PRESETS[presetKey] || QUALITY_PRESETS.medium;

  const currentEmotion = currentDialogue?.emotion || 'idle';

  return (
    <div className="relative w-full h-full min-h-[480px] bg-slate-950 overflow-hidden select-none">
      <Canvas
        camera={{ position: [0, 2.5, 6.0], fov: 45 }}
        dpr={config.dpr}
        shadows={config.shadows}
        gl={{ antialias: config.antialias, alpha: false }}
      >
        <color attach="background" args={['#020617']} />

        {/* Orbit Space Stars */}
        <Stars
          radius={50}
          depth={40}
          count={config.particleCount}
          factor={4}
          saturation={0}
          fade
          speed={0.8}
        />

        {/* Camera Choreographer */}
        <CameraDolly />

        {/* Orbital Station Environment */}
        <BridgeDeck />

        {/* ARIA 3D Character */}
        <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.3}>
          <AriaCharacter emotion={currentEmotion} />
        </Float>

        {/* Subtle manual camera rotation controls for user exploration */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minPolarAngle={Math.PI / 4}
          maxAzimuthAngle={Math.PI / 5}
          minAzimuthAngle={-Math.PI / 5}
        />
      </Canvas>
    </div>
  );
}
