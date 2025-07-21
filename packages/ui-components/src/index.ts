/**
 * Library entry point:
 * - Re-exports common shadcn/ui components
 * - Exposes our generic DataTable component
 *
 * The shadcn components are copied via `npx shadcn-ui@latest add …` in the
 * Next.js app and re-mapped here for sharing.
 */

export { Button } from "./shadcn/Button";
export { Card } from "./shadcn/Card";
export { Input } from "./shadcn/Input";
export { Table, TableHeader, TableRow, TableCell, TableHead } from "./shadcn/Table";

export { DataTable } from "./DataTable";
