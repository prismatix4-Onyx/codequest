import { AriaAnimationState } from '@/components/characters/AriaCharacter';
import { ReactorState } from '@/components/props/ReactorCore';

export interface CinematicShot {
  id: number;
  name: string;
  startTime: number; // in seconds
  endTime: number;   // in seconds
  cameraStart: [number, number, number];
  cameraEnd: [number, number, number];
  lookAtStart: [number, number, number];
  lookAtEnd: [number, number, number];
  ariaAnimation: AriaAnimationState;
  reactorState: ReactorState;
  dialogue?: {
    speaker: string;
    text: string;
  };
  missionPrompt?: {
    title: string;
    subtitle: string;
  };
}

export const CINEMATIC_SHOTS: CinematicShot[] = [
  // Shot 1: Exterior Establishing (0.0s - 4.5s)
  {
    id: 1,
    name: 'Exterior Establishing',
    startTime: 0,
    endTime: 4.5,
    cameraStart: [0, 5.5, 14.0],
    cameraEnd: [0, 2.5, 6.5],
    lookAtStart: [0, 1.5, 0],
    lookAtEnd: [0, 1.2, 0],
    ariaAnimation: 'idle',
    reactorState: 'critical',
  },

  // Shot 2: Bridge Reveal (4.5s - 9.5s)
  {
    id: 2,
    name: 'Bridge Reveal',
    startTime: 4.5,
    endTime: 9.5,
    cameraStart: [2.5, 2.2, 4.5],
    cameraEnd: [0.8, 1.6, 3.2],
    lookAtStart: [0, 1.2, -1.0],
    lookAtEnd: [0, 1.1, -1.5],
    ariaAnimation: 'idle',
    reactorState: 'critical',
    dialogue: {
      speaker: 'ORPHEUS AI SYSTEM',
      text: '[CRITICAL WARNING]: Main Reactor containment integrity failing. Automated restoration failed.',
    },
  },

  // Shot 3: ARIA Activation (9.5s - 14.0s)
  {
    id: 3,
    name: 'ARIA Activation',
    startTime: 9.5,
    endTime: 14.0,
    cameraStart: [0, 1.35, 2.8],
    cameraEnd: [0, 1.22, 1.85],
    lookAtStart: [0, 1.2, 0],
    lookAtEnd: [0, 1.2, 0],
    ariaAnimation: 'surprised',
    reactorState: 'critical',
    dialogue: {
      speaker: 'ARIA',
      text: '(Pedestal hums with cyan resonance as ARIA visual cortex initializes)',
    },
  },

  // Shot 4: First Dialogue (14.0s - 20.0s)
  {
    id: 4,
    name: 'First Dialogue',
    startTime: 14.0,
    endTime: 20.0,
    cameraStart: [0, 1.22, 1.85],
    cameraEnd: [-0.25, 1.26, 1.65],
    lookAtStart: [0, 1.2, 0],
    lookAtEnd: [0, 1.2, 0],
    ariaAnimation: 'talking',
    reactorState: 'critical',
    dialogue: {
      speaker: 'ARIA',
      text: "Oh! You're awake. That's... unexpected. Welcome aboard ORPHEUS.",
    },
  },

  // Shot 5: Reactor Emergency (20.0s - 25.5s)
  {
    id: 5,
    name: 'Reactor Emergency',
    startTime: 20.0,
    endTime: 25.5,
    cameraStart: [0.6, 1.6, 1.5],
    cameraEnd: [0, 1.8, -1.0],
    lookAtStart: [0, 1.2, 0],
    lookAtEnd: [0, 1.1, -3.5],
    ariaAnimation: 'concerned',
    reactorState: 'critical',
    dialogue: {
      speaker: 'ARIA',
      text: 'I would love to explain everything, but our reactor is about to become a very expensive firework.',
    },
  },

  // Shot 6: Mission Interface (25.5s - 30.0s)
  {
    id: 6,
    name: 'Mission Interface',
    startTime: 25.5,
    endTime: 30.0,
    cameraStart: [1.2, 1.6, 2.0],
    cameraEnd: [1.6, 1.3, 1.4],
    lookAtStart: [1.8, 1.1, 0.8],
    lookAtEnd: [1.8, 1.1, 0.8],
    ariaAnimation: 'mission_success',
    reactorState: 'critical',
    dialogue: {
      speaker: 'ARIA',
      text: 'Access the reactor terminal. Execute the stabilization sequence before thermal runaway occurs.',
    },
    missionPrompt: {
      title: 'FIRST MISSION',
      subtitle: 'RESTORE REACTOR STABILITY',
    },
  },
];

export const TOTAL_CINEMATIC_DURATION = 30.0;
