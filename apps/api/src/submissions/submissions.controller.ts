import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Get('missions/:missionId')
  getMissionDetails(@Param('missionId') missionId: string) {
    return this.submissionsService.getMission(missionId);
  }

  @Post()
  async submitCode(
    @Body()
    body: {
      userId?: string;
      missionId: string;
      code: string;
      hintsUsed?: number;
    }
  ) {
    return this.submissionsService.executeSubmission(
      body.userId || 'guest-user',
      body.missionId,
      body.code,
      body.hintsUsed || 0
    );
  }
}
