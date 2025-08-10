import {User} from "../Models/User.model.js";
import asyncHandler from "../Utils/asyncHandler.js";
import apiError from "../Utils/apiError.js";
import apiResponse from "../Utils/apiResponse.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import { upsertStreamUser } from "../DB/stream.js";


const generateAccessTokenAndRefreshToken = async (userId)=>{
  try {
    const existedUser = await User.findById(userId);
    const accessToken = existedUser.generateAccessToken();
    const refreshToken = existedUser.generateRefreshToken();
    existedUser.refreshToken = refreshToken;
    await existedUser.save({validateBeforeSave: false});
    return {accessToken,refreshToken};
  } catch (error) {
    throw new apiError(500, "Something went wrong while generating tokens");
  }
}


const registerUser = asyncHandler(async(req,res)=>{
  const {fullName, email,password} = req.body;
  if(!fullName || !email || !password){
    throw new apiError(400, "All fields are required");
  };
  if (password.length <6) {
    throw new apiError(400, " Password must be at leat 6 characters long")
  };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if(!emailRegex.test(email)){
    throw new apiError(400, "Invalid email format");
  };
  const existingUser = await User.findOne({email});
  console.log("existingUser here",existingUser);
  if(existingUser){
    throw new apiError(400, "user already exists with this email");
  }
  const randomSeed = Math.random().toString(36).substring(7); // random string
  const avatar = `https://api.dicebear.com/7.x/pixel-art/svg?seed=${randomSeed}`;

  const options = {
    httpOnly: true,
    secure: true,
  }
  const user = await User.create({
    fullName,
    email,
    password,
    profilepic:avatar
  });

  await upsertStreamUser({
   id: user._id.toString(),
    name: user.fullName,
    image: user.profilepic||"",

  })
  
  const {accessToken,refreshToken} = await generateAccessTokenAndRefreshToken(user._id);

  const createdUser = await User.findById(user._id).select(" -password -refreshToken");
  
  
  res.status(200)
  .cookie("accessToken", accessToken, options)
  .cookie("refreshToken", refreshToken, options)
  .json(new apiResponse(createdUser, 200, "User registered successfully"));
})

const loginUser = asyncHandler(async(req,res)=>{
  const {email,password} = req.body;
  if(!email || !password){
    throw new apiError(400, "all fields are required");
  };
  const existedUser = await User.findOne({email});
  if(!existedUser){
    throw new apiError(400, " username or password is incorrect");
  };
  const isPasswordMatched = await existedUser.comparePassword(password);

  if(!isPasswordMatched){
    throw new apiError(400, "username or password is incorrect")
  };
  const {accessToken,refreshToken} = await generateAccessTokenAndRefreshToken(existedUser._id);
  const options = {
    httpOnly:true,
    secure:true,
  };

  const loggedInUser = await User.findById(existedUser._id).select("-password -refreshToken");

  res.status(200)
  .cookie("accessToken",accessToken, options)
  .cookie("refreshToken",refreshToken, options)
  .json(new apiResponse(loggedInUser, 200, "User loggedIn successfully"));
})

const logoutUser = asyncHandler(async(req,res)=>{
  await User.findByIdAndUpdate(
    req.user._id,
    {
       $set: {
        refreshToken: undefined,
      },
    },
    {
      new:true,
    }
  )

   const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse("", 200, "User logged out successfully"));
});

const onBoarding = asyncHandler(async(req,res)=>{
  const {nativelangauge,Learninglangauge, location,bio} = req.body;
  if(!nativelangauge || !Learninglangauge || !location || !bio){
    throw new apiError(400, "all fields are required");
  }
   const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        nativelangauge,
        Learninglangauge,
        location,
        bio,
        onBoarding:true,
      },
    },
    {
      new:true,

    },

   ).select("-password -refreshToken");

   if(!updatedUser){
    throw new apiError(400, "something wen t wrong while updating user")
   };

   return res.status(200).json(new apiResponse(updatedUser,200, "User onboarded successfully"))
})

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new apiResponse(req.user, 200, "Current user fetched successfully"));
});

export {registerUser,loginUser,logoutUser,onBoarding,getCurrentUser};