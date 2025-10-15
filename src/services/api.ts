/* eslint-disable @typescript-eslint/no-explicit-any */
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
    const requestBody = { ask, total };
    console.log("🛒 Buy Crypto Request:", requestBody);

    const response = await fetch(`${API_BASE_URL}/trade/buy`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      console.error("❌ Buy Crypto Error:", error);
      throw new Error(error.message || "Failed to buy crypto");
    }

    const data = await response.json();
    console.log("✅ Buy Crypto Success:", data);
    return data;
  }

  async sellCrypto(ask: string, volume: string): Promise<any> {
    const requestBody = { ask, volume };
    console.log("💸 Sell Crypto Request:", requestBody);

    const response = await fetch(`${API_BASE_URL}/trade/sell`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      console.error("❌ Sell Crypto Error:", error);
      throw new Error(error.message || "Failed to sell crypto");
    }

    const data = await response.json();
    console.log("✅ Sell Crypto Success:", data);
    return data;
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

  async getAllTransactions(params?: {
    market?: string;
    state?: string;
    side?: string;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.market) queryParams.append('market', params.market);
    if (params?.state) queryParams.append('state', params.state);
    if (params?.side) queryParams.append('side', params.side);
    
    const queryString = queryParams.toString();
    const url = queryString 
      ? `${API_BASE_URL}/trade/all?${queryString}`
      : `${API_BASE_URL}/trade/all`;

    const response = await fetch(url, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || "Failed to get all transactions");
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

  async withdrawCrypto(data: {
    currency: string;
    amount: string;
    fund_uid: string;
    network?: string;
    transaction_note?: string;
    reference?: string;
    narration?: string;
  }): Promise<unknown> {
    const requestBody: any = {
      currency: data.currency,
      amount: data.amount,
      fund_uid: data.fund_uid,
      transaction_note: data.transaction_note || "Crypto withdrawal",
      narration: data.narration || `Send ${data.amount} ${data.currency.toUpperCase()}`,
    };

    const response = await fetch(`${API_BASE_URL}/trade/send_crypto`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || "Failed to send crypto");
    }

    return response.json();
  }
}

export const apiService = new ApiService();
