import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasources: {
        db: {
          url:
            process.env.DATABASE_URL ||
            'postgresql://postgres:postgres@localhost:5432/codequest?schema=public',
        },
      },
    });
  }

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
