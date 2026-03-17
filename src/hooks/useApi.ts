import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  immediate = true
): UseApiState<T> & { refetch: () => Promise<void> } {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: immediate,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await apiCall();
      setState({ data: result, loading: false, error: null });
    } catch (error) {
      setState({ data: null, loading: false, error: error as Error });
    }
  }, [apiCall]);

  // Execute on mount if immediate is true
  useState(() => {
    if (immediate) {
      execute();
    }
  });

  return {
    ...state,
    refetch: execute,
  };
}