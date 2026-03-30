import jwt from 'jsonwebtoken';

const extractUserId = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required. Please login."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || decoded.type !== "auth" || !decoded.id) {
            return res.status(401).json({
                success: false,
                message: "Invalid token. Please login again."
            });
        }
        req.userId = decoded.id;
        req.tokenType = "auth";

        next();

    } catch (err) {
        res.json({
            success: false,
            message: err.message
        });
    }
};

export default extractUserId;