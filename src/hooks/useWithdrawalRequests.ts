import { useState, useEffect } from "react";
import { API_CONFIG } from "../config/api";
const API_BASE_URL = API_CONFIG.BASE_URL;

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  ngnAmount: string;
  currency: string;
  cryptoAmount: string;
  transferId: string;
  status: "pending" | "completed" | "failed";
  transactionNote: string;
  createdAt: string;
  updatedAt: string;
}

export const useWithdrawalRequests = () => {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${API_BASE_URL}/trade/withdrawal-requests`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.status}`);
      }

      const data = await response.json();
      setRequests(data);
      setError(null);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to fetch withdrawal requests",
      );
    } finally {
      setLoading(false);
    }
  };

  const markAsCompleted = async (id: string) => {
    try {
      const token = localStorage.getItem("access_token");
      const url = `${API_BASE_URL}/trade/withdrawal-requests/${id}/complete`;

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Failed to mark as completed: ${response.status}`,
        );
      }

      await response.json();
      await fetchRequests();
    } catch (err: any) {
      console.error("Error marking as completed:", err);
      throw new Error(err.message || "Failed to mark as completed");
    }
  };

  const markAsFailed = async (id: string) => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch(
        `${API_BASE_URL}/trade/withdrawal-requests/${id}/fail`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to mark as failed: ${response.status}`,
        );
      }

      await fetchRequests();
    } catch (err: any) {
      console.error("Error marking as failed:", err);
      throw new Error(err.message || "Failed to mark as failed");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return {
    requests,
    loading,
    error,
    refetch: fetchRequests,
    markAsCompleted,
    markAsFailed,
  };
};
