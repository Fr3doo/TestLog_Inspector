'use client';

import { Card } from '@testlog-inspector/ui-components';
import { useState } from 'react';
import { Button } from '@testlog-inspector/ui-components';

interface SummaryCardProps {
  text: string; // < 300 mots garanti côté parser
}

/**
 * Affiche le résumé exécutif.
 * Petite UX : bouton “Afficher +” si > 600 caractères.
 */
export default function SummaryCard({ text }: SummaryCardProps) {
  const [expanded, setExpanded] = useState(false);

  const shouldClamp = text.length > 600;
  const displayText = expanded || !shouldClamp ? text : `${text.slice(0, 600)}…`;

  return (
    <Card className="p-6 space-y-2">
      <h2 className="text-xl font-semibold">Résumé exécutif</h2>
      <p className="prose max-w-none whitespace-pre-wrap">{displayText}</p>

      {shouldClamp && (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setExpanded((e) => !e)}
          className="mt-2"
        >
          {expanded ? 'Réduire' : 'Afficher plus'}
        </Button>
      )}
    </Card>
  );
}
