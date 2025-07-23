import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';

describe('useFileInput', () => {
  it('returns selected files via callback', () => {
    const onFiles = vi.fn();
    const { useFileInput } = require('../hooks/useFileInput');
    const { result } = renderHook(() => useFileInput(onFiles));

    const files = [new File(['data'], 'a.log')];
    act(() => {
      result.current.handleFiles(files);
    });

    expect(onFiles).toHaveBeenCalledWith(files);
    expect(result.current.files).toEqual(files);
  });
});
