import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from './prisma.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { StoriesService } from './stories/stories.service';
import { StoriesController } from './stories/stories.controller';
import { SubmissionsService } from './submissions/submissions.service';
import { SubmissionsController } from './submissions/submissions.controller';
import { VoiceService } from './voice/voice.service';
import { VoiceController } from './voice/voice.controller';
import { CurriculumController } from './curriculum/curriculum.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'codequest-master-key-jwt-secret-minimum-32-chars-long',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [
    AuthController,
    StoriesController,
    SubmissionsController,
    VoiceController,
    CurriculumController,
  ],
  providers: [
    PrismaService,
    AuthService,
    StoriesService,
    SubmissionsService,
    VoiceService,
  ],
})
export class AppModule {}
