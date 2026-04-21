import { m } from "framer-motion";
import axiosInstance from "../lib/axios";

export const chatApis = {
  getConversation: async (userId, limit = 50, before = null) => {
    let url = `/chats/conversation/${userId}?limit=${limit}`;
    if (before) url += `&before=${before}`;
    const res = await axiosInstance.get(url);
    return res.data.messages;
  },
  markAsRead: async (userId, messageIds) => {
    await axiosInstance.put(`/chats/read/${userId}`, { messageIds });
  },
  getUnreadCount: async () => {
    const res = await axiosInstance.get('/chats/unread');
    return res.data.unreadCount;
  }
};