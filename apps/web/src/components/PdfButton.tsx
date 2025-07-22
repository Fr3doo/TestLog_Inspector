'use client';

import { useState } from 'react';
import { ParsedLog } from '@testlog-inspector/log-parser';
import { Button } from '@testlog-inspector/ui-components';
import { usePdfGenerator } from '@/lib/PdfGeneratorContext';

interface Props {
  data: ParsedLog;
}

/**
 * Génère et télécharge un rapport PDF via un `IPdfGenerator`.
 * L'implémentation concrète peut être remplacée en tests.
 */
export default function PdfButton({ data }: Props) {
  const [loading, setLoading] = useState(false);
  const pdf = usePdfGenerator();

  const onClick = async () => {
    try {
      setLoading(true);
      await pdf.generate(data);
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
