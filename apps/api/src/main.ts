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

  const port = process.env.PORT || process.env.API_PORT || 10000;
  await app.listen(port, '0.0.0.0');
  console.log(`CODEQUEST API v2.0 running on: http://0.0.0.0:${port}/api/v1`);
}

bootstrap();
