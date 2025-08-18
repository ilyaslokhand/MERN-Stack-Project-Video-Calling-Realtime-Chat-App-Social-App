import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from "path"

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials:true,
}))

const __dirname = path.resolve()

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

if (process.env.NODE_ENV === "production") {  // Ye check karta hai ki app production mode me chal rahi hai ya nahi.
  app.use(express.static(path.join(__dirname, "../Frontend/dist"))); // Matlab: agar koi browser /style.css ya /bundle.js mangta hai, to Express seedha dist folder se file bhej dega.
   app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend", "dist", "index.html")); // Ye line ensure karti hai ki chahe user koi bhi route khole, hamesha React ka index.html load ho aur routing React ke paas hi rahe.
  });
}

// Simple example:

// GET /api/users → backend API chalti hai (agar aapne banayi hai).

// GET /logo.png → Express dist/logo.png bhej dega.

// GET /dashboard → Express ko aisi koi static file nahi milti → to wo index.html bhej deta hai → React router decide karega kya render karna hai.


export default app;