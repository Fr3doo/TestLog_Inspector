'use client';

import { Card, Badge } from '@testlog-inspector/ui-components';
import { MiscInfo as Misc } from '@testlog-inspector/log-parser';

interface Props {
  misc: Misc;
}

/**
 * Informations diverses
 * ---------------------
 * - Versions sous forme de badges
 * - Endpoints API => liens cliquables
 * - Test cases & Folder IDs => liste simple
 * Affiche chaque section uniquement si elle contient des éléments.
 */
export default function MiscInfo({ misc }: Props) {
  const { versions, apiEndpoints, testCases, folderIds } = misc;

  const hasVersions = Object.keys(versions).length > 0;
  const hasEndpoints = apiEndpoints.length > 0;
  const hasTests = testCases.length > 0;
  const hasFolders = folderIds.length > 0;

  if (!hasVersions && !hasEndpoints && !hasTests && !hasFolders) return null;

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Informations diverses</h2>

      {hasVersions && (
        <section>
          <h3 className="font-medium mb-2">Versions</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(versions).map(([name, ver]) => (
              <Badge key={name} variant="secondary">
                {name}: {ver}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {hasEndpoints && (
        <section>
          <h3 className="font-medium mb-2">API Endpoints</h3>
          <ul className="list-disc pl-6 space-y-1">
            {apiEndpoints.map((url) => (
              <li key={url}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline break-all text-primary hover:text-primary/80"
                >
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {hasTests && (
        <section>
          <h3 className="font-medium mb-2">Test Cases</h3>
          <ul className="list-disc pl-6 columns-2 md:columns-3">
            {testCases.map((tc) => (
              <li key={tc}>{tc}</li>
            ))}
          </ul>
        </section>
      )}

      {hasFolders && (
        <section>
          <h3 className="font-medium mb-2">Folder IDs</h3>
          <ul className="list-disc pl-6 columns-2 md:columns-3">
            {folderIds.map((id) => (
              <li key={id}>{id}</li>
            ))}
          </ul>
        </section>
      )}
    </Card>
  );
}
