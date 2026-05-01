import { renderHook, act } from '@testing-library/react';
import { useReadiness } from './useReadiness';
import { describe, it, expect } from 'vitest';

describe('useReadiness', () => {
  it('calculates correct percentage and suggestions', () => {
    const { result } = renderHook(() => useReadiness());
    
    expect(result.current.percentage).toBe(0);
    expect(result.current.suggestions.length).toBe(3);
    
    act(() => {
      result.current.toggleField('id');
      result.current.toggleField('registered');
    });
    
    expect(result.current.percentage).toBe(67);
    expect(result.current.suggestions.length).toBe(1);
    expect(result.current.suggestions[0]).toBe("Check the minimum voting age in your state.");
  });
});
