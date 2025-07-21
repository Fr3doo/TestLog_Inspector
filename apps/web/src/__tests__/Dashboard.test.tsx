import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import Dashboard from '@/components/Dashboard';
import { ParsedLog } from '@testlog-inspector/log-parser/src/types';

/* ---------- fixture minimale ---------- */
const sample: ParsedLog = {
  summary: { text: 'Un court résumé.' },
  context: {
    scenario: 'login',
    date: '2025‑07‑20',
    environment: 'staging',
    browser: 'chrome',
  },
  errors: [
    {
      type: 'ERROR',
      message: 'Something bad',
      lineNumber: 42,
      raw: 'ERROR: Something bad',
    },
  ],
  misc: {
    versions: { app: '1.2.3' },
    apiEndpoints: ['http://api.local/v1/login'],
    testCases: ['TC01'],
    folderIds: ['F123'],
  },
};

describe('<Dashboard />', () => {
  it('renders without crashing and shows key sections', () => {
    render(<Dashboard data={sample} />);

    // Résumé
    expect(screen.getByText('Résumé exécutif')).toBeInTheDocument();
    expect(screen.getByText(/Un court résumé/)).toBeInTheDocument();

    // Contexte
    expect(screen.getByText('Contexte')).toBeInTheDocument();
    expect(screen.getByText('login')).toBeInTheDocument();

    // Erreurs
    expect(screen.getByText('Erreurs / Exceptions')).toBeInTheDocument();
    expect(screen.getByText('Something bad')).toBeInTheDocument();

    // Misc
    expect(screen.getByText('Informations diverses')).toBeInTheDocument();
    expect(screen.getByText(/app: 1.2.3/)).toBeInTheDocument();
  });
});