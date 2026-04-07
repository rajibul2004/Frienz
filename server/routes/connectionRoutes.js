import express from 'express';
import { getRecommendedUsers,sendFriendRequest,getFriendRequest,acceptFriendRequest,getFriends,getOutGoingReq,removeFriend } from '../controller/connectionController.js';

import extractUserId from '../middleware/extractUerId.js';
import attachUser from '../middleware/attachUser.js';

const router = express.Router();

router.use(extractUserId, attachUser);

router.get('/recommendations', getRecommendedUsers);
router.get('/friends', getFriends);

router.post('/send-request/:id', sendFriendRequest);
router.put('/accept-request/:id/', acceptFriendRequest);

router.get('/incoming-friend-requests', getFriendRequest);
router.get('/outgoing-friend-requests', getOutGoingReq);

router.delete('/remove-friend/:id', removeFriend);

export default router;