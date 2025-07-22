import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";

import { Table, TableHead, TableHeader, TableRow, TableCell } from "./shadcn/Table";
import { Input } from "./shadcn/Input";

export interface SortableTableProps<TData extends object> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  initialSort?: SortingState;
  filterKeys?: (keyof TData)[];
}

export function SortableTable<TData extends object>({
  data,
  columns,
  initialSort,
  filterKeys = [],
}: SortableTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSort ?? []);
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    globalFilterFn: (row, colId, filter) => {
      if (!filter) return true;
      const keys = filterKeys.length ? filterKeys : (Object.keys(row.original) as (keyof TData)[]);
      return keys.some((k) =>
        String(row.original[k] ?? "")
          .toLowerCase()
          .includes(String(filter).toLowerCase()),
      );
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

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
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableHead
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="cursor-pointer select-none"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  ) as React.ReactNode}
                  {{
                    asc: " ▲",
                    desc: " ▼",
                  }[header.column.getIsSorted() as string] ?? null}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  ) as React.ReactNode}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
