import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface USDTAddress {
  currency: string;
  network: string;
  address: string;
}

export const useUSDTAddresses = () => {
  const [addresses, setAddresses] = useState<USDTAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAddresses = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiService.getAllWalletAddresses('usdt');
      setAddresses(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const getAddressByNetwork = (network: string) => {
    return addresses.find(addr => addr.network === network)?.address;
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  return {
    addresses,
    loading,
    error,
    refetch: loadAddresses,
    getAddressByNetwork,
  };
};