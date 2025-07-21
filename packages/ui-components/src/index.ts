/**
 * Point d’entrée de la librairie UI :
 * – Ré‑exporte quelques composants shadcn/ui fréquemment utilisés
 * – Expose notre composant DataTable générique
 *
 * Remarque : les composants shadcn sont copiés (via `npx shadcn-ui@latest add …`)
 * dans l’app Next.js ; on les re‑mappe ici pour mutualiser.
 */

export { Button } from "./shadcn/Button";
export { Card } from "./shadcn/Card";
export { Input } from "./shadcn/Input";
export { Table, TableHeader, TableRow, TableCell, TableHead } from "./shadcn/Table";

export { DataTable } from "./DataTable";
