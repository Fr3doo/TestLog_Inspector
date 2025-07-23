'use client';

import { ParsedLog } from '@testlog-inspector/log-parser';
import { useApiPost } from './useApiPost';
import { useFileInput } from './useFileInput';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ??
  'http://localhost:3001';

/**
 * Orchestration de `useFileInput` et `useApiPost` pour analyser des fichiers log.
 * Retourne la fonction `upload` ainsi que l'état de chargement et l'erreur.
 */
export function useUpload(
  onSuccess: (p: ParsedLog) => void,
  endpoint = `${API_BASE}/analyze`,
) {
  const { post, isPosting, error } = useApiPost<ParsedLog>(endpoint);
  const { handleFiles } = useFileInput(async (files) => {
    const form = new FormData();
    files.forEach((file) => form.append('files', file));
    const data = await post(form);
    if (data) onSuccess(data);
  });

  return { upload: handleFiles, isUploading: isPosting, error };
}
