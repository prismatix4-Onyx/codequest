"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentStateManager = exports.WebGLDetector = exports.QUALITY_PRESETS = void 0;
exports.QUALITY_PRESETS = {
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
class WebGLDetector {
    static isSupported() {
        if (typeof window === 'undefined')
            return false;
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext &&
                (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        }
        catch {
            return false;
        }
    }
    static detectOptimalPreset() {
        if (typeof window === 'undefined')
            return 'medium';
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
exports.WebGLDetector = WebGLDetector;
class EnvironmentStateManager {
    state;
    listeners = [];
    constructor(initialState) {
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
    subscribe(listener) {
        this.listeners.push(listener);
        listener(this.state);
        return () => {
            this.listeners = this.listeners.filter((l) => l !== listener);
        };
    }
    getState() {
        return { ...this.state };
    }
    restorePower() {
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
    setEmergency() {
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
    notify() {
        this.listeners.forEach((l) => l(this.state));
    }
}
exports.EnvironmentStateManager = EnvironmentStateManager;
//# sourceMappingURL=index.js.map