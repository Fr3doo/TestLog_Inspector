"use client";

import { ParsedLog } from "@testlog-inspector/log-parser";
import { Button } from "@testlog-inspector/ui-components";
import { usePdfGenerator } from "@/hooks/usePdfGenerator";

interface Props {
  data: ParsedLog;
}

/**
 * Génère et télécharge un rapport PDF via un `IPdfGenerator`.
 * L'implémentation concrète peut être remplacée en tests.
 */
export default function PdfButton({ data }: Props) {
  const generatePdf = usePdfGenerator();

  const onClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    btn.disabled = true;
    await generatePdf(data);
    btn.disabled = false;
  };

  return <Button onClick={onClick}>Télécharger rapport PDF</Button>;
}
