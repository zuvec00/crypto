import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface TransactionStats {
  dailyTransactions: any[];
  weeklyTransactions: any[];
  monthlyTransactions: any[];
}

export const useTransactionStats = () => {
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await apiService.getTransactionStats();
      
      // Log the transaction stats response structure
      console.log("📈 /trade/stats Response:", {
        data,
        dailyCount: data?.dailyTransactions?.length || 0,
        weeklyCount: data?.weeklyTransactions?.length || 0,
        monthlyCount: data?.monthlyTransactions?.length || 0,
        sampleDailyTx: data?.dailyTransactions?.[0],
      });
      
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transaction stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};