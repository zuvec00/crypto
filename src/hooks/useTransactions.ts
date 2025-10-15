import { useState, useEffect, useRef } from "react";
import { API_CONFIG } from "../config/api";
const API_BASE_URL = API_CONFIG.BASE_URL;

export const useTransactions = () => {
  const [trasactions, setTransactions] = useState<any[]>([]);
  const [dailyTransaction, setDailyTransaction] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(`${API_BASE_URL}/trade`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch rates");

      const data = await response.json();
      
      // Log the /trade endpoint response structure
      console.log("💰 /trade Endpoint Response:", {
        data,
        count: data?.length || 0,
        firstTransaction: data?.[0],
        transactionFields: data?.[0] ? Object.keys(data[0]) : [],
      });
      
      setTransactions(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyTransactions = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${API_BASE_URL}/trade?start_date=${
          new Date().toISOString().split("T")[0]
        }`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch rates");

      const data = await response.json();
      
      // Log the daily transactions response
      console.log("📅 /trade?start_date=TODAY Response:", {
        data,
        count: data?.length || 0,
        firstTransaction: data?.[0],
        todayDate: new Date().toISOString().split("T")[0],
      });
      
      setDailyTransaction(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchDailyTransactions();
    intervalRef.current = setInterval(fetchTransactions, 60000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const refetchAll = async () => {
    console.log("🔄 Refetching all transactions...");
    await fetchTransactions();
    await fetchDailyTransactions();
  };

  return {
    trasactions,
    dailyTransaction,
    loading,
    error,
    refetch: refetchAll,
  };
};
