import { useState, useEffect, useRef } from "react";
import { API_CONFIG } from "../config/api";
const API_BASE_URL = API_CONFIG.BASE_URL;

interface Rate {
  marker: string;
  buy: string;
  sell: string;
  last: string;
}

export const useRates = () => {
  const [rates, setRates] = useState<Rate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchRates = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(`${API_BASE_URL}/trade/rates`, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch rates");

      const data = await response.json();
      setRates(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    intervalRef.current = setInterval(fetchRates, 60000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { rates, loading, error, refetch: fetchRates };
};
