import { useState, useEffect } from "react";
import { apiService } from "../services/api";

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  status: string;
  avatar?: string;
  balance: string;
  quidaxSubAccountId?: string;
  wallets: Array<{
    currency: string;
    address: string;
  }>;
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiService.getUsersWithBalances();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserStatus = async (userId: string) => {
    try {
      await apiService.toggleUserStatus(userId);
      // Update user status locally instead of refetching all users
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                status: user.status === "active" ? "inactive" : "active",
              }
            : user
        )
      );
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error:
          err instanceof Error ? err.message : "Failed to toggle user status",
      };
    }
  };

  const addUser = async (userData: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }) => {
    try {
      const result = await apiService.addUser(userData);
      // Add new user to the list
      const newUser = {
        ...result.user,
        balance: "0.00",
        wallets: [],
      };
      setUsers((prevUsers) => [...prevUsers, newUser]);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to add user",
      };
    }
  };

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    toggleUserStatus,
    addUser,
  };
};
