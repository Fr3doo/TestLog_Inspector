"use client";

import { useState } from "react";
import { ParsedLog } from "@testlog-inspector/log-parser";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:3001";

// Build multipart payload
function buildFormData(files: File[]): FormData {
  const form = new FormData();
  files.forEach((file) => form.append("files", file));
  return form;
}

export function useUpload(
  onSuccess: (p: ParsedLog) => void,
  endpoint = `${API_BASE}/analyze`
) {
  const [isUploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(files: File[]) {
    setUploading(true);
    setError(null);

    try {
      // Send files to the API
      const res = await fetch(endpoint, {
        method: "POST",
        body: buildFormData(files),
      });

      if (!res.ok) {
        setError(await res.text());
        return;
      }

      // Notify success
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
