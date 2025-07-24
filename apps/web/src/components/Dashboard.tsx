'use client';

import { ParsedLog } from '@testlog-inspector/log-parser';

import SummaryCard from './SummaryCard.js';
import ContextTable from './ContextTable.js';
import ErrorTable from './ErrorTable.js';
import MiscInfo from './MiscInfo.js';

interface DashboardProps {
  data: ParsedLog;
}

/**
 * Dashboard
 * ---------
 * Ordonne l’affichage :
 *   1. Résumé exécutif
 *   2. Contexte
 *   3. Table d’erreurs avec tri / filtre
 *   4. Informations diverses
 *
 * Layout responsive : empile en mobile, grille en ≥ md.
 */
export default function Dashboard({ data }: DashboardProps) {
  return (
    <section className="space-y-8">
      {/* Résumé ▲ */}
      <SummaryCard text={data.summary.text} />

      {/* Contexte ▲ */}
      <ContextTable context={data.context} />

      {/* Erreurs ▲ */}
      <ErrorTable errors={data.errors} />

      {/* Infos diverses ▲ */}
      <MiscInfo misc={data.misc} />
    </section>
  );
}
