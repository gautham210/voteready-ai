import { renderHook, act } from '@testing-library/react';
import { useProgress } from './useProgress';
import { describe, it, expect } from 'vitest';

describe('useProgress', () => {
  it('calculates percentage and tracks tasks correctly', () => {
    const taskIds = ['t1', 't2', 't3', 't4'];
    const { result } = renderHook(() => useProgress(taskIds));
    
    expect(result.current.progressPercentage).toBe(0);
    expect(result.current.remainingTasks.length).toBe(4);
    
    act(() => {
      result.current.toggleTask('t1');
      result.current.toggleTask('t2');
    });
    
    expect(result.current.progressPercentage).toBe(50);
    expect(result.current.completedTasks.has('t1')).toBe(true);
    expect(result.current.remainingTasks).toEqual(['t3', 't4']);
    
    act(() => {
      result.current.toggleTask('t1'); // Untoggle
    });
    
    expect(result.current.progressPercentage).toBe(25);
    expect(result.current.completedTasks.has('t1')).toBe(false);
    expect(result.current.remainingTasks).toEqual(['t1', 't3', 't4']);
  });
});
