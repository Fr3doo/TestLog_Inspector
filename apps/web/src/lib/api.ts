import { ParsedLog } from '@testlog-inspector/log-parser';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? 'http://localhost:3001';

/**
 * Analyse un ou plusieurs fichiers .log/.txt via l’API NestJS.
 * @param files  Liste de fichiers issus d’un input ou drag-and-drop.
 * @throws Error si l’appel HTTP échoue ou si la réponse n’est pas 2xx.
 */
export async function analyzeLogs(files: File[]): Promise<ParsedLog[]> {
  if (!files.length) {
    throw new Error('Aucun fichier fourni');
  }

  const form = new FormData();
  files.forEach((f) => form.append('files', f));

  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    // L’API renvoie le message d’erreur en texte brut
    const msg = await res.text();
    throw new Error(msg || `Erreur HTTP ${res.status}`);
  }

  return (await res.json()) as ParsedLog[];
}
