import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

// Simulate fetch rejection
function mockFetchRejection() {
  return vi.fn().mockRejectedValue(new Error('network fail'));
}

describe('useUpload', () => {
  it('exposes error on failed fetch and resets isUploading', async () => {
    const fetchMock = mockFetchRejection();
    vi.stubGlobal('fetch', fetchMock);

    const { useUpload } = await import('../hooks/useUpload');
    const { result } = renderHook(() => useUpload(() => {}));

    const file = new File(['data'], 'fail.log');
    await act(async () => {
      result.current.upload([file]);
    });

    await waitFor(() => expect(result.current.error).toBe('network fail'));
    expect(result.current.isUploading).toBe(false);

    vi.restoreAllMocks();
  });
});
