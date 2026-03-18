import { useState, useEffect, useRef } from "react";
import { API_CONFIG } from "../config/api";
const API_BASE_URL = API_CONFIG.BASE_URL;

export const useAllTransactions = () => {
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchAllTransactions = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(`${API_BASE_URL}/trade/all`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.status}`);
      }

      const data = await response.json();
      
      setAllTransactions(data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching admin transactions:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTransactions();
    intervalRef.current = setInterval(fetchAllTransactions, 60000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const refetch = async () => {
    setLoading(true);
    await fetchAllTransactions();
  };

  return {
    allTransactions,
    loading,
    error,
    refetch,
  };
};