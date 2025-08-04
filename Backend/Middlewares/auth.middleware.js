import { User } from "../Models/User.model.js";
import apiError from "../Utils/apiError.js";
import asyncHandler from "../Utils/asyncHandler.js";
import jwt from "jsonwebtoken";


export const verifyJWT = asyncHandler(async(req,resizeBy,next)=>{
 try {
   const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");
 
   if(!token){
     throw new apiError(401, "unauthorized access, no token provided")
   };
 
   const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
 
    const user = await User.findById(decodedToken?.id).select("-password -refreshToken");
 
   if (!user) {
     throw new apiError(404, "user not found")
   };
   req.user = user;
   next();
 
 
 } catch (error) {
    throw new apiError(401, error?.message || "invalid access token");

 }

})