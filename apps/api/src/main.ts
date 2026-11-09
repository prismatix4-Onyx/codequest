import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.setGlobalPrefix('api/v1');

  const port = process.env.API_PORT || 4000;
  await app.listen(port);
  console.log(`CODEQUEST API v2.0 running on: http://localhost:${port}/api/v1`);
}

bootstrap();
