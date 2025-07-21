import React from 'react';
import clsx from 'clsx';

export const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(( { className, ...props }, ref) => (
  <table
    ref={ref}
    className={clsx('w-full text-sm border-collapse', className)}
    {...props}
  />
));
Table.displayName = 'Table';

export const TableHeader = (
  props: React.HTMLAttributes<HTMLTableSectionElement>
) => <thead {...props} />;

export const TableRow = (
  props: React.HTMLAttributes<HTMLTableRowElement>
) => <tr className="border-b" {...props} />;

export const TableHead = (
  props: React.ThHTMLAttributes<HTMLTableCellElement>
) => <th className="text-left font-semibold" {...props} />;

export const TableCell = (
  props: React.TdHTMLAttributes<HTMLTableCellElement>
) => <td className="p-2" {...props} />;
