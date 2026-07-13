import MessageModel from "../models/messageModel.js";
import UserModel from "../models/userModel.js";

export const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId;
    const { limit = 50, before } = req.query;

    const query = {
      $or: [
        { from: currentUserId, to: userId },
        { from: userId, to: currentUserId }
      ]
    };

    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await MessageModel.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('from', 'name profilePic')
      .populate('to', 'name profilePic')
      .populate('replyTo', 'message type from')
      .lean();

    return res.json({
      success: true,
      messages: messages.reverse(),
      hasMore: messages.length === parseInt(limit)
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to get conversation'
    });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const currentUserId = req.userId;

    const unreadCount = await MessageModel.countDocuments({
      to: currentUserId,
      status: { $ne: 'read' }
    });

    const unreadPerUser = await MessageModel.aggregate([
      {
        $match: {
          to: currentUserId,
          status: { $ne: 'read' }
        }
      },
      {
        $group: {
          _id: '$from',
          count: { $sum: 1 }
        }
      }
    ]);

    return res.json({
      success: true,
      total: unreadCount,
      perUser: unreadPerUser
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to get unread count'
    });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.userId;

    const readAt = new Date();

    const result = await MessageModel.updateMany(
      {
        from: userId,
        to: currentUserId,
        status: { $in: ['sent', 'delivered'] }
      },
      {
        $set: {
          status: 'read',
          readAt
        }
      }
    );

    return res.json({
      success: true,
      message: `Marked ${result.modifiedCount} messages as read`,
      count: result.modifiedCount
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to mark messages as read'
    });
  }
};