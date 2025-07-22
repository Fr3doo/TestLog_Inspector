import { describe, expect, it, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Basic mock response
function mockFetch() {
  const res = new Response(JSON.stringify([]), { status: 200 });
  return vi.fn().mockResolvedValue(res);
}

describe('useUpload', () => {
  it('calls NEXT_PUBLIC_API_URL/analyze by default', async () => {
    const apiUrl = 'http://api.example.com';
    process.env.NEXT_PUBLIC_API_URL = apiUrl;
    const fetchMock = mockFetch();
    vi.stubGlobal('fetch', fetchMock);

    const { useUpload } = await import('../hooks/useUpload');
    const { result } = renderHook(() => useUpload(() => {}));

    const file = new File(['data'], 'test.log');
    await act(async () => {
      await result.current.upload([file]);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      `${apiUrl.replace(/\/$/, '')}/analyze`,
      expect.objectContaining({ method: 'POST' })
    );
    vi.restoreAllMocks();
  });
});
