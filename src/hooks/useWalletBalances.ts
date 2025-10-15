import { useEffect, useState } from "react";
import { apiService } from "../services/api";

interface WalletBalance {
  currency: string;
  balance: string;
  locked: string;
  converted_balance: string;
}

export const useWalletBalances = () => {
  const [balances, setBalances] = useState<WalletBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalances = async () => {
    try {
      setLoading(true);
      const currencies = ['ngn', 'btc', 'eth', 'usdt'];
      
      // Fetch all balances in parallel
      const balancePromises = currencies.map(async (currency) => {
        try {
          const data = await apiService.getWalletBalance(currency);
          console.log(`💰 ${currency.toUpperCase()} Balance:`, data);
          return {
            currency,
            balance: data?.balance || '0',
            locked: data?.locked || '0',
            converted_balance: data?.converted_balance || '0',
          };
        } catch (err) {
          console.error(`Failed to fetch ${currency} balance:`, err);
          return {
            currency,
            balance: '0',
            locked: '0',
            converted_balance: '0',
          };
        }
      });

      const results = await Promise.all(balancePromises);
      console.log("✅ All Wallet Balances Fetched:", results);
      setBalances(results);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, []);

  return { balances, loading, error, refetch: fetchBalances };
};

