import { useState, useMemo, useCallback } from 'react';

export function useProgress(allTaskIds = []) {
  const [completedTasks, setCompletedTasks] = useState(new Set());
  
  const toggleTask = useCallback((taskId) => {
    setCompletedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  }, []);

  const progressPercentage = useMemo(() => {
    if (allTaskIds.length === 0) return 0;
    return Math.round((completedTasks.size / allTaskIds.length) * 100);
  }, [completedTasks, allTaskIds]);

  const remainingTasks = useMemo(() => {
    return allTaskIds.filter(id => !completedTasks.has(id));
  }, [completedTasks, allTaskIds]);

  const isComplete = useCallback((taskId) => completedTasks.has(taskId), [completedTasks]);

  return {
    progressPercentage,
    completedTasks,
    remainingTasks,
    toggleTask,
    isComplete
  };
}
