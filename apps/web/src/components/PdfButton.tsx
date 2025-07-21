'use client';

import { useState } from 'react';
import { ParsedLog } from '@testlog-inspector/log-parser';
import { Button } from '@testlog-inspector/ui-components';
import { generatePdf } from '@/lib/pdf';

interface Props {
  data: ParsedLog;
}

/**
 * Génère et télécharge un rapport PDF récapitulatif.
 * Utilise la fonction helper `generatePdf` (lib/pdf.ts) qui
 * renvoie un Blob ou déclenche automatiquement le download.
 */
export default function PdfButton({ data }: Props) {
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    try {
      setLoading(true);
      await generatePdf(data); // encapsule jsPDF + save
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={onClick} disabled={loading}>
      {loading ? 'Génération…' : 'Télécharger rapport PDF'}
    </Button>
  );
}
