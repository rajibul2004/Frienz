import { useState, useEffect, useRef, useCallback } from "react";
import { useSocket } from "../context/SocketContext";
import { messageApis } from "../api/chatApis";
import { authHooks } from "./authHooks";
import { toast } from "react-hot-toast";

export const useChat = (recipientId) => {
  const { emit, on, isConnected, socket } = useSocket();
  const { user } = authHooks.useGetUser();

  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sendingMessages, setSendingMessages] = useState(new Map());

  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);

  // =========================
  // LOAD CHAT HISTORY
  // =========================
  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);
      const data = await messageApis.getConversation(recipientId);
      setMessages(data || []);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  }, [recipientId]);

  // =========================
  // SCROLL TO BOTTOM
  // =========================
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    if (messages.length) scrollToBottom();
  }, [messages]);

  // =========================
  // REPLACE TEMP MESSAGE
  // =========================
  const replaceTempMessage = useCallback((tempId, realMessage) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === tempId ? { ...realMessage, pending: false } : msg
      )
    );

    setSendingMessages((prev) => {
      const copy = new Map(prev);
      copy.delete(tempId);
      return copy;
    });
  }, []);

  // =========================
  // SOCKET EVENTS
  // =========================
  useEffect(() => {
    if (!recipientId) return;

    loadHistory();

    const handleNewMessage = (msg) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    };

    const handleMessageSent = (msg) => {
      if (msg.tempId) {
        replaceTempMessage(msg.tempId, msg);
      } else {
        setMessages((prev) => [...prev, msg]);
      }
    };

    const handleMessageError = ({ tempId }) => {
      if (tempId) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === tempId ? { ...msg, failed: true } : msg
          )
        );
      }

      toast.error("Failed to send message");
    };

    const handleTyping = ({ from }) => {
      if (from !== recipientId) return;

      setIsTyping(true);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    };

    const handleStopTyping = ({ from }) => {
      if (from === recipientId) setIsTyping(false);
    };

    const handleMessageRead = ({ messageId, by }) => {
      if (by !== recipientId) return;

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, read: true } : msg
        )
      );
    };

    // =========================
    // REGISTER + CLEANUP HANDLERS
    // =========================
    const cleanup1 = on("new-message", handleNewMessage);
    const cleanup2 = on("message-sent", handleMessageSent);
    const cleanup3 = on("message-error", handleMessageError);
    const cleanup4 = on("user-start-typing", handleTyping);
    const cleanup5 = on("user-stop-typing", handleStopTyping);
    const cleanup6 = on("message-read", handleMessageRead);

    return () => {
      cleanup1?.();
      cleanup2?.();
      cleanup3?.();
      cleanup4?.();
      cleanup5?.();
      cleanup6?.();

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [recipientId, on, replaceTempMessage, loadHistory]);

  // =========================
  // SEND MESSAGE
  // =========================
  const sendMessage = useCallback(
    (text) => {
      if (!text.trim() || !recipientId || !isConnected) return;

      const tempId = crypto.randomUUID();

      const messageData = {
        _id: tempId,
        from: {
          _id: user?._id,
          name: user?.name,
          profilePic: user?.profilePic,
        },
        to: { _id: recipientId },
        message: text.trim(),
        type: "text",
        createdAt: new Date().toISOString(),
        pending: true,
      };

      setMessages((prev) => [...prev, messageData]);

      setSendingMessages((prev) => new Map(prev).set(tempId, true));

      emit("send-message", {
        to: recipientId,
        message: text.trim(),
        tempId,
      });
    },
    [recipientId, isConnected, emit, user]
  );

  // =========================
  // RETRY MESSAGE
  // =========================
  const retryMessage = useCallback(
    (tempId) => {
      const msg = messages.find((m) => m._id === tempId);
      if (!msg) return;

      setMessages((prev) => prev.filter((m) => m._id !== tempId));
      sendMessage(msg.message);
    },
    [messages, sendMessage]
  );

  return {
    messages,
    isTyping,
    loading,
    sendingMessages,
    sendMessage,
    retryMessage,
    isConnected,
    messagesEndRef,
  };
};