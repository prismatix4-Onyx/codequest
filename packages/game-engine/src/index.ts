import type {
  CameraShotConfig,
  CharacterEmotion,
  UserPreferences,
} from '@codequest/shared-types';

export interface QualityPresetConfig {
  dpr: number;
  shadows: boolean;
  antialias: boolean;
  bloom: boolean;
  maxLights: number;
  particleCount: number;
}

export const QUALITY_PRESETS: Record<'low' | 'medium' | 'high', QualityPresetConfig> = {
  low: {
    dpr: 1.0,
    shadows: false,
    antialias: false,
    bloom: false,
    maxLights: 2,
    particleCount: 100,
  },
  medium: {
    dpr: 1.5,
    shadows: true,
    antialias: true,
    bloom: false,
    maxLights: 4,
    particleCount: 400,
  },
  high: {
    dpr: 2.0,
    shadows: true,
    antialias: true,
    bloom: true,
    maxLights: 8,
    particleCount: 1000,
  },
};

export class WebGLDetector {
  public static isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch {
      return false;
    }
  }

  public static detectOptimalPreset(): 'low' | 'medium' | 'high' {
    if (typeof window === 'undefined') return 'medium';

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const cores = navigator.hardwareConcurrency || 4;

    if (isMobile || cores <= 4) {
      return 'low';
    }
    if (cores >= 8) {
      return 'high';
    }
    return 'medium';
  }
}

export interface EnvironmentVisualState {
  powerState: 'offline' | 'emergency' | 'online';
  primaryColor: string; // e.g. '#ff3344' for emergency, '#00d2ff' for online
  secondaryColor: string;
  ambientIntensity: number;
  reactorRotationSpeed: number;
  smokeEnabled: boolean;
  statusText: string;
}

export class EnvironmentStateManager {
  private state: EnvironmentVisualState;
  private listeners: ((state: EnvironmentVisualState) => void)[] = [];

  constructor(initialState?: Partial<EnvironmentVisualState>) {
    this.state = {
      powerState: initialState?.powerState || 'emergency',
      primaryColor: initialState?.primaryColor || '#ff2a5f', // Emergency crimson
      secondaryColor: initialState?.secondaryColor || '#ff8800',
      ambientIntensity: initialState?.ambientIntensity || 0.35,
      reactorRotationSpeed: initialState?.reactorRotationSpeed || 0.2,
      smokeEnabled: initialState?.smokeEnabled ?? true,
      statusText: initialState?.statusText || 'EMERGENCY PROTOCOL ACTIVE',
    };
  }

  public subscribe(listener: (state: EnvironmentVisualState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public getState(): EnvironmentVisualState {
    return { ...this.state };
  }

  public restorePower(): void {
    this.state = {
      powerState: 'online',
      primaryColor: '#00e5ff', // Cyber cyan
      secondaryColor: '#3d5afe',
      ambientIntensity: 0.9,
      reactorRotationSpeed: 2.5,
      smokeEnabled: false,
      statusText: 'ALL SYSTEMS NOMINAL — LIFE SUPPORT ACTIVE',
    };
    this.notify();
  }

  public setEmergency(): void {
    this.state = {
      powerState: 'emergency',
      primaryColor: '#ff2a5f',
      secondaryColor: '#ff8800',
      ambientIntensity: 0.35,
      reactorRotationSpeed: 0.2,
      smokeEnabled: true,
      statusText: 'CRITICAL FAILURE — AUXILIARY POWER ONLY',
    };
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((l) => l(this.state));
  }
}
