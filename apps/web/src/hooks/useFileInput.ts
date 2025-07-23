'use client';

import { useState } from 'react';

/**
 * Hook de gestion de sélection de fichiers.
 * Il conserve la dernière sélection et déclenche un callback.
 *
 * @param onFiles Fonction appelée avec la liste de fichiers sélectionnés.
 */
export function useFileInput(onFiles: (files: File[]) => void) {
  const [files, setFiles] = useState<File[]>([]);

  function handleFiles(input: FileList | File[]) {
    const list = Array.from(input ?? []);
    setFiles(list);
    onFiles(list);
  }

  function reset() {
    setFiles([]);
  }

  return { files, handleFiles, reset };
}
