'use client';

import { useState } from 'react';
import { useUpload } from '../hooks/useUpload.js';
import { ParsedLog } from '@testlog-inspector/log-parser';
import { Card } from '@testlog-inspector/ui-components';
import { ALLOWED_EXT } from '../../../api/src/common/file.constants.js';

const classes = {
  base: 'p-8 border-2 border-dashed',
  drag: 'border-primary',
  idle: 'border-muted',
};

export default function FileDropzone({
  onAnalyzed,
}: {
  onAnalyzed: (p: ParsedLog) => void;
}) {
  const { upload, isUploading, error } = useUpload(onAnalyzed);
  const [drag, setDrag] = useState(false);
  const [lastFiles, setLastFiles] = useState<File[]>([]);

  function handleUpload(files: File[]) {
    setLastFiles(files);
    upload(files);
  }

  function retry() {
    if (lastFiles.length) upload(lastFiles);
  }

  return (
    <Card
      className={`${classes.base} ${drag ? classes.drag : classes.idle}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        handleUpload(Array.from(e.dataTransfer.files));
      }}
    >
      <p className="text-center">
        {isUploading
          ? 'Analyse en cours…'
          : `Glissez-déposez vos fichiers ${ALLOWED_EXT.join(' ou ')} ou cliquez`}
      </p>
      <input
        type="file"
        multiple
        accept={ALLOWED_EXT.join(',')}
        className="hidden"
        onChange={(e) => handleUpload(Array.from(e.target.files ?? []))}
      />
      {error && (
        <div className="text-red-500 mt-2 space-y-1">
          <p>Échec de l'analyse: {error}</p>
          <button onClick={retry} className="underline">
            Réessayer
          </button>
        </div>
      )}
    </Card>
  );
}
