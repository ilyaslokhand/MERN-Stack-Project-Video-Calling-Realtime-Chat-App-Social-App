import { Router } from "express";
import { getCurrentUser, loginUser, logoutUser, onBoarding, registerUser } from "../Controllers/Auth.controller.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
const router = Router();

router.post("/register",registerUser);
router.post("/login", loginUser)
router.post('/logout',verifyJWT, logoutUser)
router.post('/onBoarding', verifyJWT,onBoarding);
router.get('/currentUser', verifyJWT,getCurrentUser);



export default router;