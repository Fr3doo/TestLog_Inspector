import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import ErrorTable from '@/components/ErrorTable';
import parsedLogFixture from '../../../../tests/fixtures/parsedLog';

describe('<ErrorTable />', () => {
  it('renders rows in ascending order by default', () => {
    render(<ErrorTable errors={parsedLogFixture.errors} />);
    const firstRow = within(screen.getAllByRole('row')[1]); // header = row[0]
    expect(firstRow.getByText('5')).toBeInTheDocument();
  });

  it('filters rows with global search input', async () => {
    render(<ErrorTable errors={parsedLogFixture.errors} />);
    const user = userEvent.setup();

    const filterInput = screen.getByPlaceholderText(/Filtrer…/i);
    await user.type(filterInput, 'B');
    await screen.findByText('B issue');

    expect(screen.getByText('B issue')).toBeInTheDocument();
  });
});
