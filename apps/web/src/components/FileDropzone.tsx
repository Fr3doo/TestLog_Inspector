"use client";

import { useState } from "react";
import { useUpload } from "../hooks/useUpload";
import { ParsedLog } from "@testlog-inspector/log-parser/src/types";
import { Card } from "@/components/ui/card";

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
          : "Glissez-déposez vos fichiers .log ou cliquez"}
      </p>
      <input
        type="file"
        multiple
        accept=".txt,.log"
        className="hidden"
        onChange={(e) => upload(Array.from(e.target.files ?? []))}
      />
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </Card>
  );
}
