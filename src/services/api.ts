import { API_CONFIG } from "../config/api";
import { decodeJWT, isTokenExpired } from "../utils/jwt";

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("access_token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async login(credentials: LoginRequest): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data: LoginResponse = await response.json();
    localStorage.setItem("access_token", data.accessToken);
    return data.accessToken;
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      localStorage.removeItem("access_token");
    }
  }

  async refreshToken(): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Token refresh failed");
    }

    const data = await response.json();
    localStorage.setItem("access_token", data.access_token);
    return data.access_token;
  }

  getUserFromToken(): any {
    const token = localStorage.getItem("access_token");
    if (!token || isTokenExpired(token)) {
      return null;
    }
    return decodeJWT(token);
  }

  async createWalletAddress(currency: string, network?: string): Promise<any> {
    const url = network 
      ? `${API_BASE_URL}/wallet/${currency}/address?network=${network}`
      : `${API_BASE_URL}/wallet/${currency}/address`;
      
    const response = await fetch(url, {
      method: "POST",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || "Failed to create wallet address");
    }

    return response.json();
  }

  async getWalletAddress(currency: string, network?: string): Promise<any> {
    const url = network 
      ? `${API_BASE_URL}/wallet/${currency}/address?network=${network}`
      : `${API_BASE_URL}/wallet/${currency}/address`;
      
    const response = await fetch(url, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || "Failed to get wallet address");
    }

    return response.json();
  }

  async getWalletBalance(currency: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/wallet/${currency}/balance`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || "Failed to get wallet balance");
    }

    return response.json();
  }

  async getAllWalletAddresses(currency: string): Promise<any> {
    const response = await fetch(
      `${API_BASE_URL}/wallet/${currency}/addresses`,
      {
        method: "GET",
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || "Failed to get wallet addresses");
    }

    return response.json();
  }

  async buyCrypto(ask: string, total: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/trade/buy`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ ask, total }),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || "Failed to buy crypto");
    }

    return response.json();
  }

  async sellCrypto(ask: string, volume: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/trade/sell`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ ask, volume }),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || "Failed to sell crypto");
    }

    return response.json();
  }

  async requoteOrder(orderId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/trade/requote/${orderId}`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || "Failed to requote order");
    }

    return response.json();
  }

  async getRates(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/trade/rates`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || "Failed to get rates");
    }

    return response.json();
  }

  async getUsers(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/user`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || "Failed to get users");
    }

    return response.json();
  }

  async getUsersWithBalances(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/user/with-balances`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || "Failed to get users with balances");
    }

    return response.json();
  }

  async toggleUserStatus(userId: string): Promise<any> {
    const response = await fetch(
      `${API_BASE_URL}/user/${userId}/toggle-status`,
      {
        method: "POST",
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || "Failed to toggle user status");
    }

    return response.json();
  }

  async addUser(userData: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...userData, role: "worker" }),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || "Failed to add user");
    }

    return response.json();
  }

  async getTransactionStats(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/trade/stats`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || "Failed to get transaction stats");
    }

    return response.json();
  }

  async getVolumeTraded(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/trade/volume-traded`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || "Failed to get volume traded");
    }

    return response.json();
  }

  async createUSDTAllNetworks(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/wallet/usdt/create-all-networks`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || "Failed to create USDT networks");
    }

    return response.json();
  }
}

export const apiService = new ApiService();
