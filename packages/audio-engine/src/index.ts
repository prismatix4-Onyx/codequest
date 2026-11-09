import type { SubtitleCue } from '@codequest/shared-types';

export interface AudioEngineOptions {
  voiceVolume?: number; // 0.0 - 1.0
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

export class AudioEngine {
  private voiceVolume: number = 0.8;
  private musicVolume: number = 0.5;
  private sfxVolume: number = 0.7;
  private isMuted: boolean = false;

  private voiceAudioElement: HTMLAudioElement | null = null;
  private musicAudioElement: HTMLAudioElement | null = null;
  private activeSubtitles: SubtitleCue[] = [];
  private state: PlaybackState = 'idle';
  private listeners: AudioPlaybackListener[] = [];
  private timeUpdateInterval: any = null;

  constructor(options?: AudioEngineOptions) {
    if (options) {
      this.voiceVolume = options.voiceVolume ?? 0.8;
      this.musicVolume = options.musicVolume ?? 0.5;
      this.sfxVolume = options.sfxVolume ?? 0.7;
      this.isMuted = options.isMuted ?? false;
    }
  }

  public subscribe(listener: AudioPlaybackListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public setVoiceVolume(vol: number): void {
    this.voiceVolume = Math.max(0, Math.min(1, vol));
    if (this.voiceAudioElement) {
      this.voiceAudioElement.volume = this.isMuted ? 0 : this.voiceVolume;
    }
  }

  public setMusicVolume(vol: number): void {
    this.musicVolume = Math.max(0, Math.min(1, vol));
    if (this.musicAudioElement) {
      this.musicAudioElement.volume = this.isMuted ? 0 : this.musicVolume;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.voiceAudioElement) {
      this.voiceAudioElement.volume = this.isMuted ? 0 : this.voiceVolume;
    }
    if (this.musicAudioElement) {
      this.musicAudioElement.volume = this.isMuted ? 0 : this.musicVolume;
    }
    return this.isMuted;
  }

  public async playVoice(
    audioUrl: string,
    subtitles: SubtitleCue[] = [],
    fallbackText?: string
  ): Promise<void> {
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
          this.voiceAudioElement?.play().then(
            () => this.setState('playing'),
            (err) => {
              // Autoplay policy prevented playback until user interaction
              console.warn('Autoplay blocked voice playback:', err);
              this.setState('idle');
            }
          );
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
    } catch (err: any) {
      this.executeVoiceFallback(fallbackText);
    }
  }

  public pauseVoice(): void {
    if (this.voiceAudioElement && !this.voiceAudioElement.paused) {
      this.voiceAudioElement.pause();
      this.setState('paused');
    }
  }

  public resumeVoice(): void {
    if (this.voiceAudioElement && this.voiceAudioElement.paused) {
      this.voiceAudioElement.play().then(() => this.setState('playing'));
    }
  }

  public stopVoice(): void {
    this.clearSubtitleTracking();
    if (this.voiceAudioElement) {
      this.voiceAudioElement.pause();
      this.voiceAudioElement.currentTime = 0;
      this.voiceAudioElement = null;
    }
    this.setState('idle');
  }

  public getState(): PlaybackState {
    return this.state;
  }

  private setState(newState: PlaybackState): void {
    this.state = newState;
    this.listeners.forEach((l) => l.onStateChange?.(newState));
  }

  private startSubtitleTracking(): void {
    this.clearSubtitleTracking();
    if (typeof window === 'undefined') return;

    this.timeUpdateInterval = setInterval(() => {
      if (!this.voiceAudioElement) return;
      const curMs = this.voiceAudioElement.currentTime * 1000;
      const durMs = (this.voiceAudioElement.duration || 0) * 1000;

      this.listeners.forEach((l) => l.onTimeUpdate?.(curMs, durMs));

      // Find active cue
      const activeCue =
        this.activeSubtitles.find((c) => curMs >= c.startMs && curMs <= c.endMs) || null;
      this.listeners.forEach((l) => l.onActiveSubtitle?.(activeCue));
    }, 50);
  }

  private clearSubtitleTracking(): void {
    if (this.timeUpdateInterval) {
      clearInterval(this.timeUpdateInterval);
      this.timeUpdateInterval = null;
    }
    this.listeners.forEach((l) => l.onActiveSubtitle?.(null));
  }

  private executeVoiceFallback(fallbackText?: string): void {
    this.clearSubtitleTracking();
    this.setState('error');
    this.listeners.forEach((l) =>
      l.onError?.('Audio stream offline. Falling back to visual text display.')
    );

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
