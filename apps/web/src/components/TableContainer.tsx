'use client';

import {
  Card,
  SortableTable,
  type ColumnDef,
  type SortConfig,
} from '@testlog-inspector/ui-components';
import * as React from 'react';

interface TableContainerProps<TData extends object> {
  title?: string;
  data: TData[];
  columns: ColumnDef<TData>[];
  initialSort?: SortConfig<TData>;
  filterKeys?: (keyof TData)[];
  onSort?: (sort: SortConfig<TData> | undefined) => void;
  children?: React.ReactNode;
}

/**
 * TableContainer
 * ---------------
 * Encapsule `SortableTable` dans un `Card` pour centraliser la logique
 * de tri/filtre des différents tableaux de l'application.
 */
export default function TableContainer<TData extends object>({
  title,
  data,
  columns,
  initialSort,
  filterKeys,
  onSort,
  children,
}: TableContainerProps<TData>) {
  return (
    <Card className="p-6 space-y-4">
      {title && <h2 className="text-xl font-semibold">{title}</h2>}
      <SortableTable
        data={data}
        columns={columns}
        initialSort={initialSort}
        filterKeys={filterKeys}
        onSort={onSort}
      />
      {children}
    </Card>
  );
}
