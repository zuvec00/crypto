import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface NGNWallet {
  balance?: string;
  lockedBalance?: string;
  status?: 'ready';
}

export const useNGNWallet = () => {
  const [wallet, setWallet] = useState<NGNWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWalletBalance = async () => {
    try {
      return await apiService.getWalletBalance('ngn');
    } catch (err) {
      console.error('Error fetching NGN wallet balance:', err);
      throw err;
    }
  };

  const loadWallet = async () => {
    setLoading(true);
    setError(null);

    try {
      const balanceData = await fetchWalletBalance();
      
      setWallet({
        balance: balanceData?.balance || '0.00',
        lockedBalance: balanceData?.locked || '0.00',
        status: 'ready',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallet();
  }, []);

  const createWallet = async () => {
    // NGN wallet doesn't need address creation, just load balance
    await loadWallet();
  };

  return {
    wallet,
    loading,
    error,
    refetch: loadWallet,
    createWallet,
  };
};