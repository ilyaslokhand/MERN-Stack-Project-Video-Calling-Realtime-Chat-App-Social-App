import { Router } from "express";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import { getRecommandedFriends,getFriendList, sendfriendRequest, acceptFriendRequest, getFriendRequest, getongoingfriendRequest } from "../Controllers/User.controller.js";

const router = Router();

router.get("/recommendedFriends", verifyJWT,getRecommandedFriends);
router.get("/friendList", verifyJWT,getFriendList);
router.post("/friend-request/:id", verifyJWT, sendfriendRequest);
router.put("/friend-request/:id/accept", verifyJWT, acceptFriendRequest);
router.get("/friend-requests",verifyJWT,getFriendRequest)
router.get("/ongoing-friend-Request",verifyJWT,getongoingfriendRequest)


export default router