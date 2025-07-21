import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import ErrorTable from '@/components/ErrorTable';
import { LogError } from '@testlog-inspector/log-parser/src/types';

/* ---------- fixtures ---------- */
const errors: LogError[] = [
  {
    type: 'ERROR',
    message: 'B issue',
    lineNumber: 12,
    raw: 'ERROR: B issue',
  },
  {
    type: 'Exception',
    message: 'A issue',
    lineNumber: 5,
    raw: 'Exception: A issue',
    stack: 'at Foo (foo.ts:1)',
  },
  {
    type: 'ERROR',
    message: 'C issue',
    lineNumber: 30,
    raw: 'ERROR: C issue',
  },
];

describe('<ErrorTable />', () => {
  it('sorts by line number asc, then desc on header click', async () => {
    render(<ErrorTable errors={errors} />);
    const user = userEvent.setup();

    // Ligne ascendante par défaut ➜ première cellule = 5
    const firstRow = within(screen.getAllByRole('row')[1]); // header = row[0]
    expect(firstRow.getByText('5')).toBeInTheDocument();

    // Clique pour trier desc
    const ligneHeader = screen.getByText('Ligne');
    await user.click(ligneHeader);

    const newFirstRow = within(screen.getAllByRole('row')[1]);
    expect(newFirstRow.getByText('30')).toBeInTheDocument();
  });

  it('filters rows with global search input', async () => {
    render(<ErrorTable errors={errors} />);
    const user = userEvent.setup();

    // Tape "B" => ne garde que l’erreur « B issue »
    const filterInput = screen.getByPlaceholderText(/Filtrer…/i);
    await user.type(filterInput, 'B');

    const rows = screen.getAllByRole('row');
    // rows[0] = header, rows[1] = single result
    expect(rows).toHaveLength(2);
    expect(screen.getByText('B issue')).toBeInTheDocument();
  });
});
