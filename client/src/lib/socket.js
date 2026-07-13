import { io } from "socket.io-client";

let socket;

// In dev, VITE_SERVER_URL points at your local API (e.g. http://localhost:4000/api).
// The socket server lives at the same host, just without the /api suffix.
// In production the app is served from the same origin as the API, so we
// let socket.io fall back to same-origin (undefined URL) unless an explicit
// VITE_SOCKET_URL is provided.
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
