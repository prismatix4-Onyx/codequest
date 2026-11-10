'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CINEMATIC_SHOTS, CinematicShot } from '@/components/story/CinematicTimeline';

interface CinematicCameraProps {
  currentTime: number;
  isPlaying: boolean;
  manualOverride?: boolean;
}

export function CinematicCamera({ currentTime, isPlaying }: CinematicCameraProps) {
  useFrame(({ camera }) => {
    // Find active shot based on currentTime
    const shot =
      CINEMATIC_SHOTS.find((s) => currentTime >= s.startTime && currentTime < s.endTime) ||
      CINEMATIC_SHOTS[CINEMATIC_SHOTS.length - 1];

    if (!shot) return;

    // Calculate shot progress (0.0 to 1.0)
    const shotDuration = shot.endTime - shot.startTime;
    const rawProgress = Math.max(0, Math.min(1, (currentTime - shot.startTime) / shotDuration));
    // Smooth easeInOut cubic interpolation
    const easeProgress =
      rawProgress < 0.5
        ? 4 * rawProgress * rawProgress * rawProgress
        : 1 - Math.pow(-2 * rawProgress + 2, 3) / 2;

    // Interpolate target position
    const targetX = THREE.MathUtils.lerp(shot.cameraStart[0], shot.cameraEnd[0], easeProgress);
    const targetY = THREE.MathUtils.lerp(shot.cameraStart[1], shot.cameraEnd[1], easeProgress);
    const targetZ = THREE.MathUtils.lerp(shot.cameraStart[2], shot.cameraEnd[2], easeProgress);

    // Interpolate target lookAt
    const lookX = THREE.MathUtils.lerp(shot.lookAtStart[0], shot.lookAtEnd[0], easeProgress);
    const lookY = THREE.MathUtils.lerp(shot.lookAtStart[1], shot.lookAtEnd[1], easeProgress);
    const lookZ = THREE.MathUtils.lerp(shot.lookAtStart[2], shot.lookAtEnd[2], easeProgress);

    // Smooth lerp actual camera position and orientation directly via scalar coordinates
    camera.position.x += (targetX - camera.position.x) * 0.12;
    camera.position.y += (targetY - camera.position.y) * 0.12;
    camera.position.z += (targetZ - camera.position.z) * 0.12;
    camera.lookAt(lookX, lookY, lookZ);
  });

  return null;
}
