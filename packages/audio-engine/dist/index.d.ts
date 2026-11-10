import type { SubtitleCue } from '@codequest/shared-types';
export interface AudioEngineOptions {
    voiceVolume?: number;
    musicVolume?: number;
    sfxVolume?: number;
    isMuted?: boolean;
}
export type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';
export interface AudioPlaybackListener {
    onStateChange?: (state: PlaybackState) => void;
    onTimeUpdate?: (currentTimeMs: number, durationMs: number) => void;
    onActiveSubtitle?: (subtitle: SubtitleCue | null) => void;
    onEnded?: () => void;
    onError?: (error: string) => void;
}
export declare class AudioEngine {
    private voiceVolume;
    private musicVolume;
    private sfxVolume;
    private isMuted;
    private voiceAudioElement;
    private musicAudioElement;
    private activeSubtitles;
    private state;
    private listeners;
    private timeUpdateInterval;
    constructor(options?: AudioEngineOptions);
    subscribe(listener: AudioPlaybackListener): () => void;
    setVoiceVolume(vol: number): void;
    setMusicVolume(vol: number): void;
    toggleMute(): boolean;
    playVoice(audioUrl: string, subtitles?: SubtitleCue[], fallbackText?: string): Promise<void>;
    pauseVoice(): void;
    resumeVoice(): void;
    stopVoice(): void;
    getState(): PlaybackState;
    private setState;
    private startSubtitleTracking;
    private clearSubtitleTracking;
    private executeVoiceFallback;
}
//# sourceMappingURL=index.d.ts.map