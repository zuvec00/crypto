import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { apiService } from "../services/api";
import { API_CONFIG } from "../config/api";

const API_BASE_URL = (API_CONFIG.BASE_URL as string).replace("/api", "");

export const useWebSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const user = apiService.getUserFromToken();
    if (!user?.quidaxSubAccountId) return;

    // Connect to WebSocket with user ID
    socketRef.current = io(API_BASE_URL, {
      query: {
        userId: user.quidaxSubAccountId,
      },
    });

    // Listen for withdrawal success notifications
    socketRef.current.on("withdraw.success", (data) => {
      console.log("Withdrawal completed:", data);

      // You can tweak this part to show the notification somehow
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Withdrawal Successful", {
          body: `${
            data.data.amount
          } ${data.data.currency.toUpperCase()} withdrawal completed`,
          icon: "/favicon.ico",
        });
      }
    });

    // Listen for withdrawal success notifications
    socketRef.current.on("connection.success", (data) => {
      console.log("Connection to web socket confirmed:", data);
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
