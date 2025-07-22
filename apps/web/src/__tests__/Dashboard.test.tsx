import { renderWithProviders, screen } from '../../../../tests/helpers/renderWithProviders';

import Dashboard from '@/components/Dashboard';
import parsedLogFixture from '../../../../tests/fixtures/parsedLog';

describe('<Dashboard />', () => {
  it('renders without crashing and shows key sections', () => {
    renderWithProviders(<Dashboard data={parsedLogFixture} />);

    // Résumé
    expect(screen.getByText('Résumé exécutif')).toBeInTheDocument();
    expect(screen.getByText(/Un court résumé/)).toBeInTheDocument();

    // Contexte
    expect(screen.getByText('Contexte')).toBeInTheDocument();
    expect(screen.getByText('login')).toBeInTheDocument();

    // Erreurs
    expect(screen.getByText('Erreurs / Exceptions')).toBeInTheDocument();
    expect(screen.getByText('B issue')).toBeInTheDocument();

    // Misc
    expect(screen.getByText('Informations diverses')).toBeInTheDocument();
    expect(screen.getByText(/app: 1.2.3/)).toBeInTheDocument();
  });
});