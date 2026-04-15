import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import UserModel from '../models/userModel.js';
import MessageModel from '../models/messageModel.js';

const onlineUsers = new Map();

let io = null;

export const initializeSocket = (server, corsOptions) => {
    io = new Server(server, {
        cors: corsOptions,
        transports: ['websocket', 'polling'],
    });

    io.use(async (socket, next) => {
        try {
            const cookies = socket.request.headers.cookie || "";
            if (!cookies) {
                return next(new Error("Authentication required"));
            }
            const parsed = cookie.parse(cookies);
            const token = parsed.token;

            if (!token) {
                return next(new Error("No token found"));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id;
            next();
        } catch (err) {
            console.error('Socket auth error:', err);
            next(new Error('Invalid token'));
        }
    });

    io.on('connection', (socket) => {
        const userId = socket.userId;
        console.log(`✅ User connected: ${userId}`);

        onlineUsers.set(userId, socket.id);
        socket.join(`user:${userId}`);
        socket.broadcast.emit("online-users", Array.from(onlineUsers.keys()));

        // Private message
        socket.on('send-message', async ({ to, message, type = 'text', replyTo = null, tempId = "abc123", emojiReaction = null }) => {
            try {
                const from = userId;
                if (!to || (type === 'text' && (!message || message.trim() === ''))) {
                    return socket.emit('message-error', { error: 'Invalid message', tempId });
                }
                const recipient = await UserModel.findById(to).select("_id name profilePic");
                if (!recipient) {
                    socket.emit('message-error', { error: 'Recipient not found' });
                    return;
                }
                const recipientSocketId = onlineUsers.get(to);
                const initialStatus = recipientSocketId ? 'delivered' : 'sent';

                const newMessage = new MessageModel({
                    from,
                    to,
                    message: message.trim(),
                    status: initialStatus,
                    type,
                });
                await newMessage.save();

                const populatedMessage = await MessageModel.findById(newMessage._id)
                    .populate('from', 'name profilePic')
                    .populate('to', 'name profilePic')
                    .lean();

                const messageData = {
                    _id: populatedMessage._id,
                    from: populatedMessage.from,
                    to: populatedMessage.to,
                    message: populatedMessage.message,
                    type: populatedMessage.type,
                    status: populatedMessage.status,
                    createdAt: populatedMessage.createdAt
                };
                socket.emit('message-sent', { ...messageData, tempId });
            } catch (error) {
                console.error('Message error:', error);
                socket.emit('message-error', { error: error.message, tempId });
            }
        });

        socket.on('disconnect', () => {
            console.log(`❌ User disconnected: ${userId}`);

            onlineUsers.delete(userId);
            socket.broadcast.emit('user-offline', { userId });
        });
    });



    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

export const getOnlineUsers = () => onlineUsers;