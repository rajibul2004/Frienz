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