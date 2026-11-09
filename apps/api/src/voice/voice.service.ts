import { Injectable } from '@nestjs/common';
import type { VoiceProfile, GeneratedVoiceAudio } from '@codequest/shared-types';

@Injectable()
export class VoiceService {
  private profiles: VoiceProfile[] = [
    {
      characterId: 'aria',
      provider: 'edge-tts',
      voiceId: 'en-US-AriaNeural',
      language: 'en-US',
      rate: '+0%',
      pitch: '+2Hz',
      volume: '+0%',
      personality: 'Friendly, precise, and supportive AI companion.',
      preferredStyle: 'empathetic',
    },
    {
      characterId: 'kael',
      provider: 'edge-tts',
      voiceId: 'en-US-GuyNeural',
      language: 'en-US',
      rate: '+5%',
      pitch: '+0Hz',
      volume: '+0%',
      personality: 'Energetic, bold explorer.',
      preferredStyle: 'adventurous',
    },
    {
      characterId: 'orion',
      provider: 'edge-tts',
      voiceId: 'en-US-ChristopherNeural',
      language: 'en-US',
      rate: '-5%',
      pitch: '-4Hz',
      volume: '+0%',
      personality: 'Experienced, grounded systems mentor.',
      preferredStyle: 'authoritative',
    },
    {
      characterId: 'nyx',
      provider: 'edge-tts',
      voiceId: 'en-GB-SoniaNeural',
      language: 'en-GB',
      rate: '-2%',
      pitch: '-2Hz',
      volume: '-5%',
      personality: 'Mysterious, sharp, enigmatic antagonist.',
      preferredStyle: 'whispering',
    },
    {
      characterId: 'echo',
      provider: 'edge-tts',
      voiceId: 'en-US-EricNeural',
      language: 'en-US',
      rate: '+8%',
      pitch: '+10Hz',
      volume: '-2%',
      personality: 'Fastidious robotic utility drone.',
      preferredStyle: 'robotic',
    },
  ];

  getProfiles(): VoiceProfile[] {
    return this.profiles;
  }

  async synthesize(characterId: string, text: string): Promise<GeneratedVoiceAudio> {
    const serviceUrl = process.env.VOICE_SERVICE_URL || 'http://localhost:8001';

    try {
      const res = await fetch(`${serviceUrl}/synthesize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characterId, text }),
      });

      if (!res.ok) {
        throw new Error(`Voice service HTTP ${res.status}`);
      }

      const data = await res.json();
      return {
        audioId: data.audioId,
        audioUrl: `${serviceUrl}${data.audioUrl}`,
        contentHash: data.contentHash,
        characterId: data.characterId,
        text: data.text,
        durationMs: data.durationMs,
        subtitles: data.subtitles,
      };
    } catch (err) {
      console.warn('Voice service connection notice:', (err as Error).message);
      // Fallback response with simulated timed subtitles
      const words = text.split(' ');
      const durationMs = Math.max(3000, words.length * 350);
      const stepMs = Math.floor(durationMs / Math.max(1, words.length));

      return {
        audioId: `fallback-${Date.now()}`,
        audioUrl: '',
        contentHash: 'fallback',
        characterId,
        text,
        durationMs,
        subtitles: words.map((w, idx) => ({
          startMs: idx * stepMs,
          endMs: (idx + 1) * stepMs,
          text: w,
        })),
      };
    }
  }
}
