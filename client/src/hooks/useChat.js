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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const replaceTempMessage = useCallback((tempId, realMessage) => {
        setMessages((prev) =>
            prev.map((msg) =>
                msg._id === tempId ? { ...realMessage, pending: false } : msg
            )
        );
    }, []);

    useEffect(() => {
        if (messages.length) scrollToBottom();
    }, [messages]);


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

    const handleDelivered = useCallback(({ messageIds, deliveredAt }) => {
        setMessages(prev =>
            prev.map(msg =>
                messageIds.includes(msg._id)
                    ? { ...msg, status: 'delivered', deliveredAt }
                    : msg
            )
        );
    }, []);
    

    useEffect(() => {
        if (!socket || !recipientId) return;

        loadHistory();

        const cleanup1 = on('new-message', handleNewMessage);
        const cleanup2 = on('message-sent', handleMessageSent);
        const cleanup3 = on('messages-delivered', handleDelivered);
        return () => {
            cleanup1?.();
            cleanup2?.();
            cleanup3?.();
        }
    }, [socket, on, recipientId, loadHistory, handleNewMessage, handleMessageSent, handleDelivered]);

    const sendMessage = useCallback((text) => {
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
        setMessages(prev => [...prev, messageData]);

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
        messages,
        loading,
        retryMessage,
    };
};