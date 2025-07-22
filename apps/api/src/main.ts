import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { MAX_UPLOAD_SIZE } from './common/constants';
import { getConfig } from './common/config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  /* ---------- Security & middlewares ---------- */
  app.use(helmet());

  // Keep body size consistent with upload limit
  app.use(json({ limit: MAX_UPLOAD_SIZE }));
  app.use(urlencoded({ extended: true, limit: MAX_UPLOAD_SIZE }));

  /* ---------- Global validation (class-validator) ---------- */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // retire props inconnues
      forbidNonWhitelisted: true, // renvoie 400 si prop inconnue
      transform: true,            // transforme payloads en DTO
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  const { port, corsOrigin } = getConfig();

  /* ---------- CORS (Next.js on :3000) ---------- */
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  await app.listen(port);
  logger.log(`🚀  API TestLog Inspector running on http://localhost:${port}`);
}

bootstrap().catch((err) => {
  // Fail-fast logging
  console.error('Fatal bootstrap error:', err);
  process.exit(1);
});
