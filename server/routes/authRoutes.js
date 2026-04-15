import express from 'express';
import { register, login, logout, sendResetOtp, resetPassword, onboard, verifyResetOtp, getUser } from '../controller/authController.js';
import extractUserId from '../middleware/extractUserId.js'
import attachUser from '../middleware/attachUser.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.post('/send-reset-otp', sendResetOtp);
router.post('/verify-reset-otp', verifyResetOtp);
router.post('/reset-password', resetPassword);

router.post('/update', extractUserId, attachUser, onboard);

router.get('/me', extractUserId, attachUser, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
});

router.get('/user/:userId', getUser);


export default router;