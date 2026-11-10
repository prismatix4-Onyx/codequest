"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioEngine = void 0;
class AudioEngine {
    voiceVolume = 0.8;
    musicVolume = 0.5;
    sfxVolume = 0.7;
    isMuted = false;
    voiceAudioElement = null;
    musicAudioElement = null;
    activeSubtitles = [];
    state = 'idle';
    listeners = [];
    timeUpdateInterval = null;
    constructor(options) {
        if (options) {
            this.voiceVolume = options.voiceVolume ?? 0.8;
            this.musicVolume = options.musicVolume ?? 0.5;
            this.sfxVolume = options.sfxVolume ?? 0.7;
            this.isMuted = options.isMuted ?? false;
        }
    }
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter((l) => l !== listener);
        };
    }
    setVoiceVolume(vol) {
        this.voiceVolume = Math.max(0, Math.min(1, vol));
        if (this.voiceAudioElement) {
            this.voiceAudioElement.volume = this.isMuted ? 0 : this.voiceVolume;
        }
    }
    setMusicVolume(vol) {
        this.musicVolume = Math.max(0, Math.min(1, vol));
        if (this.musicAudioElement) {
            this.musicAudioElement.volume = this.isMuted ? 0 : this.musicVolume;
        }
    }
    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.voiceAudioElement) {
            this.voiceAudioElement.volume = this.isMuted ? 0 : this.voiceVolume;
        }
        if (this.musicAudioElement) {
            this.musicAudioElement.volume = this.isMuted ? 0 : this.musicVolume;
        }
        return this.isMuted;
    }
    async playVoice(audioUrl, subtitles = [], fallbackText) {
        this.stopVoice();
        this.activeSubtitles = subtitles.sort((a, b) => a.startMs - b.startMs);
        this.setState('loading');
        if (typeof window === 'undefined' || typeof Audio === 'undefined') {
            // Server-side environment mock
            this.setState('playing');
            setTimeout(() => {
                this.setState('idle');
                this.listeners.forEach((l) => l.onEnded?.());
            }, 3000);
            return;
        }
        try {
            this.voiceAudioElement = new Audio(audioUrl);
            this.voiceAudioElement.volume = this.isMuted ? 0 : this.voiceVolume;
            this.voiceAudioElement.addEventListener('canplaythrough', () => {
                if (this.state === 'loading') {
                    this.voiceAudioElement?.play().then(() => this.setState('playing'), (err) => {
                        // Autoplay policy prevented playback until user interaction
                        console.warn('Autoplay blocked voice playback:', err);
                        this.setState('idle');
                    });
                }
            });
            this.voiceAudioElement.addEventListener('ended', () => {
                this.clearSubtitleTracking();
                this.setState('idle');
                this.listeners.forEach((l) => l.onEnded?.());
            });
            this.voiceAudioElement.addEventListener('error', () => {
                console.warn(`Audio asset failed to load (${audioUrl}). Executing error fallback.`);
                this.executeVoiceFallback(fallbackText);
            });
            this.startSubtitleTracking();
        }
        catch (err) {
            this.executeVoiceFallback(fallbackText);
        }
    }
    pauseVoice() {
        if (this.voiceAudioElement && !this.voiceAudioElement.paused) {
            this.voiceAudioElement.pause();
            this.setState('paused');
        }
    }
    resumeVoice() {
        if (this.voiceAudioElement && this.voiceAudioElement.paused) {
            this.voiceAudioElement.play().then(() => this.setState('playing'));
        }
    }
    stopVoice() {
        this.clearSubtitleTracking();
        if (this.voiceAudioElement) {
            this.voiceAudioElement.pause();
            this.voiceAudioElement.currentTime = 0;
            this.voiceAudioElement = null;
        }
        this.setState('idle');
    }
    getState() {
        return this.state;
    }
    setState(newState) {
        this.state = newState;
        this.listeners.forEach((l) => l.onStateChange?.(newState));
    }
    startSubtitleTracking() {
        this.clearSubtitleTracking();
        if (typeof window === 'undefined')
            return;
        this.timeUpdateInterval = setInterval(() => {
            if (!this.voiceAudioElement)
                return;
            const curMs = this.voiceAudioElement.currentTime * 1000;
            const durMs = (this.voiceAudioElement.duration || 0) * 1000;
            this.listeners.forEach((l) => l.onTimeUpdate?.(curMs, durMs));
            // Find active cue
            const activeCue = this.activeSubtitles.find((c) => curMs >= c.startMs && curMs <= c.endMs) || null;
            this.listeners.forEach((l) => l.onActiveSubtitle?.(activeCue));
        }, 50);
    }
    clearSubtitleTracking() {
        if (this.timeUpdateInterval) {
            clearInterval(this.timeUpdateInterval);
            this.timeUpdateInterval = null;
        }
        this.listeners.forEach((l) => l.onActiveSubtitle?.(null));
    }
    executeVoiceFallback(fallbackText) {
        this.clearSubtitleTracking();
        this.setState('error');
        this.listeners.forEach((l) => l.onError?.('Audio stream offline. Falling back to visual text display.'));
        // If fallback text provided, simulate timed subtitle reading duration
        if (fallbackText) {
            const readingDurationMs = Math.max(2500, fallbackText.split(' ').length * 350);
            this.setState('playing');
            setTimeout(() => {
                this.setState('idle');
                this.listeners.forEach((l) => l.onEnded?.());
            }, readingDurationMs);
        }
    }
}
exports.AudioEngine = AudioEngine;
//# sourceMappingURL=index.js.map