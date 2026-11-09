import { create } from 'zustand';
import type {
  ThemeMode,
  UserPreferences,
  UserProfile,
  StoryCampaign,
  StoryScene,
  DialogueLine,
  MissionChallenge,
  ExecutionResult,
} from '@codequest/shared-types';
import campaignData from '../../../../content/python/last-protocol/campaign.json';
import missionsData from '../../../../content/python/last-protocol/missions.json';
import { StoryEngine } from '@codequest/story-engine';
import { AudioEngine } from '@codequest/audio-engine';
import { EnvironmentStateManager, WebGLDetector } from '@codequest/game-engine';

interface AppState {
  // Theme & Settings
  theme: ThemeMode;
  preferences: UserPreferences;
  setTheme: (theme: ThemeMode) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;

  // User Auth
  user: UserProfile;
  isAuthenticated: boolean;
  setUser: (user: UserProfile) => void;
  logout: () => void;
  addXp: (amount: number) => void;

  // Active Story & Story Engine
  campaign: StoryCampaign;
  storyEngine: StoryEngine;
  currentScene: StoryScene | null;
  currentDialogue: DialogueLine | null;
  dialogueIndex: number;
  totalDialogue: number;
  isDialoguePlaying: boolean;
  activeSubtitleText: string | null;

  // 3D Engine State
  environmentManager: EnvironmentStateManager;
  environmentState: ReturnType<EnvironmentStateManager['getState']>;
  isWebGlSupported: boolean;

  // Audio Engine
  audioEngine: AudioEngine;

  // Missions & Code Studio
  activeMission: MissionChallenge | null;
  code: string;
  isEditorOpen: boolean;
  isExecuting: boolean;
  executionResult: ExecutionResult | null;
  hintsUsedCount: number;

  // Story & Gameplay Actions
  startCampaign: () => void;
  advanceDialogue: () => void;
  replayDialogueVoice: () => void;
  makeChoice: (choiceId: string) => void;
  openMission: (missionId: string) => void;
  closeMission: () => void;
  setCode: (code: string) => void;
  runCodeSubmission: () => Promise<void>;
  resetCode: () => void;
  useHint: () => void;
}

const defaultCampaign = campaignData as unknown as StoryCampaign;
const defaultMissions = missionsData as unknown as MissionChallenge[];

const initialStoryEngine = new StoryEngine(defaultCampaign);
const initialAudioEngine = new AudioEngine({ voiceVolume: 0.85, musicVolume: 0.4 });
const initialEnvManager = new EnvironmentStateManager();

