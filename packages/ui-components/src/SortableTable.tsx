import * as React from 'react';
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from './shadcn/Table';
import { Input } from './shadcn/Input';

export interface ColumnDef<TData> {
  accessorKey?: keyof TData;
  header: React.ReactNode;
  cell?: (
    value: TData[keyof TData] | undefined,
    row: TData,
    index: number,
  ) => React.ReactNode;
  sortable?: boolean;
}

export interface SortConfig<TData> {
  key: keyof TData;
  desc: boolean;
}

export interface SortableTableProps<TData extends object> {
  data: TData[];
  columns: ColumnDef<TData>[];
  initialSort?: SortConfig<TData>;
  filterKeys?: (keyof TData)[];
  /** Callback executed when sort changes */
  onSort?: (sort: SortConfig<TData> | undefined) => void;
}

export function SortableTable<TData extends object>({
  data,
  columns,
  initialSort,
  filterKeys = [],
  onSort,
}: SortableTableProps<TData>) {
  const [sort, setSort] = React.useState<SortConfig<TData> | undefined>(
    initialSort,
  );
  const [globalFilter, setGlobalFilter] = React.useState('');

  const handleSort = (key?: keyof TData) => {
    if (!key) return;
    setSort((prev) => {
      const next =
        prev && prev.key === key
          ? { key, desc: !prev.desc }
          : { key, desc: false };
      onSort?.(next);
      return next;
    });
  };

  const filtered = React.useMemo(() => {
    if (!globalFilter) return data;
    const keys = filterKeys.length
      ? filterKeys
      : (Object.keys(data[0] ?? {}) as (keyof TData)[]);
    const lower = globalFilter.toLowerCase();
    return data.filter((row) =>
      keys.some((k) =>
        String(row[k] ?? '')
          .toLowerCase()
          .includes(lower),
      ),
    );
  }, [data, globalFilter, filterKeys]);

  const sorted = React.useMemo(() => {
    if (!sort) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      if (av === bv) return 0;
      if (av === undefined || av === null) return 1;
      if (bv === undefined || bv === null) return -1;
      return av > bv ? (sort.desc ? -1 : 1) : sort.desc ? 1 : -1;
    });
  }, [filtered, sort]);

  return (
    <div className="space-y-2">
      <Input
        placeholder="Filtrer…"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="max-w-sm"
      />

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={String(col.accessorKey ?? col.header)}
                onClick={
                  col.sortable === false
                    ? undefined
                    : () => handleSort(col.accessorKey)
                }
                className={
                  col.sortable === false
                    ? undefined
                    : 'cursor-pointer select-none'
                }
              >
                {col.header}
                {col.accessorKey && sort?.key === col.accessorKey
                  ? sort.desc
                    ? ' ▼'
                    : ' ▲'
                  : null}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <tbody>
          {sorted.map((row, idx) => (
            <TableRow key={idx}>
              {columns.map((col) => (
                <TableCell key={String(col.accessorKey ?? col.header)}>
                  {col.cell
                    ? col.cell(
                        col.accessorKey ? row[col.accessorKey] : undefined,
                        row,
                        idx,
                      )
                    : col.accessorKey
                      ? ((row[col.accessorKey] as React.ReactNode) ?? null)
                      : null}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
