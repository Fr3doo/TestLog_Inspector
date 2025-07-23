'use client';

import * as React from 'react';
import { LogError } from '@testlog-inspector/log-parser';

import { Button, type ColumnDef } from '@testlog-inspector/ui-components';
import TableContainer from './TableContainer';

interface Props {
  errors: LogError[];
}

/**
 * Table des erreurs / exceptions
 * ------------------------------
 * - Tri activé sur toutes les colonnes.
 * - Filtre global (fourni par SortableTable).
 * - Affichage déroulant de la stack-trace sur demande.
 */
export default function ErrorTable({ errors }: Props) {
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const columns = React.useMemo<ColumnDef<LogError>[]>(
    () => [
      {
        accessorKey: 'type',
        header: 'Type',
        cell: (value) => <span className="font-mono">{String(value)}</span>,
      },
      {
        accessorKey: 'message',
        header: 'Message',
        cell: (value) => String(value),
      },
      {
        accessorKey: 'lineNumber',
        header: 'Ligne',
        cell: (value) => String(value),
      },
      {
        header: '',
        sortable: false,
        cell: (_, row, idx) => {
          const id = String(idx);
          const isOpen = expanded === id;

          return row.stack ? (
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
    <TableContainer
      title="Erreurs / Exceptions"
      data={errors}
      columns={columns}
      initialSort={{ key: 'lineNumber', desc: false }}
      filterKeys={['type', 'message']}
    >
      {expanded !== null && errors[Number(expanded)]?.stack && (
        <pre className="mt-4 max-h-64 overflow-auto rounded bg-muted p-4 text-sm">
          {errors[Number(expanded)].stack}
        </pre>
      )}
    </TableContainer>
  );
}
