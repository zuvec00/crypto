import { useState } from 'react';
import { apiService } from '../services/api';

interface TradeResult {
  success: boolean;
  data?: any;
  error?: string;
}

export const useTrade = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buyCrypto = async (ask: string, total: string): Promise<TradeResult> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiService.buyCrypto(ask, total);
      setLoading(false);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to buy crypto';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const sellCrypto = async (ask: string, volume: string): Promise<TradeResult> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiService.sellCrypto(ask, volume);
      setLoading(false);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sell crypto';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const requoteOrder = async (orderId: string): Promise<TradeResult> => {
    try {
      const result = await apiService.requoteOrder(orderId);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to requote order';
      return { success: false, error: errorMessage };
    }
  };

  return {
    buyCrypto,
    sellCrypto,
    requoteOrder,
    loading,
    error,
  };
};