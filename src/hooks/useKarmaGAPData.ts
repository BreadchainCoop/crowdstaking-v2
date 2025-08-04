import { useState, useEffect, useCallback } from 'react';
import { karmaGAPService } from '../services/karmaGAP';
import type { ProjectWithGAPData } from '../types/karma';

interface UseKarmaGAPDataResult {
  data: ProjectWithGAPData['karmaGAPProfile'] | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useKarmaGAPData(karmaGAPId?: string): UseKarmaGAPDataResult {
  const [data, setData] = useState<ProjectWithGAPData['karmaGAPProfile'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!karmaGAPId) {
      console.log('useKarmaGAPData: No karmaGAPId provided');
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    console.log(`useKarmaGAPData: Fetching data for ${karmaGAPId}`);
    setLoading(true);
    setError(null);

    try {
      const result = await karmaGAPService.getCompleteProjectData(karmaGAPId);
      console.log(`useKarmaGAPData: Data received for ${karmaGAPId}:`, result ? 'SUCCESS' : 'NULL');
      setData(result);
    } catch (err) {
      console.error(`useKarmaGAPData: Error fetching data for ${karmaGAPId}:`, err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [karmaGAPId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
} 