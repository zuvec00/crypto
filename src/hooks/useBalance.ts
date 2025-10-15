import { useEffect, useState } from "react";
import { API_CONFIG } from "../config/api";
const API_BASE_URL = API_CONFIG.BASE_URL;

interface Balance {
  name?: string;
  currency: string;
  deposit_address?: string;
  balance?: string;  // Available balance - might be different field name in API
  locked?: string;   // Alternative field name for locked balance
  lockedBalance?: string;  // Locked/staked balance
  staked?: string;
  address?: string;
  converted_balance?: string;
  reference_currency?: string;
  is_crypto?: boolean;
  default_network?: any;
  networks?: any;
  // Add any other possible field names the API might return
  [key: string]: any;
}

export const useBalance = () => {
  const [balance, setBalance] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(`${API_BASE_URL}/wallet/balance`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch rates");

      const data = await response.json();
      
      // Log the balance data to see the structure
      console.log("💼💼💼 /wallet/balance API Response (DETAILED):", {
        rawData: data,
        dataType: Array.isArray(data) ? 'Array' : typeof data,
        count: data?.length || 0,
        allBalances: data,
        usdtBalance: Array.isArray(data) ? data.find(b => b.currency === 'usdt') : null,
        firstBalance: data?.[0],
        balanceFields: data?.[0] ? Object.keys(data[0]) : [],
        allFieldsAndValues: data?.[0] ? Object.entries(data[0]) : [],
      });

      // Extra logging for USDT specifically
      const usdtData = Array.isArray(data) ? data.find(b => b.currency === 'usdt') : null;
      if (usdtData) {
        console.log("🔍 USDT Balance Detail:", {
          fullObject: usdtData,
          allFieldsWithValues: Object.entries(usdtData),
          balanceField: usdtData.balance,
          lockedField: usdtData.locked,
          lockedBalanceField: usdtData.lockedBalance,
        });
      }
      
      setBalance(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return { balance, loading, error, fetchBalance };
};
