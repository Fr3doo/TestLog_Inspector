import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';

function mockFetch() {
  const res = new Response(JSON.stringify({ ok: true }), { status: 200 });
  return vi.fn().mockResolvedValue(res);
}

describe('useApiPost', () => {
  it('POSTs to the provided endpoint', async () => {
    const fetchMock = mockFetch();
    vi.stubGlobal('fetch', fetchMock);

    const { useApiPost } = await import('../hooks/useApiPost');
    const { result } = renderHook(() =>
      useApiPost<{ ok: boolean }>('http://api/u'),
    );

    const form = new FormData();
    await act(async () => {
      await result.current.post(form);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://api/u',
      expect.objectContaining({ method: 'POST' }),
    );
    vi.restoreAllMocks();
  });
});
