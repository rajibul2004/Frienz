import UserModel from "../models/userModel.js";

const attachUser = async (req, res, next) => {
    try {
        const userId = req.userId || req.body.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User ID not found. Authentication required."
            });
        }

        const user = await UserModel.findById(userId)
            .select('-password -resetOtp -resetOtpExpAt')

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User account not found"
            });
        }
        req.user = user;
        
        next();

    } catch (err) {
        console.error("Attach user middleware error:", err);
        return res.status(500).json({
            success: false,
            message: process.env.NODE_ENV === 'development' ? err.message : "Failed to fetch user data"
        });
    }
};

export default attachUser;