import { io } from "socket.io-client";

let socket;


const getSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }

  if (import.meta.env.MODE === "development" && import.meta.env.VITE_SERVER_URL) {
    return import.meta.env.VITE_SERVER_URL.replace(/\/api\/?$/, "");
  }

  // production default: same origin as the page
  return undefined;
};

export const initializeSocket = () => {
  if (socket) return socket;

  socket = io(getSocketUrl(), {
    withCredentials: true,
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};
