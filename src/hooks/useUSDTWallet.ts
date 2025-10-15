import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface USDTAddress {
  network: string;
  address: string;
  status?: 'pending' | 'ready';
}

interface USDTWallet {
  addresses?: USDTAddress[];
  balance?: string;
  convertedBalance?: string;
  lockedBalance?: string;
  status?: 'pending' | 'ready';
}

const USDT_NETWORKS = ['erc20', 'trc20', 'bep20'];

export const useUSDTWallet = () => {
  const [wallet, setWallet] = useState<USDTWallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWalletBalance = async () => {
    try {
      return await apiService.getWalletBalance('usdt');
    } catch (err) {
      console.error('Error fetching wallet balance:', err);
      throw err;
    }
  };

  const loadWallet = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all addresses at once
      const addressesData = await apiService.getAllWalletAddresses('usdt');
      const addresses = Array.isArray(addressesData) ? addressesData.map(addr => ({
        network: addr.network,
        address: addr.address,
        status: 'ready' as const
      })) : [];
      
      // Fetch balance
      const balanceData = await fetchWalletBalance();
      
      console.log("💵 /wallet/usdt/balance Response (Individual Wallet):", {
        balanceData,
        balanceField: balanceData?.balance,
        lockedField: balanceData?.locked,
        convertedBalanceField: balanceData?.converted_balance,
        allFields: balanceData ? Object.entries(balanceData) : [],
      });
      
      setWallet({
        addresses,
        balance: balanceData?.balance || '0.000000',
        lockedBalance: balanceData?.locked || '0.000000',
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
    setLoading(true);
    try {
      await apiService.createUSDTAllNetworks();
      await loadWallet();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create USDT wallets');
    } finally {
      setLoading(false);
    }
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