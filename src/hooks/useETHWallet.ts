import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface ETHWallet {
  address?: string;
  balance?: string;
  lockedBalance?: string;
  convertedBalance?: string;
  status?: 'pending' | 'ready';
}

export const useETHWallet = () => {
  const [wallet, setWallet] = useState<ETHWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWalletAddress = async () => {
    try {
      return await apiService.getWalletAddress('eth');
    } catch (err) {
      console.error('Error fetching wallet address:', err);
      throw err;
    }
  };

  const fetchWalletBalance = async () => {
    try {
      return await apiService.getWalletBalance('eth');
    } catch (err) {
      console.error('Error fetching wallet balance:', err);
      throw err;
    }
  };

  const loadWallet = async () => {
    setLoading(true);
    setError(null);

    try {
      const addressData = await fetchWalletAddress();
      
      if (addressData.status === 'pending') {
        setWallet({ status: 'pending' });
        return;
      }

      const balanceData = await fetchWalletBalance();
      
      setWallet({
        address: addressData.address,
        balance: balanceData?.balance || '0.000000000000000000',
        lockedBalance: balanceData?.locked || '0.000000000000000000',
        convertedBalance: balanceData?.converted_balance || '0.00',
        status: 'ready',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const createWallet = async () => {
    // Backend auto-creates wallet, just reload
    await loadWallet();
  };

  useEffect(() => {
    loadWallet();
  }, []);

  return {
    wallet,
    loading,
    error,
    refetch: loadWallet,
    createWallet,
  };
};