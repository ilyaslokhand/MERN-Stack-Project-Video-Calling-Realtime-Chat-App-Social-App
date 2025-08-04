import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials:true,
}))

app.use(express.json({limit:"100kb"}));
app.use(express.urlencoded({extended:true, limit:"100kb"}));
app.use(express.static("public"))
app.use(cookieParser());

import Authroute from "./Routes/Auth.route.js"
import userroute from "./Routes/User.route.js"
import Chatroute from "./Routes/Chat.route.js"

app.use('/api/auth', Authroute);
app.use('/api/user', userroute);
app.use('/api/chat',Chatroute)


export default app;