import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

// resgiter user----------------------------------------------------
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({ success: false, message: "Missing Details" })
    }

    try {

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.json({ success: false, message: "User already exists" })
        }

        const hasPassword = await bcrypt.hash(password, 10)

        const user = new userModel({
            name, email, password: hasPassword
        });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        //send welcome email
        const mailOptions = {
            from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
            to: email,
            subject: "Welcome to Auth-System!",
            text: `Welcome to auth-system. Your account has been created successfullly with this email ${email}`
        }

        transporter.sendMail(mailOptions);

        return res.json({ success: true })


    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// login ----------------------------------------------------
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ success: false, message: "Email & Password required" })
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Invalid email" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid password" })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({ success: true })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

// logout ----------------------------------------------------
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })

        return res.json({ success: true, message: "Logged out" })
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

//send OTP
export const sendVerifyOpt = async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await userModel.findById(userId)

        if (user.isAccountVerified) {
            return res.json({ success: false, message: 'User Acoount already verified' })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp
        user.verifyExpireAt = Date.now() * 24 * 60 * 60 * 1000;
        await user.save();

        const mailOptions = {
            from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
            to: user.email,
            subject: "Accou Verification",
            text: `Your OTP is ${otp}. Verify your account using this OTP`
        }

        transporter.sendMail(mailOptions);

        return res.json({ success: true, message: "Verification OTP send on email" })


    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

//verify email
export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res.json({ success: false, message: 'Missing details' })
    }

    try {
        const user = await userModel.findById(userId)

        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' })
        }

        if (user.verifyExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP expired' })
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyExpireAt = 0;
        await user.save()

        return res.json({ success: true, message: 'Emai verified success' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

//check user loged in or not
export const isAuthenticated = async (req, res) => {
    try {
        return res.json({ success: true })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

//send reset OTP
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: 'Email required' })
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp
        user.resetOtpExpireAt = Date.now() * 15 * 60 * 1000;
        await user.save();

        const mailOptions = {
            from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
            to: user.email,
            subject: "Password reset OTP",
            text: `Your reset OTP is ${otp}. reset your account using this OTP`
        }

        transporter.sendMail(mailOptions);

        return res.json({ success: true, message: "Reset OTP send on email" })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

//reset password / OTP verification
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: 'Email, OTP, New Password are required' })
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        if (user.resetOtp === '' || !user.resetOtp === otp) {
            return res.json({ success: false, message: 'Invalid OTP' })
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP expired' })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save()

        return res.json({ success: true, message: "Password reset success" })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
