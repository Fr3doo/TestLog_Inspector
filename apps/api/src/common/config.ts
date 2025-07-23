export interface ApiConfig {
  /** Port on which the Nest application listens. */
  port: number;
  /** Allowed origin for CORS requests. */
  corsOrigin: string;
  /** Maximum upload size in bytes (used by Multer & body parser). */
  maxUploadSize: number;
}

/**
 * Reads environment variables and returns normalized API configuration.
 * Defaults mirror the values documented in ENVIRONMENT.md.
 */
export function getConfig(): ApiConfig {
  const {
    API_PORT,
    CORS_ORIGIN,
    MAX_UPLOAD_SIZE,
    UPLOAD_LIMIT_MB,
  } = process.env;

  const port = API_PORT ? Number(API_PORT) : 3001;
  const corsOrigin = CORS_ORIGIN ?? 'http://localhost:3000';

  const defaultSize = 50 * 1024 * 1024; // 50MB
  const maxUploadSize = MAX_UPLOAD_SIZE
    ? Number(MAX_UPLOAD_SIZE)
    : UPLOAD_LIMIT_MB
    ? Number(UPLOAD_LIMIT_MB) * 1024 * 1024
    : defaultSize;

  return { port, corsOrigin, maxUploadSize };
}
