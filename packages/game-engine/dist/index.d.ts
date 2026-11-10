export interface QualityPresetConfig {
    dpr: number;
    shadows: boolean;
    antialias: boolean;
    bloom: boolean;
    maxLights: number;
    particleCount: number;
}
export declare const QUALITY_PRESETS: Record<'low' | 'medium' | 'high', QualityPresetConfig>;
export declare class WebGLDetector {
    static isSupported(): boolean;
    static detectOptimalPreset(): 'low' | 'medium' | 'high';
}
export interface EnvironmentVisualState {
    powerState: 'offline' | 'emergency' | 'online';
    primaryColor: string;
    secondaryColor: string;
    ambientIntensity: number;
    reactorRotationSpeed: number;
    smokeEnabled: boolean;
    statusText: string;
}
export declare class EnvironmentStateManager {
    private state;
    private listeners;
    constructor(initialState?: Partial<EnvironmentVisualState>);
    subscribe(listener: (state: EnvironmentVisualState) => void): () => void;
    getState(): EnvironmentVisualState;
    restorePower(): void;
    setEmergency(): void;
    private notify;
}
//# sourceMappingURL=index.d.ts.map