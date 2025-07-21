'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { LogError } from '@testlog-inspector/log-parser';

import { DataTable, Button, Card } from '@testlog-inspector/ui-components';

interface Props {
  errors: LogError[];
}

/**
 * Table des erreurs / exceptions
 * ------------------------------
 * - Tri activé sur toutes les colonnes.
 * - Filtre global (fournit par DataTable).
 * - Affichage déroulant de la stack-trace sur demande.
 */
export default function ErrorTable({ errors }: Props) {
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const columns = React.useMemo<ColumnDef<LogError>[]>(
    () => [
      {
        accessorKey: 'type',
        header: 'Type',
        cell: (info) => <span className="font-mono">{info.getValue<string>()}</span>,
      },
      {
        accessorKey: 'message',
        header: 'Message',
        cell: (info) => info.getValue<string>(),
      },
      {
        accessorKey: 'lineNumber',
        header: 'Ligne',
        cell: (info) => info.getValue<number>(),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const id = row.id;
          const isOpen = expanded === id;

          return row.original.stack ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(isOpen ? null : id)}
            >
              {isOpen ? 'Masquer stack' : 'Voir stack'}
            </Button>
          ) : null;
        },
      },
    ],
    [expanded],
  );

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Erreurs / Exceptions</h2>

      <DataTable
        data={errors}
        columns={columns}
        initialSort={[{ id: 'lineNumber', desc: false }]}
        filterKeys={['type', 'message']}
      />

      {expanded !== null && errors[Number(expanded)]?.stack && (
        <pre className="mt-4 max-h-64 overflow-auto rounded bg-muted p-4 text-sm">
          {errors[Number(expanded)].stack}
        </pre>
      )}
    </Card>
  );
}
