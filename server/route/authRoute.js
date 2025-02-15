import express from 'express'
import { login, logout, register, sendVerifyOpt, verifyEmail } from '../controllers/authController.js'
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router()


authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAuth, sendVerifyOpt);
authRouter.post('/verify-account', userAuth, verifyEmail);

export default authRouter;