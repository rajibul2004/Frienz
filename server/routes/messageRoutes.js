import express from 'express';
import { getConversation } from '../controller/messageController.js';
import extractUserId from '../middleware/extractUserId.js';
import attatchUser from '../middleware/attachUser.js';

const router = express.Router();    

router.use(extractUserId);

router.get('/conversation/:userId', getConversation);

export default router;