import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { StoriesService } from './stories.service';
import type { PlayerStoryProgress } from '@codequest/shared-types';

@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Get()
  getAllCampaigns() {
    return this.storiesService.getAllCampaigns();
  }

  @Get(':slug')
  getCampaign(@Param('slug') slug: string) {
    return this.storiesService.getCampaignBySlug(slug);
  }

  @Get(':slug/progress')
  getProgress(@Param('slug') slug: string, @Query('userId') userId: string = 'guest-user') {
    return this.storiesService.getProgress(userId, slug);
  }

  @Post(':slug/progress')
  saveProgress(
    @Param('slug') slug: string,
    @Body() body: { userId: string; progress: Partial<PlayerStoryProgress> }
  ) {
    return this.storiesService.saveProgress(body.userId || 'guest-user', slug, body.progress);
  }
}
