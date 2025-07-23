import {
  renderWithProviders,
  screen,
  waitFor,
} from '../../../../tests/helpers/renderWithProviders';
import userEvent from '@testing-library/user-event';
import FileDropzone from '@/components/FileDropzone';
import parsedLogFixture from '../../../../tests/fixtures/parsedLog';
import { vi } from 'vitest';

describe('<FileDropzone /> retry', () => {
  it('shows error and retries upload on click', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce(
        new Response(JSON.stringify(parsedLogFixture), { status: 200 }),
      );
    vi.stubGlobal('fetch', fetchMock);

    const onAnalyzed = vi.fn();
    const { container } = renderWithProviders(
      <FileDropzone onAnalyzed={onAnalyzed} />,
    );
    const input = container.querySelector('input[type="file"]')!;
    const user = userEvent.setup();
    const file = new File(['data'], 'f.log');
    await user.upload(input, file);

    await screen.findByText(/Échec de l'analyse/);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: /réessayer/i }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    await waitFor(() =>
      expect(onAnalyzed).toHaveBeenCalledWith(parsedLogFixture),
    );

    vi.restoreAllMocks();
  });
});
