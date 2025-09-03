import { useState, useEffect } from "react";
import { apiService, LoginRequest } from "../services/api";
import { isTokenExpired } from "../utils/jwt";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "worker";
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        if (isTokenExpired(token)) {
          try {
            await apiService.refreshToken();
            const userData = apiService.getUserFromToken();
            if (userData) {
              setUser({
                id: userData.sub,
                name: userData.name,
                email: userData.email,
                role: userData.role,
              });
            }
          } catch {
            localStorage.removeItem("access_token");
          }
        } else {
          const userData = apiService.getUserFromToken();
          if (userData) {
            setUser({
              id: userData.sub,
              name: userData.name,
              email: userData.email,
              role: userData.role,
            });
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    setError(null);
    setLoading(true);
    try {
      await apiService.login(credentials);
      const userData = apiService.getUserFromToken();
      if (userData) {
        setUser({
          id: userData.sub,
          name: userData.name,
          email: userData.email,
          role: userData.role,
        });
      }
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await apiService.logout();
    setUser(null);
  };

  return { user, login, logout, loading, error };
};
