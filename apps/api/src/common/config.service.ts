import { Injectable } from '@nestjs/common';
import { ApiConfig, getConfig } from './config';

/**
 * Injectable service exposing normalized configuration values.
 * Reads environment variables once at instantiation.
 */
@Injectable()
export class ConfigService {
  private readonly config: ApiConfig = getConfig();

  /** Port on which the Nest application listens. */
  get port(): number {
    return this.config.port;
  }

  /** Allowed origin for CORS requests. */
  get corsOrigin(): string {
    return this.config.corsOrigin;
  }

  /** Maximum upload size in bytes. */
  get maxUploadSize(): number {
    return this.config.maxUploadSize;
  }
}
