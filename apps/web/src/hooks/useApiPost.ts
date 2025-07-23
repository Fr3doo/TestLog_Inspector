'use client';

import { useState } from 'react';

/**
 * Hook générique pour envoyer un formulaire multipart en POST vers l'API.
 * Il expose la méthode `post` ainsi que l'état de chargement et l'erreur éventuelle.
 *
 * @param endpoint URL de l'endpoint à appeler.
 */
export function useApiPost<T>(endpoint: string) {
  const [isPosting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function post(body: FormData): Promise<T | null> {
    setPosting(true);
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body,
      });
      if (!res.ok) {
        setError(await res.text());
        return null;
      }
      return (await res.json()) as T;
    } catch (e) {
      setError((e as Error).message);
      return null;
    } finally {
      setPosting(false);
    }
  }

  return { post, isPosting, error };
}
