import { create } from 'zustand';
import { apiService, LoginRequest } from '../services/api';
import { isTokenExpired } from '../utils/jwt';

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "worker";
  quidaxSubAccountId: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  initializing: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  initializing: true,
  error: null,

  initAuth: async () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      if (isTokenExpired(token)) {
        try {
          await apiService.refreshToken();
          const userData = apiService.getUserFromToken();
          if (userData) {
            set({
              user: {
                id: userData.sub,
                name: userData.name,
                email: userData.email,
                role: userData.role,
                quidaxSubAccountId: userData.quidaxSubAccountId,
              },
              initializing: false,
            });
            return;
          }
        } catch {
          localStorage.removeItem("access_token");
        }
      } else {
        const userData = apiService.getUserFromToken();
        if (userData) {
          set({
            user: {
              id: userData.sub,
              name: userData.name,
              email: userData.email,
              role: userData.role,
              quidaxSubAccountId: userData.quidaxSubAccountId,
            },
            initializing: false,
          });
          return;
        }
      }
    }
    set({ initializing: false });
  },

  login: async (credentials: LoginRequest) => {
    set({ error: null, loading: true });
    try {
      await apiService.login(credentials);
      const userData = apiService.getUserFromToken();
      if (userData) {
        set({
          user: {
            id: userData.sub,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            quidaxSubAccountId: userData.quidaxSubAccountId,
          },
          loading: false,
        });
        return true;
      }
      return false;
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Login failed",
        loading: false,
      });
      return false;
    }
  },

  logout: async () => {
    await apiService.logout();
    set({ user: null });
  },
}));