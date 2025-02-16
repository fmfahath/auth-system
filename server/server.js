import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import connectDB from './config/mongodb.js';
import authRouter from './route/authRoute.js';
import userRouter from './route/userRoute.js'

const app = express();
const port = process.env.PORT || 4000;
const allowedOrgins = ['http://localhost:5173']

connectDB();

app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: allowedOrgins, credentials: true }))


//API endpoints
app.get('/', (req, res) => res.send("API Working on port:4000"))
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)



app.listen(port, () => console.log(`Server started on post:${port}`))