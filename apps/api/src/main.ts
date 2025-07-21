import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  /* ---------- Security & middlewares ---------- */
  app.use(helmet());

  // 50MB limit to match upload constraint
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  /* ---------- Global validation (class-validator) ---------- */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // retire props inconnues
      forbidNonWhitelisted: true, // renvoie 400 si prop inconnue
      transform: true,            // transforme payloads en DTO
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  /* ---------- CORS (Next.js on :3000) ---------- */
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    credentials: true,
  });

  const port = process.env.PORT ? Number(process.env.PORT) : 3001;
  await app.listen(port);
  logger.log(`🚀  API TestLog Inspector running on http://localhost:${port}`);
}

bootstrap().catch((err) => {
  // Fail-fast logging
  console.error('Fatal bootstrap error:', err);
  process.exit(1);
});
