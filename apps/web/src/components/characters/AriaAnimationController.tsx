'use client';

import React, { useState, useCallback } from 'react';
import { AriaCharacter, AriaAnimationState } from './AriaCharacter';

interface AriaAnimationControllerProps {
  initialState?: AriaAnimationState;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  onLoaded?: (info: { animationNames: string[]; meshCount: number }) => void;
  // External override if driven by cutscene timeline
  stateOverride?: AriaAnimationState;
}

export function AriaAnimationController({
  initialState = 'idle',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onLoaded,
  stateOverride,
}: AriaAnimationControllerProps) {
  const [internalState, setInternalState] = useState<AriaAnimationState>(initialState);

  // If external state override is passed, prioritize it; otherwise use internal state
  const activeState = stateOverride || internalState;

  // Handler for one-shot animation completion: gracefully cross-fade back to idle
  const handleAnimationComplete = useCallback((clipName: string) => {
    if (clipName === 'ARIA_Surprised' || clipName === 'ARIA_Mission_Success' || clipName === 'ARIA_Happy') {
      setInternalState('idle');
    }
  }, []);

  return (
    <AriaCharacter
      currentAnimation={activeState}
      position={position}
      rotation={rotation}
      scale={scale}
      onAnimationComplete={handleAnimationComplete}
      onLoaded={onLoaded}
    />
  );
}
