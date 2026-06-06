import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { apiService } from "../services/api";
import { API_CONFIG } from "../config/api";

const API_BASE_URL = (API_CONFIG.BASE_URL as string).replace("/api", "");

interface WebSocketCallbacks {
  onBalanceUpdate?: (coin: string) => void;
}

export const useWebSocket = (callbacks?: WebSocketCallbacks) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const user = apiService.getUserFromToken();
    if (!user?.quidaxSubAccountId) return;

    socketRef.current = io(API_BASE_URL, {
      query: {
        userId: user.quidaxSubAccountId,
      },
    });

    socketRef.current.on("connection.success", (data) => {
      console.log("Connection to web socket confirmed:", data);
    });

    socketRef.current.on("balance.update", (data: { coin: string }) => {
      callbacks?.onBalanceUpdate?.(data.coin);
    });

    socketRef.current.on("withdraw.success", (data) => {
      console.log("Withdrawal completed:", data);
      callbacks?.onBalanceUpdate?.(data.data.currency);

      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Withdrawal Successful", {
          body: `${data.data.amount} ${data.data.currency.toUpperCase()} withdrawal completed`,
          icon: "/favicon.ico",
        });
      }
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return {
    socket: socketRef.current,
  };
};
