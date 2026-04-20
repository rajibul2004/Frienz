import React, { createContext, useContext, useEffect, useState } from "react";
import { initializeSocket, disconnectSocket } from "../lib/socket";
import { authHooks } from "../hooks/authHooks";
const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { isAuthenticated, isLoading } = authHooks.useGetUser();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      disconnectSocket(); // cleanup if user logged out
      setSocket(null);
      setIsConnected(false);
      return;
    }
    const newSocket = initializeSocket();
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
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    if (!socket) return;

    const handleOnlineUsers = (users) => {
      console.log("Online users:", users);
      setOnlineUsers(users);
    };

    socket.on("online-users", handleOnlineUsers);

    return () => {
      socket.off("online-users", handleOnlineUsers);
    };
  }, [socket]);

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
    if (!socket) return () => {};
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
        onlineUsers,
        on,
        disconnect,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
