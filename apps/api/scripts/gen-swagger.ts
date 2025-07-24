/**
 * Génère docs/api.openapi.json à partir des décorateurs Nest Swagger.
 *
 * $ pnpm -C apps/api swagger:json
 */

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

import { AppModule } from '../src/app.module.js';

async function generate() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('TestLog Inspector API')
    .setDescription('Endpoints d’upload et d’analyse de logs')
    .setVersion('0.0.1')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const outDir = resolve(__dirname, '../../docs');
  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, 'api.openapi.json'), JSON.stringify(document, null, 2));

  // eslint-disable-next-line no-console
  console.log('✅  OpenAPI schema generated at docs/api.openapi.json');

  await app.close();
}

generate().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
