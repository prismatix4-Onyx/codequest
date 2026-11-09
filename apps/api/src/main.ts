import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Rewrite root paths (e.g. /auth/*) to /api/v1/* for resilient client compatibility
  app.use((req: any, res: any, next: any) => {
    if (
      req.url &&
      !req.url.startsWith('/api/v1') &&
      (req.url.startsWith('/auth') ||
        req.url.startsWith('/stories') ||
        req.url.startsWith('/curriculum') ||
        req.url.startsWith('/submissions') ||
        req.url.startsWith('/voice'))
    ) {
      req.url = `/api/v1${req.url}`;
    }
    next();
  });

  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT || process.env.API_PORT || 10000;
  await app.listen(port, '0.0.0.0');
  console.log(`CODEQUEST API v2.0 running on: http://0.0.0.0:${port}/api/v1`);
}

bootstrap();
