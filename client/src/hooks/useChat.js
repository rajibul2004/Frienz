// hooks/useChat.js
import { useSocket } from '../context/SocketContext';
import { authHooks } from './authHooks';
import { useEffect, useCallback, useState, useRef } from 'react';
import { chatApis } from '../api/chatApis';

export const useChat = (recipientId) => {
    const { emit, on, isConnected, socket, onlineUsers } = useSocket();
    const { user } = authHooks.useGetUser();
    const { user: recipient } = authHooks.useGetUserById(recipientId)
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isTyping, setIsTyping] = useState(false);

    const isOnline = onlineUsers?.includes(recipientId);

    const typingTimeoutRef = useRef(null);
    const messagesEndRef = useRef(null);


    const cache = useRef({});

    const loadHistory = useCallback(async () => {
        if (cache.current[recipientId]) {
            setMessages(cache.current[recipientId]);
            return;
        }

        try {
            setLoading(true);
            const data = await chatApis.getConversation(recipientId);
            cache.current[recipientId] = data;
            setMessages(data || []);
        } finally {
            setLoading(false);
        }
    }, [recipientId]);

    const markAsRead = useCallback(() => {
        const unreadIds = messages
            .filter(msg =>
                msg.to?._id === user._id &&
                msg.from?._id === recipientId &&
                msg.status !== 'read'
            )
            .map(msg => msg._id);

        if (unreadIds.length > 0) {
            emit('mark-read', {
                messageIds: unreadIds,
                from: recipientId
            });
        }
    }, [messages, recipientId, user, emit]);

    const sendTyping = useCallback(() => {
        if (!recipientId) return;

        emit("typing-start", { to: recipientId });

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            emit("typing-stop", { to: recipientId });
        }, 1500);
    }, [recipientId, emit]);

    useEffect(() => {
        const hasUnread = messages.some(
            msg =>
                msg.to?._id === user._id &&
                msg.from?._id === recipientId &&
                msg.status !== 'read'
        );

        if (hasUnread) {
            markAsRead();
        }
    }, [messages, markAsRead, user, recipientId]);

    const replaceTempMessage = useCallback((tempId, realMessage) => {
        setMessages((prev) =>
            prev.map((msg) =>
                msg._id === tempId ? { ...realMessage, pending: false } : msg
            )
        );
    }, []);



    const handleNewMessage = useCallback((msg) => {
        setMessages(prev => {
            if (prev.some(m => m._id === msg._id)) return prev;
            return [...prev, msg];
        });
    }, []);

    const handleMessageSent = useCallback((msg) => {
        if (msg.tempId) {
            replaceTempMessage(msg.tempId, msg);
        } else {
            setMessages((prev) => [...prev, msg]);
        }
    }, [replaceTempMessage]);

    const handleMessageError = useCallback(({ tempId }) => {
        if (!tempId) return;
        setMessages((prev) =>
            prev.map((msg) =>
                msg._id === tempId
                    ? { ...msg, pending: false, failed: true }
                    : msg
            )
        );
    }, []);

    const handleDelivered = useCallback(({ messageIds, deliveredAt }) => {
        setMessages(prev =>
            prev.map(msg =>
                messageIds.includes(msg._id)
                    ? { ...msg, status: 'delivered', deliveredAt }
                    : msg
            )
        );
    }, []);

    const handleMessageRead = useCallback(({ messageIds, by, readAt }) => {
        if (by !== recipientId) return;

        const idSet = new Set(messageIds);

        setMessages(prev =>
            prev.map(msg =>
                idSet.has(msg._id) && msg.from._id === user._id
                    ? { ...msg, status: 'read', readAt }
                    : msg
            )
        );
    }, [recipientId, user]);

    const handleTyping = useCallback(({ from }) => {
        if (from !== recipientId) return;

        setIsTyping(true);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
        }, 2000);
    }, [recipientId]);


    useEffect(() => {
        if (!socket || !recipientId) return;

        loadHistory();

        const cleanup1 = on('new-message', handleNewMessage);
        const cleanup2 = on('message-sent', handleMessageSent);
        const cleanup3 = on('messages-delivered', handleDelivered);
        const cleanup4 = on('messages-read', handleMessageRead);
        const cleanup5 = on('user-start-typing', handleTyping);
        const cleanup6 = on('user-stop-typing', ({ from }) => {
            if (from === recipientId) {
                setIsTyping(false);
            }
        });
        const cleanup7 = on('message-error', handleMessageError);
        return () => {
            cleanup1?.();
            cleanup2?.();
            cleanup3?.();
            cleanup4?.();
            cleanup5?.();
            cleanup6?.();
            cleanup7?.();
        }
    }, [socket, on, recipientId, loadHistory, handleNewMessage, handleMessageSent, handleDelivered, handleMessageRead, handleMessageError]);

    const sendMessage = useCallback((text) => {
        if (!text.trim() || !recipientId) return;

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
            pending: !isConnected ? false : true,
            failed: !isConnected,
        };
        setMessages(prev => [...prev, messageData]);

        if (!isConnected) return;

        emit('send-message', {
            to: recipientId,
            message: text.trim(),
            tempId: tempId,
        });
    }, [recipientId, isConnected, emit, user]);

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
        recipient,
        isOnline,
        isConnected,
        sendMessage,
        sendTyping,
        isTyping,
        messages,
        loading,
        retryMessage,
    };
};