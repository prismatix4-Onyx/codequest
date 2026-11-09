import { Controller, Get, Post, Body } from '@nestjs/common';
import { VoiceService } from './voice.service';

@Controller('voice')
export class VoiceController {
  constructor(private readonly voiceService: VoiceService) {}

  @Get('profiles')
  getProfiles() {
    return this.voiceService.getProfiles();
  }

  @Post('synthesize')
  synthesize(@Body() body: { characterId: string; text: string }) {
    return this.voiceService.synthesize(body.characterId, body.text);
  }
}
