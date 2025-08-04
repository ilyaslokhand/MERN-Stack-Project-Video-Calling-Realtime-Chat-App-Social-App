import { Router } from "express";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import { getstreamToken } from "../Controllers/Chat.controller.js";


const router = Router();

router.get("/token", verifyJWT,getstreamToken)

export default router;