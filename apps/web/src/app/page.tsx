"use client";

import { useMemo, useState } from "react";
import FileDropzone from "../components/FileDropzone";
import Dashboard from "../components/Dashboard";
import PdfButton from "../components/PdfButton";
import { PdfGeneratorProvider } from "../lib/PdfGeneratorContext";
import { JsPdfGenerator } from "../lib/JsPdfGenerator";
import { ParsedLog } from "@testlog-inspector/log-parser";

export default function HomePage() {
  const [result, setResult] = useState<ParsedLog | null>(null);
  const pdfGenerator = useMemo(() => new JsPdfGenerator(), []);

  return (
    <main className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">TestLog Inspector</h1>

      <FileDropzone onAnalyzed={setResult} />

      {result && (
        <PdfGeneratorProvider value={pdfGenerator}>
          <Dashboard data={result} />
          <PdfButton data={result} />
        </PdfGeneratorProvider>
      )}
    </main>
  );
}