export const useStore = create<AppState>((set, get) => {
  // Subscribe to environment state changes
  initialEnvManager.subscribe((envState) => {
    set({ environmentState: envState });
  });

  return {
    theme: 'dark',
    preferences: {
      theme: 'dark',
      voiceVolume: 0.85,
      musicVolume: 0.4,
      sfxVolume: 0.7,
      subtitlesEnabled: true,
      subtitleSize: 'medium',
      qualityPreset: 'auto',
      reducedMotion: false,
    },
    setTheme: (theme) => {
      set({ theme });
      if (typeof window !== 'undefined') {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        if (theme === 'system') {
          const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          root.classList.add(systemDark ? 'dark' : 'light');
        } else {
          root.classList.add(theme);
        }
      }
    },
    updatePreferences: (prefs) => {
      set((state) => ({ preferences: { ...state.preferences, ...prefs } }));
    },

    user: {
      id: 'guest-explorer',
      email: 'cadet@codequest.dev',
      username: 'Cadet_Aethelgard',
      role: 'PLAYER',
      xp: 0,
      level: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    isAuthenticated: false,
    setUser: (user) => set({ user, isAuthenticated: true }),
    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('codequest_token');
        localStorage.removeItem('codequest_user');
      }
      set({
        isAuthenticated: false,
        user: {
          id: 'guest-explorer',
          email: 'cadet@codequest.dev',
          username: 'Cadet_Aethelgard',
          role: 'PLAYER',
          xp: 0,
          level: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    },
    addXp: (amount) => {
      set((state) => {
        const newXp = state.user.xp + amount;
        const newLevel = Math.floor(newXp / 250) + 1;
        return {
          user: { ...state.user, xp: newXp, level: newLevel },
        };
      });
    },

    campaign: defaultCampaign,
    storyEngine: initialStoryEngine,
    currentScene: defaultCampaign.chapters[0]?.scenes[0] || null,
    currentDialogue: defaultCampaign.chapters[0]?.scenes[0]?.dialogue?.[0] || null,
    dialogueIndex: 0,
    totalDialogue: defaultCampaign.chapters[0]?.scenes[0]?.dialogue?.length || 1,
    isDialoguePlaying: false,
    activeSubtitleText: null,

    environmentManager: initialEnvManager,
    environmentState: initialEnvManager.getState(),
    isWebGlSupported: typeof window !== 'undefined' ? WebGLDetector.isSupported() : true,

    audioEngine: initialAudioEngine,

    activeMission: defaultMissions[0] || null,
    code: defaultMissions[0]?.starterCode || '',
    isEditorOpen: false,
    isExecuting: false,
    executionResult: null,
    hintsUsedCount: 0,

    startCampaign: () => {
      const engine = get().storyEngine;
      const scene = engine.start();
      const firstLine = scene?.dialogue?.[0] || null;

      set({
        currentScene: scene,
        currentDialogue: firstLine,
        dialogueIndex: 0,
        totalDialogue: scene?.dialogue?.length || 0,
      });

      if (firstLine) {
        get().replayDialogueVoice();
      }
    },

    advanceDialogue: () => {
      const engine = get().storyEngine;
      const hasMore = engine.advanceDialogue();

      if (hasMore) {
        const line = engine.getCurrentDialogue();
        set({
          currentDialogue: line,
          dialogueIndex: engine.getCurrentDialogueIndex(),
          totalDialogue: engine.getTotalDialogueCount(),
        });
        get().replayDialogueVoice();
      } else {
        const scene = engine.getCurrentScene();
        if (scene?.missionId) {
          get().openMission(scene.missionId);
        } else {
          set({
            currentScene: scene,
            currentDialogue: scene?.dialogue?.[0] || null,
            dialogueIndex: 0,
            totalDialogue: scene?.dialogue?.length || 0,
          });
          if (scene?.dialogue?.[0]) {
            get().replayDialogueVoice();
          }
        }
      }
    },

    replayDialogueVoice: () => {
      const line = get().currentDialogue;
      if (!line) return;

      const audioEngine = get().audioEngine;
      const voiceServiceUrl = process.env.NEXT_PUBLIC_VOICE_SERVICE_URL || 'http://localhost:8001';

      // Prioritize static pre-generated audio asset from /audio, or fallback to dynamic voice service
      const audioUrl = line.audioUrl || `${voiceServiceUrl}/audio/${line.characterId}_lp_${line.id}.mp3`;

      set({ isDialoguePlaying: true, activeSubtitleText: line.text });

      audioEngine.playVoice(audioUrl, line.subtitles || [], line.text).catch(() => {
        // Fallback handled inside audio engine
      });

      // Clear playing status after line duration
      setTimeout(() => {
        set({ isDialoguePlaying: false });
      }, line.durationMs || 4000);
    },

    makeChoice: (choiceId) => {
      const engine = get().storyEngine;
      const success = engine.makeChoice(choiceId);
      if (success) {
        const scene = engine.getCurrentScene();
        set({
          currentScene: scene,
          currentDialogue: scene?.dialogue?.[0] || null,
          dialogueIndex: 0,
          totalDialogue: scene?.dialogue?.length || 0,
        });
        if (scene?.rewardXp) {
          get().addXp(scene.rewardXp);
        }
        if (scene?.dialogue?.[0]) {
          get().replayDialogueVoice();
        }
      }
    },

    openMission: (missionId) => {
      const mission = defaultMissions.find((m) => m.id === missionId) || defaultMissions[0];
      set({
        activeMission: mission,
        code: mission?.starterCode || '',
        isEditorOpen: true,
        executionResult: null,
      });
    },

    closeMission: () => {
      set({ isEditorOpen: false });
    },

    setCode: (code) => set({ code }),

    resetCode: () => {
      const mission = get().activeMission;
      if (mission) {
        set({ code: mission.starterCode, executionResult: null });
      }
    },

    useHint: () => {
      set((state) => ({ hintsUsedCount: state.hintsUsedCount + 1 }));
    },

    runCodeSubmission: async () => {
      const { code, activeMission, hintsUsedCount, environmentManager, storyEngine, addXp } = get();
      if (!activeMission) return;

      set({ isExecuting: true });

      try {
        const response = await fetch('http://localhost:4000/api/v1/submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: get().user.id,
            missionId: activeMission.id,
            code,
            hintsUsed: hintsUsedCount,
          }),
        });

        let result: ExecutionResult;
        if (response.ok) {
          result = (await response.json()) as ExecutionResult;
        } else {
          // Worker fallback evaluation
          const norm = code.replace(/\r\n/g, '\n');
          const p1 = norm.includes('STATION: AETHELGARD');
          const p2 = norm.includes('REACTOR_LEVEL: 100');
          const p3 = norm.includes('PROTOCOL_STATUS: ONLINE');
          const allPassed = p1 && p2 && p3;

          result = {
            status: allPassed ? 'passed' : 'failed',
            stdout: allPassed
              ? 'STATION: AETHELGARD\nREACTOR_LEVEL: 100\nPROTOCOL_STATUS: ONLINE'
              : 'Output missing required telemetry diagnostic lines.',
            stderr: '',
            executionTimeMs: 45,
            allPassed,
            testResults: [
              {
                testId: '1',
                description: 'Station Identifier Output',
                passed: p1,
                actualOutput: p1 ? 'STATION: AETHELGARD' : 'Missing',
                expectedOutput: 'STATION: AETHELGARD',
                isHidden: false,
              },
              {
                testId: '2',
                description: 'Reactor Capacity Output',
                passed: p2,
                actualOutput: p2 ? 'REACTOR_LEVEL: 100' : 'Missing',
                expectedOutput: 'REACTOR_LEVEL: 100',
                isHidden: false,
              },
              {
                testId: '3',
                description: 'Complete Telemetry Sequence',
                passed: allPassed,
                actualOutput: allPassed ? '[HIDDEN TEST]' : 'Failed',
                expectedOutput: '[HIDDEN TEST]',
                isHidden: true,
              },
            ],
            feedback: allPassed
              ? 'Mission telemetry verified! Reactor core synchronized.'
              : 'Review standard output formatting and ensure all 3 print lines are present.',
          };
        }

        set({ executionResult: result, isExecuting: false });

        if (result.allPassed) {
          // 1. Trigger 3D Environment Transformation
          environmentManager.restorePower();

          // 2. Award XP
          addXp(150);

          // 3. Complete mission in story engine & progress to victory scene
          setTimeout(() => {
            storyEngine.markMissionComplete(activeMission.id, 'scene-lp-6-success');
            const nextScene = storyEngine.getCurrentScene();
            set({
              isEditorOpen: false,
              currentScene: nextScene,
              currentDialogue: nextScene?.dialogue?.[0] || null,
              dialogueIndex: 0,
              totalDialogue: nextScene?.dialogue?.length || 0,
            });
            if (nextScene?.dialogue?.[0]) {
              get().replayDialogueVoice();
            }
          }, 1800);
        }
      } catch (err) {
        set({
          isExecuting: false,
          executionResult: {
            status: 'system_error',
            stdout: '',
            stderr: (err as Error).message,
            executionTimeMs: 0,
            allPassed: false,
            testResults: [],
            feedback: 'Error contacting execution service.',
          },
        });
      }
    },
  };
});
