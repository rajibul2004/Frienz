import React, { createContext, useContext, useEffect, useState } from "react";
import { initializeSocket, disconnectSocket } from "../lib/socket";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = initializeSocket(); // no token needed
    setSocket(newSocket);

    const handleConnect = () => {
      console.log("✅ Socket connected");
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    };

    const handleError = (err) => {
      console.error("Socket error:", err);
    };

    newSocket.on("connect", handleConnect);
    newSocket.on("disconnect", handleDisconnect);
    newSocket.on("connect_error", handleError);

    return () => {
      newSocket.off("connect", handleConnect);
      newSocket.off("disconnect", handleDisconnect);
      newSocket.off("connect_error", handleError);
      disconnectSocket(); // 🔥 important
    };
  }, []);

  // Emit event
  const emit = (event, data) => {
    if (socket?.connected) {
      console.log("Emitting event:", event, "with data:", data);
      socket.emit(event, data);
    } else {
      console.warn("Socket not connected:", event);
    }
  };

  // Listen to event
  const on = (event, callback) => {
    if (!socket) return;
    socket.on(event, callback);
    return () => socket.off(event, callback);
  };

  // Optional manual disconnect
  const disconnect = () => {
    disconnectSocket();
    setSocket(null);
    setIsConnected(false);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        emit,
        on,
        disconnect,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};