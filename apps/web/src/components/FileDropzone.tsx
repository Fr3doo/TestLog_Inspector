"use client";

import { useState } from "react";
import { useUpload } from "../hooks/useUpload";
import { ParsedLog } from "@testlog-inspector/log-parser";
import { Card } from "@testlog-inspector/ui-components";
import { ALLOWED_EXT } from "../../../api/src/common/file.constants";

export default function FileDropzone({
  onAnalyzed,
}: {
  onAnalyzed: (p: ParsedLog) => void;
}) {
  const { upload, isUploading, error } = useUpload(onAnalyzed);
  const [drag, setDrag] = useState(false);

  return (
    <Card
      className={`p-8 border-2 border-dashed ${
        drag ? "border-primary" : "border-muted"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        upload(Array.from(e.dataTransfer.files));
      }}
    >
      <p className="text-center">
        {isUploading
          ? "Analyse en cours…"
          : `Glissez-déposez vos fichiers ${ALLOWED_EXT.join(' ou ')} ou cliquez`}
      </p>
      <input
        type="file"
        multiple
        accept={ALLOWED_EXT.join(',')}
        className="hidden"
        onChange={(e) => upload(Array.from(e.target.files ?? []))}
      />
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </Card>
  );
}
