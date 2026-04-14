// hooks/useChat.js
import { useSocket } from '../context/SocketContext';
import { authHooks } from './authHooks';
import { useEffect,useCallback,useState } from 'react';

export const useChat = (recipientId) => {
    const { emit, on, isConnected, socket, onlineUsers } = useSocket();
    const { user } = authHooks.useGetUser();
    const { user: recipient } = authHooks.useGetUserById(recipientId)
    const isOnline = onlineUsers.includes(recipientId);
    const [messages, setMessages] = useState([]);

    const handleNewMessage = (msg) => {
        setMessages(prev => {
            // if (prev.some(m => m._id === msg._id)) return prev;
            return [...prev, msg];
        });
    };

    useEffect(() => {
        if (!socket || !recipientId) return;

        on('new-message', handleNewMessage);
    }, [socket, on, recipientId]);

    const sendMessage = useCallback((text) => {
        if (!text.trim() ||text.trim()=="" || !recipientId || !isConnected) return;

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