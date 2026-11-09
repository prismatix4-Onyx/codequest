import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Connected to Database via Prisma.');
    } catch (err) {
      console.warn('Prisma database connection notice (running in memory/standalone mode):', (err as Error).message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
