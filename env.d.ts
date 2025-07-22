/// <reference types="node" />

/**
 * Déclarations de variables d’environnement
 * accessibles à travers process.env.
 */
declare namespace NodeJS {
  interface ProcessEnv {
    /** URL publique de l’API Nest (ex. http://localhost:3001) */
    readonly NEXT_PUBLIC_API_URL?: string;

    /** Environnement d’exécution */
    readonly NODE_ENV: "development" | "production" | "test";

    /** Max upload size in bytes (default 50MB) */
    readonly MAX_UPLOAD_SIZE?: string;
  }
}
