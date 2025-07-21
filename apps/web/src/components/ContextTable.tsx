'use client';

import { Card } from '@ui/Card';
import { TestContext } from '@testlog-inspector/log-parser/src/types';

interface Props {
  context: TestContext;
}

/**
 * Contexte de la campagne
 * -----------------------
 * Affiche les métadonnées essentielles (scénario, date, env., navigateur),
 * puis toutes les clés additionnelles renvoyées par le parser.
 *
 * ✔️ Pas de logique d’état : pur composant d’affichage (SRP).
 */
export default function ContextTable({ context }: Props) {
  const entries = Object.entries(context).filter(([, v]) => v);

  if (!entries.length) return null;

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Contexte</h2>

      <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
        {entries.map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <dt className="text-sm font-medium text-muted-foreground capitalize">
              {key.replace(/_/g, ' ')}
            </dt>
            <dd className="text-base">{value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
