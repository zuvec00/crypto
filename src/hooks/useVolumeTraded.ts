import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const useVolumeTraded = () => {
  const [volumeData, setVolumeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVolumeData = async () => {
    try {
      setLoading(true);
      const data = await apiService.getVolumeTraded();
      setVolumeData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch volume data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolumeData();
  }, []);

  return {
    volumeData,
    loading,
    error,
    refetch: fetchVolumeData,
  };
};