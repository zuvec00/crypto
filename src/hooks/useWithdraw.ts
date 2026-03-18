import { useState } from "react";
import { apiService } from "../services/api";

interface WithdrawResult {
  success: boolean;
  data?: any;
  error?: string;
}

export const useWithdraw = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const withdrawToBank = async (
    ngnAmount: number,
    currency: string,
    bankDetails: {
      accountNumber: string;
      bankName: string;
      accountName: string;
    }
  ): Promise<WithdrawResult> => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiService.withdrawToBank(ngnAmount, currency, bankDetails);
      setLoading(false);
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to process withdrawal";
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  return {
    withdrawToBank,
    loading,
    error,
  };
};