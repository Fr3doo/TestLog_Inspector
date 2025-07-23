export interface WebConfig {
  /** Base URL for the API used by the frontend */
  apiUrl: string;
}

/**
 * Reads environment variables and returns normalized configuration
 * for the frontend. Defaults mirror the values documented in ENVIRONMENT.md.
 */
export function getConfig(env: NodeJS.ProcessEnv = process.env): WebConfig {
  const apiUrl =
    env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? 'http://localhost:3001';
  return { apiUrl };
}

// Default configuration used by the app
export const CONFIG = getConfig();
