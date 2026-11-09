import { Injectable, NotFoundException } from '@nestjs/common';
import type { StoryCampaign, PlayerStoryProgress } from '@codequest/shared-types';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class StoriesService {
  private campaigns: Map<string, StoryCampaign> = new Map();
  private userProgressStore: Map<string, PlayerStoryProgress> = new Map();

  constructor() {
    this.loadCampaigns();
  }

  private loadCampaigns() {
    // 1. The Last Protocol
    const cwdPath = path.resolve(process.cwd(), 'content/python/last-protocol/campaign.json');
    const relativePath = path.resolve(__dirname, '../../../../content/python/last-protocol/campaign.json');
    const campaignPath = fs.existsSync(cwdPath) ? cwdPath : relativePath;

    if (fs.existsSync(campaignPath)) {
      try {
        const raw = fs.readFileSync(campaignPath, 'utf-8');
        const campaign = JSON.parse(raw) as StoryCampaign;
        this.campaigns.set(campaign.slug, campaign);
        this.campaigns.set(campaign.id, campaign);
      } catch (err) {
        console.error('Failed to parse last-protocol campaign:', err);
      }
    }

    // 2. Additional Catalogue Stubs (Forgotten Kingdom, Beyond the Signal, Silent Witness)
    const catalogueStubs: Partial<StoryCampaign>[] = [
      {
        id: 'campaign-forgotten-kingdom',
        slug: 'forgotten-kingdom',
        title: 'The Forgotten Kingdom',
        tagline: 'Unearth ancient clockwork algorithms and master OOP to save a digital realm.',
        description: 'Navigate subterranean vaults powered by steam-driven clockwork automatons. Learn Python collections, dictionaries, and object-oriented architectures to decipher forgotten blueprints.',
        language: 'python',
        difficulty: 'intermediate',
        version: '1.0.0',
        defaultEnvironmentId: 'env-clockwork-cathedral',
        chapters: [],
        totalMissions: 8,
        estimatedHours: 5.0,
      },
      {
        id: 'campaign-beyond-the-signal',
        slug: 'beyond-the-signal',
        title: 'Beyond the Signal',
        tagline: 'Intercept deep-space transmissions using exception handling and stream processing.',
        description: 'Deep-space listening posts are receiving anomalies. Harness Python file operations, exception pipelines, and recursion to isolate genuine transmissions from solar interference.',
        language: 'python',
        difficulty: 'intermediate',
        version: '1.0.0',
        defaultEnvironmentId: 'env-radio-telescope',
        chapters: [],
        totalMissions: 7,
        estimatedHours: 6.0,
      },
      {
        id: 'campaign-silent-witness',
        slug: 'silent-witness',
        title: 'The Silent Witness',
        tagline: 'Cyber-forensic investigation utilizing advanced data structures and graph traversal.',
        description: 'A planetary network grid experienced a blackout. Piece together memory dumps, traverse transaction graphs, and uncover the orchestrator with algorithmic precision.',
        language: 'python',
        difficulty: 'advanced',
        version: '1.0.0',
        defaultEnvironmentId: 'env-forensics-lab',
        chapters: [],
        totalMissions: 10,
        estimatedHours: 8.0,
      },
    ];

    for (const stub of catalogueStubs) {
      this.campaigns.set(stub.slug!, stub as StoryCampaign);
      this.campaigns.set(stub.id!, stub as StoryCampaign);
    }
  }

  getAllCampaigns(): StoryCampaign[] {
    const unique = new Map<string, StoryCampaign>();
    for (const c of this.campaigns.values()) {
      unique.set(c.id, c);
    }
    return Array.from(unique.values());
  }

  getCampaignBySlug(slugOrId: string): StoryCampaign {
    const campaign = this.campaigns.get(slugOrId);
    if (!campaign) {
      throw new NotFoundException(`Campaign '${slugOrId}' not found`);
    }
    return campaign;
  }

  getProgress(userId: string, storyId: string): PlayerStoryProgress {
    const key = `${userId}:${storyId}`;
    let prog = this.userProgressStore.get(key);
    if (!prog) {
      const campaign = this.getCampaignBySlug(storyId);
      const firstChapter = campaign.chapters[0];
      const firstScene = firstChapter?.scenes[0];

      prog = {
        userId,
        storyId: campaign.id,
        currentChapterId: firstChapter?.id || '',
        currentSceneId: firstScene?.id || '',
        completedSceneIds: [],
        variables: {},
        inventory: [],
        unlockedCheckpoints: [],
        completedMissionIds: [],
        lastSavedAt: new Date().toISOString(),
      };
      this.userProgressStore.set(key, prog);
    }
    return prog;
  }

  saveProgress(userId: string, storyId: string, update: Partial<PlayerStoryProgress>): PlayerStoryProgress {
    const current = this.getProgress(userId, storyId);
    const updated: PlayerStoryProgress = {
      ...current,
      ...update,
      variables: { ...current.variables, ...(update.variables || {}) },
      inventory: Array.from(new Set([...current.inventory, ...(update.inventory || [])])),
      completedSceneIds: Array.from(new Set([...current.completedSceneIds, ...(update.completedSceneIds || [])])),
      completedMissionIds: Array.from(new Set([...current.completedMissionIds, ...(update.completedMissionIds || [])])),
      unlockedCheckpoints: Array.from(new Set([...current.unlockedCheckpoints, ...(update.unlockedCheckpoints || [])])),
      lastSavedAt: new Date().toISOString(),
    };
    this.userProgressStore.set(`${userId}:${storyId}`, updated);
    return updated;
  }
}
