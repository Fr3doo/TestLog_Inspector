"use client";

import { useState } from "react";
import { ParsedLog } from "@testlog-inspector/log-parser";

export function useUpload(
  onSuccess: (p: ParsedLog) => void,
  endpoint = "/api/analyze"
) {
  const [isUploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(files: File[]) {
    setUploading(true);
    setError(null);

    try {
      const form = new FormData();
      files.forEach((f) => form.append("files", f));

      const res = await fetch(endpoint, { method: "POST", body: form });
      if (!res.ok) throw new Error(await res.text());

      const data: ParsedLog = await res.json();
      onSuccess(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return { upload, isUploading, error };
}
