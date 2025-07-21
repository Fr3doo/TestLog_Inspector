"use client";

import { useState } from "react";
import FileDropzone from "../components/FileDropzone";
import Dashboard from "../components/Dashboard";
import PdfButton from "../components/PdfButton";
import { ParsedLog } from "@testlog-inspector/log-parser/src/types";

export default function HomePage() {
  const [result, setResult] = useState<ParsedLog | null>(null);

  return (
    <main className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">TestLog Inspector</h1>

      <FileDropzone onAnalyzed={setResult} />

      {result && (
        <>
          <Dashboard data={result} />
          <PdfButton data={result} />
        </>
      )}
    </main>
  );
}
