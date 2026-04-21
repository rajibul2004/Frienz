import express from 'express';
import { getConversation,markMessagesAsRead,getUnreadCount } from '../controller/messageController.js';
import extractUserId from '../middleware/extractUserId.js';
import attatchUser from '../middleware/attachUser.js';

const router = express.Router();    

router.use(extractUserId);

router.get('/conversation/:userId', getConversation);
router.get('/unread', getUnreadCount);

router.put('/read/:userId', markMessagesAsRead);

export default router;