import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { initializeSocket, disconnectSocket } from "../lib/socket";
import { authHooks } from "../hooks/authHooks";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};

// 💬 Message sound — soft 2-tone beep (low → high)
const playMessageSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);       // D5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);    // A5
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) { /* silently ignore */ }
};

// 🎉 Friend-request sound — ascending 3-note chime (distinct & celebratory)
const playFriendRequestSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    // Three short notes played in sequence
    const notes = [
      { freq: 523.25, start: 0,    dur: 0.18 },  // C5
      { freq: 659.25, start: 0.16, dur: 0.18 },  // E5
      { freq: 783.99, start: 0.32, dur: 0.28 },  // G5
    ];
    notes.forEach(({ freq, start, dur }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "triangle";  // warmer, bell-like tone
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.28, ctx.currentTime + start + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + dur);
    });
  } catch (e) { /* silently ignore */ }
};

// Route to the correct sound by notification type
const playSound = (type) => {
  if (type === "friend_request" || type === "friend_accepted") {
    playFriendRequestSound();
  } else {
    playMessageSound();
  }
};

// Rich custom toast for notifications
const showNotificationToast = ({ avatar, title, body }) => {
  toast.custom(
    (t) => (
      <div
        className={`${
          t.visible ? "animate-enter" : "animate-leave"
        } max-w-sm w-full pointer-events-auto flex items-start gap-3 p-3 rounded-2xl shadow-xl border border-white/10 milky:border-gray-200 bg-gray-900/90 milky:bg-white/95 backdrop-blur-2xl`}
        style={{ animation: t.visible ? "slideInRight 0.3s ease" : "fadeOut 0.3s ease" }}
      >
        <div className="w-10 h-10 rounded-full active p-0.5 flex-shrink-0">
          <div className="w-full h-full rounded-full overflow-hidden bg-gray-700">
            <img
              src={avatar || "/default-avatar.png"}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => (e.target.src = "/default-avatar.png")}
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white milky:text-gray-800 truncate">{title}</p>
          <p className="text-xs text-white/60 milky:text-gray-500 mt-0.5 truncate">{body}</p>
        </div>
      </div>
    ),
    { duration: 4000, position: "top-right" }
  );
};

export const SocketProvider = ({ children }) => {
  const { isAuthenticated, isLoading } = authHooks.useGetUser();
  const queryClient = useQueryClient();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const lastSoundTimestampRef = useRef(0);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = useCallback((notif) => {
    setNotifications((prev) => [notif, ...prev]);

    // Debounce sound: play at most once per second, use type-specific sound
    const now = Date.now();
    if (now - lastSoundTimestampRef.current > 1000) {
      lastSoundTimestampRef.current = now;
      playSound(notif.type);
    }
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const markRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  // Socket connection lifecycle
  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      disconnectSocket();
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
      disconnectSocket();
    };
  }, [isAuthenticated, isLoading]);

  // Online users listener
  useEffect(() => {
    if (!socket) return;

    const handleOnlineUsers = (users) => {
      setOnlineUsers(users);
    };

    socket.on("online-users", handleOnlineUsers);

    return () => {
      socket.off("online-users", handleOnlineUsers);
    };
  }, [socket]);

  // Notification event listeners
  useEffect(() => {
    if (!socket) return;

    // new-message
    const handleNewMessage = (messageData) => {
      const sender = messageData.from;
      const notif = {
        id: `msg-${messageData._id}-${Date.now()}`,
        type: "message",
        title: sender?.name || "Someone",
        body: messageData.type === "text"
          ? `sent you a message: ${(messageData.message || "").slice(0, 50)}`
          : "sent you a message",
        avatar: sender?.profilePic || null,
        createdAt: messageData.createdAt || new Date().toISOString(),
        read: false,
        data: { senderId: sender?._id, messageId: messageData._id },
      };
      addNotification(notif);
      showNotificationToast({ avatar: notif.avatar, title: notif.title, body: notif.body });
    };

    // friend-request-received
    const handleFriendRequestReceived = (payload) => {
      const notif = {
        id: `fr-${payload.requestId}-${Date.now()}`,
        type: "friend_request",
        title: payload.sender?.name || "Someone",
        body: "sent you a friend request",
        avatar: payload.sender?.profilePic || null,
        createdAt: payload.createdAt || new Date().toISOString(),
        read: false,
        data: { requestId: payload.requestId, sender: payload.sender },
      };
      addNotification(notif);
      showNotificationToast({ avatar: notif.avatar, title: notif.title, body: notif.body });
      // Invalidate friend-requests cache so the Notification page refreshes
      queryClient.invalidateQueries({ queryKey: ["friend-requests"] });
    };

    // friend-request-accepted
    const handleFriendRequestAccepted = (payload) => {
      const notif = {
        id: `fa-${payload.requestId}-${Date.now()}`,
        type: "friend_accepted",
        title: payload.acceptedBy?.name || "Someone",
        body: "accepted your friend request",
        avatar: payload.acceptedBy?.profilePic || null,
        createdAt: payload.createdAt || new Date().toISOString(),
        read: false,
        data: { requestId: payload.requestId, acceptedBy: payload.acceptedBy },
      };
      addNotification(notif);
      showNotificationToast({ avatar: notif.avatar, title: notif.title, body: notif.body });
      // Invalidate relevant caches
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["outgoing-friend-requests"] });
      queryClient.invalidateQueries({ queryKey: ["recommended-users"] });
    };

    socket.on("new-message", handleNewMessage);
    socket.on("friend-request-received", handleFriendRequestReceived);
    socket.on("friend-request-accepted", handleFriendRequestAccepted);

    return () => {
      socket.off("new-message", handleNewMessage);
      socket.off("friend-request-received", handleFriendRequestReceived);
      socket.off("friend-request-accepted", handleFriendRequestAccepted);
    };
  }, [socket, addNotification, queryClient]);

  // Emit event
  const emit = (event, data) => {
    if (socket?.connected) {
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
        notifications,
        unreadCount,
        markAllRead,
        markRead,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
