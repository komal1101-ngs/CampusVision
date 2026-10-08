import { useState, useEffect } from 'react';
import { Campus, Building, Floor, Area } from '../../shared/types';
import { api } from '../services/api';

export function useLocations() {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getHierarchy();
      setCampuses(data);
    } catch (err: any) {
      console.error('[useLocations] Error:', err);
      setError(err?.message || 'Failed to fetch location hierarchy');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return {
    campuses,
    loading,
    error,
    refreshLocations: fetchLocations,
  };
}
