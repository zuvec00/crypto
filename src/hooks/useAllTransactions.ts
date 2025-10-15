import { useState, useEffect } from "react";
import { apiService } from "../services/api";

export const useAllTransactions = () => {
  const [transactions, setTransactions] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllTransactions = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllTransactions();
      
      // Log the response structure for debugging
      console.log("🔥 /trade/all Response (Admin):", {
        data,
        count: data?.length || 0,
        firstTransaction: data?.[0],
        transactionFields: data?.[0] ? Object.keys(data[0]) : [],
      });
      
      setTransactions(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      console.error("❌ Error fetching all transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  return {
    transactions,
    loading,
    error,
    refetch: fetchAllTransactions,
  };
};

