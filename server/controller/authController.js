import bcrypt from 'bcryptjs';
import UserModel from '../models/userModel.js';
import jsonwebtoken from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email format"
        });
    }
    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 6 characters"
        });
    }


    try {
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        const idx = Math.floor(Math.random() * 100 + 1);
        const radomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ name: name.trim(), email: email.toLowerCase().trim(), password: hashedPassword, profilePic: radomAvatar, isVerified: true });
        await newUser.save();

        const token = jsonwebtoken.sign(
            { id: newUser._id, type: "auth" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(201).json({
            success: true,
            message: "Registration successful",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                profilePic: newUser.profilePic
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email?.trim() || !password) {
        return res.status(400).json({ 
            success: false,
            message: "Email and password are required"
        });
    }
    try {
        const existingUser = await UserModel.findOne({ email: email.toLowerCase().trim() });
        if (!existingUser) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        const token = jsonwebtoken.sign(
            { id: existingUser._id, type: "auth" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                profilePic: existingUser.profilePic,
                isBoarded: existingUser.isBoarded
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/'
        });
        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


const sendResetOtp = async (req, res) => {
    const { email } = req.body;
    if (!email?.trim()) {
        return res.status(400).json({
            success: false,
            message: "Email is required"
        });
    }
    try {
        const user = await UserModel.findOne({ email: email.toLowerCase().trim() });
        if (!user) {
            return res.status(200).json({
                success: true,
                message: "If email exists, OTP will be sent"
            });
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        const hashedOtp = await bcrypt.hash(otp, 10);

        user.resetOtp = hashedOtp;
        user.resetOtpExpAt = Date.now() + 15 * 60 * 1000;
        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset OTP",
            html: `<p>Your OTP for password reset is: <b>${otp}</b>. It is valid for 15 minutes.</p>`
        };
        await transporter.sendMail(mailOption);

        return res.status(200).json({
            success: true,
            message: "If email exists, OTP will be sent"
        });

    } catch (err) {
        res.json({
            success: false,
            message: err.message
        });
    }
};

const verifyResetOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email?.trim() || !otp) {
        return res.status(400).json({
            success: false,
            message: "Email and OTP are required"
        });
    }
    try {
        const user = await UserModel.findOne({ email: email.toLowerCase().trim() });
        if (!user || !user.resetOtp || !user.resetOtpExpAt) {
            return res.status(400).json({
                success: false,
                message: "Invalid request"
            });
        }
        if (user.resetOtp === "" || user.resetOtp !== otp) {
            return res.json({
                success: false,
                message: "Invalid OTP"
            });
        }
        if (user.resetOtpExpAt < Date.now()) {
            user.resetOtp = '';
            user.resetOtpExpAt = 0;
            await user.save();

            return res.status(400).json({
                success: false,
                message: "OTP expired"
            });
        }
        const isValidOtp = await bcrypt.compare(otp, user.resetOtp);
        if (!isValidOtp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }
        const resetToken = jwt.sign(
            { id: user._id, purpose: 'password-reset' },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );
        user.resetOtp = '';
        user.resetOtpExpAt = 0;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "OTP verified",
            resetToken
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email?.trim() || !newPassword || !resetToken) {
        return res.status(400).json({
            success: false,
            message: "Email, new password, and reset token are required"
        });
    }
    if (newPassword.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 6 characters"
        });
    }
    try {
        let decoded;
        try {
            decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
            if (decoded.purpose !== 'password-reset') {
                throw new Error('Invalid token purpose');
            }
        } catch (tokenError) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired reset token"
            });
        }
        const user = await UserModel.findOne({
            email: email.toLowerCase().trim(),
            _id: decoded.id
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid request"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;
        await user.save();

        try {
            const mailOption = {
                from: process.env.SENDER_EMAIL,
                to: user.email,
                subject: "Password Reset Successful",
                html: `<p>Your password has been reset successfully.</p>`
            };
            transporter.sendMail(mailOption).catch(console.error);
        } catch (emailError) {
            console.error("Password reset email error:", emailError);
        }


        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });
    } catch (err) {
        res.json({
            success: false,
            message: err.message
        });
    }
};

const onboard = async (req, res) => {
    try {
        const userId = req.userId || req.body.userId;
        const { name, bio, nativeLang, location, profilePic } = req.body;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }
        const missingFields = [];
        if (!name?.trim()) missingFields.push('name');
        if (!bio?.trim()) missingFields.push('bio');
        if (!nativeLang?.trim()) missingFields.push('nativeLang');
        if (!location?.trim()) missingFields.push('location');
        if (!profilePic?.trim()) missingFields.push('profilePic');
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
                missingFields
            });
        }


        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                name: name.trim(),
                bio: bio.trim(),
                nativeLang: nativeLang.trim(),
                location: location.trim(),
                profilePic,
                isBoarded: true
            },
            {
                new: true, 
                select: '-password -resetOtp -resetOtpExpAt'
            }
        );
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Onboarding completed successfully",
            user: updatedUser
        });
    } catch (err) {
        console.log(err.meassge);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
export {
    register, login, logout, sendResetOtp, verifyResetOtp, resetPassword, onboard
};