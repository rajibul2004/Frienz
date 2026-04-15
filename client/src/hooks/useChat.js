// hooks/useChat.js
import { useSocket } from '../context/SocketContext';
import { authHooks } from './authHooks';
import { useEffect, useCallback, useState, useRef } from 'react';
import { chatApis } from '../api/chatApis';

export const useChat = (recipientId) => {
    const { emit, on, isConnected, socket, onlineUsers } = useSocket();
    const { user } = authHooks.useGetUser();
    const { user: recipient } = authHooks.useGetUserById(recipientId)
    const isOnline = onlineUsers.includes(recipientId);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const pendingMessagesRef = useRef(new Map());
    const typingTimeoutRef = useRef(null);
    const messagesEndRef = useRef(null);


    const loadHistory = useCallback(async () => {
        try {
            setLoading(true);
            const messages = await chatApis.getConversation(recipientId);
            setMessages(messages || []);
        } catch (error) {
            console.error('Failed to load messages:', error);
        } finally {
            setLoading(false);
        }
    }, [recipientId]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    useEffect(() => {
        if (messages.length) scrollToBottom();
    }, [messages]);


    const handleNewMessage = (msg) => {
        setMessages(prev => {
            // if (prev.some(m => m._id === msg._id)) return prev;
            return [...prev, msg];
        });
    };

    useEffect(() => {
        if (!socket || !recipientId) return;

        loadHistory();

        on('new-message', handleNewMessage);
    }, [socket, on, recipientId]);

    const sendMessage = useCallback((text) => {
        if (!text.trim() || text.trim() == "" || !recipientId || !isConnected) return;

        setMessages(prev => [...prev, text]);

        emit('send-message', {
            to: recipientId,
            message: text.trim(),
        });
    }, [recipientId, isConnected, emit]);

    return {
        recipient,
        isOnline,
        isConnected,
        sendMessage,
        messages
    };
};