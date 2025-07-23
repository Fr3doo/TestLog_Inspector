import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { ConfigService } from './common/config.service';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  /* ---------- Security & middlewares ---------- */
  app.use(helmet());

  const config = app.get(ConfigService);

  // Keep body size consistent with upload limit
  app.use(json({ limit: config.maxUploadSize }));
  app.use(urlencoded({ extended: true, limit: config.maxUploadSize }));

  /* ---------- Global validation (class-validator) ---------- */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // retire props inconnues
      forbidNonWhitelisted: true, // renvoie 400 si prop inconnue
      transform: true, // transforme payloads en DTO
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  /* ---------- CORS (Next.js on :3000) ---------- */
  app.enableCors({
    origin: config.corsOrigin,
    credentials: true,
  });

  await app.listen(config.port);
  logger.log(
    `🚀  API TestLog Inspector running on http://localhost:${config.port}`,
  );
}

bootstrap().catch((err) => {
  // Fail-fast logging
  console.error('Fatal bootstrap error:', err);
  process.exit(1);
});
