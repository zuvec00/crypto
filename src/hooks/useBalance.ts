import { useEffect, useState } from "react";
import { API_CONFIG } from "../config/api";
const API_BASE_URL = API_CONFIG.BASE_URL;

interface Balance {
  name: string;
  currency: string;
  deposit_address: string;
  lockedBalance: string;
  staked: string;
  address: string;
  converted_balance: string;
  reference_currency: string;
  is_crypto: boolean;
  default_network: any;
  networks: any;
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
