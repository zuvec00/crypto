import { useState, useEffect } from "react";
import { apiService } from "../services/api";

interface TrendData {
  date: string;
  count: number;
}

export function useTransactionTrend() {
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        const stats = await apiService.getTransactionStats();

        // Use monthly transactions to create 7-day trend
        const days = 7;
        const data: TrendData[] = [];

        for (let i = days - 1; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split("T")[0];

          // Count transactions for this date from monthly data
          const count =
            stats.monthlyTransactions?.filter((tx) => {
              try {
                const txDate = new Date(tx.date);
                if (isNaN(txDate.getTime())) return false;

                const txDateStr = txDate.toISOString().split("T")[0];
                return txDateStr === dateStr;
              } catch (error) {
                console.warn("Invalid date in transaction:", tx.date);
                return false;
              }
            }).length || 0;

          data.push({ date: dateStr, count });
        }

        setTrendData(data);
      } catch (error) {
        console.error("Error fetching trend data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendData();
  }, []);

  return { trendData, loading };
}
