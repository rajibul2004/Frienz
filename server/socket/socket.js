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


        if (!onlineUsers.has(userId)) {
            onlineUsers.set(userId, new Set());
        }
        onlineUsers.get(userId).add(socket.id);
        socket.join(`user:${userId}`);
        io.emit("online-users", Array.from(onlineUsers.keys()));

        // ✅ AUTO MARK OLD MESSAGES AS DELIVERED WHEN USER COMES ONLINE
        (async () => {
            try {
                const undeliveredMessages = await MessageModel.find({
                    to: userId,
                    status: 'sent'
                }).select('_id from');

                if (undeliveredMessages.length === 0) return;

                const messageIds = undeliveredMessages.map(m => m._id);

                const deliveredAt = new Date();
                await MessageModel.updateMany(
                    { _id: { $in: messageIds } },
                    { status: 'delivered', deliveredAt }
                );

                const senderUpdates = {};
                undeliveredMessages.forEach(msg => {
                    const senderId = msg.from.toString();
                    if (!senderUpdates[senderId]) senderUpdates[senderId] = [];
                    senderUpdates[senderId].push(msg._id);
                });

                Object.entries(senderUpdates).forEach(([senderId, ids]) => {
                    const senderSockets = onlineUsers.get(senderId);

                    if (senderSockets) {
                        senderSockets.forEach(socketId => {
                            io.to(socketId).emit('messages-delivered', {
                                messageIds: ids,
                                deliveredAt
                            });
                        });
                    }
                });

            } catch (err) {
                console.error("Auto-delivery error:", err);
            }
        })();
        // Private message
        socket.on('send-message', async ({ to, message, type = 'text', replyTo = null, tempId }) => {
            try {
                const from = userId;
                if (!to || to === from) {
                    return socket.emit('message-error', { error: 'Invalid recipient', tempId });
                }
                if (type === 'text' && (!message || message.trim() === '')) {
                    return socket.emit('message-error', { error: 'Invalid message', tempId });
                }
                const recipient = await UserModel.findById(to).select("_id name profilePic");
                if (!recipient) {
                    return socket.emit('message-error', { error: 'Recipient not found', tempId });
                }

                let replyToId = null;
                if (replyTo) {
                    const repliedMessage = await MessageModel.findOne({
                        _id: replyTo,
                        $or: [{ from, to }, { from: to, to: from }],
                    }).select('_id');
                    if (repliedMessage) replyToId = repliedMessage._id;
                }

                const recipientSockets = onlineUsers.get(to);
                const isRecipientOnline = recipientSockets && recipientSockets.size > 0;

                const newMessage = new MessageModel({
                    from,
                    to,
                    message: type === 'text' ? message.trim() : message,
                    status: isRecipientOnline ? 'delivered' : 'sent',
                    type,
                    replyTo: replyToId,
                });
                await newMessage.save();

                const populatedMessage = await MessageModel.findById(newMessage._id)
                    .populate('from', 'name profilePic')
                    .populate('to', 'name profilePic')
                    .populate('replyTo', 'message type from')
                    .lean();

                const messageData = {
                    _id: populatedMessage._id,
                    from: populatedMessage.from,
                    to: populatedMessage.to,
                    message: populatedMessage.message,
                    type: populatedMessage.type,
                    status: populatedMessage.status,
                    replyTo: populatedMessage.replyTo,
                    reactions: populatedMessage.reactions || [],
                    isDeleted: populatedMessage.isDeleted,
                    isPinned: populatedMessage.isPinned,
                    createdAt: populatedMessage.createdAt
                };
                socket.emit('message-sent', { ...messageData, tempId });
                if (isRecipientOnline) {
                    recipientSockets.forEach(socketId => {
                        io.to(socketId).emit('new-message', messageData);
                    });

                    socket.emit('messages-delivered', {
                        messageIds: [messageData._id],
                        deliveredAt: new Date()
                    });
                }
            } catch (error) {
                console.error('Message error:', error);
                socket.emit('message-error', { error: error.message, tempId });
            }
        });

        // React to a message (toggle: same user + same emoji again removes it)
        socket.on('react-message', async ({ messageId, emoji }) => {
            try {
                if (!messageId || !emoji) return;

                const msg = await MessageModel.findOne({
                    _id: messageId,
                    $or: [{ from: userId }, { to: userId }],
                });
                if (!msg) return;

                const existingIndex = msg.reactions.findIndex(
                    r => r.user.toString() === userId && r.emoji === emoji
                );

                if (existingIndex !== -1) {
                    msg.reactions.splice(existingIndex, 1);
                } else {
                    msg.reactions = msg.reactions.filter(r => r.user.toString() !== userId);
                    msg.reactions.push({ user: userId, emoji });
                }
                await msg.save();

                const otherUserId = msg.from.toString() === userId ? msg.to.toString() : msg.from.toString();
                const payload = { messageId, reactions: msg.reactions };

                socket.emit('message-reaction', payload);
                const otherSockets = onlineUsers.get(otherUserId);
                if (otherSockets) {
                    otherSockets.forEach(socketId => io.to(socketId).emit('message-reaction', payload));
                }
            } catch (error) {
                console.error('React message error:', error);
            }
        });

        // Delete a message (soft delete, sender only)
        socket.on('delete-message', async ({ messageId }) => {
            try {
                if (!messageId) return;

                const msg = await MessageModel.findOne({ _id: messageId, from: userId });
                if (!msg) {
                    return socket.emit('message-error', { error: 'Message not found or not authorized' });
                }

                msg.isDeleted = true;
                msg.message = '';
                msg.isPinned = false;
                msg.pinnedBy = null;
                msg.pinnedAt = null;
                await msg.save();

                const payload = { messageId };
                socket.emit('message-deleted', payload);
                const otherUserId = msg.to.toString();
                const otherSockets = onlineUsers.get(otherUserId);
                if (otherSockets) {
                    otherSockets.forEach(socketId => io.to(socketId).emit('message-deleted', payload));
                }
            } catch (error) {
                console.error('Delete message error:', error);
            }
        });

        // Pin / unpin a message (either participant can pin)
        socket.on('pin-message', async ({ messageId, pinned }) => {
            try {
                if (!messageId) return;

                const msg = await MessageModel.findOne({
                    _id: messageId,
                    $or: [{ from: userId }, { to: userId }],
                    isDeleted: false,
                });
                if (!msg) return;

                msg.isPinned = !!pinned;
                msg.pinnedBy = msg.isPinned ? userId : null;
                msg.pinnedAt = msg.isPinned ? new Date() : null;
                await msg.save();

                const payload = {
                    messageId,
                    isPinned: msg.isPinned,
                    pinnedBy: msg.pinnedBy,
                    pinnedAt: msg.pinnedAt,
                };

                socket.emit('message-pin-updated', payload);
                const otherUserId = msg.from.toString() === userId ? msg.to.toString() : msg.from.toString();
                const otherSockets = onlineUsers.get(otherUserId);
                if (otherSockets) {
                    otherSockets.forEach(socketId => io.to(socketId).emit('message-pin-updated', payload));
                }
            } catch (error) {
                console.error('Pin message error:', error);
            }
        });

        // Mark messages as delivered
        socket.on('mark-delivered', async ({ messageIds }) => {
            try {
                if (!messageIds?.length) return;

                const deliveredAt = new Date();

                await MessageModel.updateMany(
                    {
                        _id: { $in: messageIds },
                        to: userId,
                        status: 'sent'
                    },
                    { status: 'delivered', deliveredAt }
                );

                // Notify senders about delivery
                const messages = await MessageModel.find({ _id: { $in: messageIds } }).select('from');
                const senderUpdates = {};
                messages.forEach(msg => {
                    const senderId = msg.from.toString();
                    if (!senderUpdates[senderId]) senderUpdates[senderId] = [];
                    senderUpdates[senderId].push(msg._id);
                });
                Object.entries(senderUpdates).forEach(([senderId, ids]) => {
                    const senderSockets = onlineUsers.get(senderId);
                    if (senderSockets) {
                        senderSockets.forEach(socketId => {
                            io.to(socketId).emit('messages-delivered', {
                                messageIds: ids,
                                deliveredAt
                            });
                        });
                    }
                });
            } catch (error) {
                console.error('Mark delivered error:', error);
            }
        });

        socket.on('mark-read', async ({ messageIds, from }) => {
            try {
                if (!messageIds?.length || from === userId) return;

                const readAt = new Date();

                // ✅ secure + correct query
                await MessageModel.updateMany(
                    {
                        _id: { $in: messageIds },
                        from: from,
                        to: userId,
                        status: { $in: ['sent', 'delivered'] }
                    },
                    {
                        $set: { status: 'read', readAt }
                    }
                );

                // ✅ always treat as array
                const senderSockets = onlineUsers.get(from) || [];

                senderSockets.forEach(socketId => {
                    io.to(socketId).emit('messages-read', {
                        messageIds,
                        by: userId,
                        readAt
                    });
                });

            } catch (error) {
                console.error('Mark read error:', error);
            }
        });

        socket.on('typing-start', ({ to }) => {
            if (!to || to === userId) return;
            const recipientSockets = onlineUsers.get(to) || [];

            recipientSockets.forEach(socketId => {
                io.to(socketId).emit('user-start-typing', { from: userId });
            });
        });
        socket.on('typing-stop', ({ to }) => {
            if (!to || to === userId) return;
            const recipientSockets = onlineUsers.get(to) || [];

            recipientSockets.forEach(socketId => {
                io.to(socketId).emit('user-stop-typing', { from: userId });
            });
        });

        socket.on('disconnect', () => {
            console.log(`❌ User disconnected: ${userId}`);

            const userSockets = onlineUsers.get(userId);
            if (userSockets) {
                userSockets.delete(socket.id);
                if (userSockets.size === 0) {
                    onlineUsers.delete(userId);
                }
            }
            io.emit("online-users", Array.from(onlineUsers.keys()));
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