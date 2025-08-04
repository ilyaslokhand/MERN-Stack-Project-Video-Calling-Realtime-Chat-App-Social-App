import { friendReq } from "../Models/FriendReq.model.js";
import { User } from "../Models/User.model.js";
import apiError from "../Utils/apiError.js";
import apiResponse from "../Utils/apiResponse.js";
import asyncHandler from "../Utils/asyncHandler.js";

const getRecommandedFriends = asyncHandler(async(req,res)=>{
  const currentuserId= req.user._id;
  const getcurrentUser = req.user;

  const updatedRecommendedFriends = await User.find({
    $and: [
      {
        _id: { $ne: currentuserId} // exclude current user
      },
      {
        _id: { $nin: getcurrentUser.friends } // exclude friends
      },
      {
        onBoarding: true // only include if users have completed onboarding
      }
    ]
  }).select(" -password -refreshToken")

  if (!updatedRecommendedFriends.length===0) {
    throw new apiError(404, "no recommended friends ")
  };

  res.status(200).json(new apiResponse(updatedRecommendedFriends,200, "recommended friends fetched succesfully"))

});


const getFriendList = asyncHandler(async (req, res) => {
  const currentuserId = req.user._id;

  const friendList = await User.findById(currentuserId)
    .select("friends")
    .populate("friends", "fullName profilepic nativelangauge Learninglangauge");
    // console.log("Friend List User:", friendList);

  if (!friendList || !friendList.friends || friendList.friends.length === 0) {
    throw new apiError(404, "No friends found");
  }
  

  res.status(200).json(new apiResponse(friendList, 200, "Friend list fetched successfully"));
});


const sendfriendRequest = asyncHandler(async(req,res)=>{
  
  const myId = req.user._id;
  const {id: receivedId} = req.params;

  if(myId === receivedId){
    throw new apiError(400, "you cannot send friend request to yourself")
  };

  const receipentUser = await User.findById(receivedId);
  if (!receipentUser){
    throw new apiError(404, "receipent user not found")
  };

  if(receipentUser.friends.includes(myId)){
    throw new apiError(400, "you are already friends with this user")
  };

  const existingRequest = await friendReq.findOne({
    $or: [
      { sender: myId, receiver: receivedId},
      { sender: receivedId, receiver: myId}
    ]
  });

  if (existingRequest){
    throw new apiError(400, "friend request already exists")
  };

  const newFriendRequest = await friendReq.create({
    sender: myId,
    receiver:receivedId,
  });

  res.status(200).json(new apiResponse(newFriendRequest,200, "friend request sent successfully"))

})

const acceptFriendRequest = asyncHandler(async(req,res)=>{

   // get the current user id and the request if from params
   // check if the request is from the current uer
   // check if the request exits
   // if it dooes update the friend list of both users
   // delete the request from the friendreq collection
   // send the response with the updated friend list
   
   const currentuserId = req.user._id;
   const {id: requestId} = req.params;

   const friendRequest = await friendReq.findById(requestId);
   if(!friendRequest){
    throw new apiError(404, "friend request not found")
   };

   if(friendRequest.receiver.toString() !== currentuserId.toString()){
    throw new apiError(403, " you are not autorized to accept this request")
   };
   if(friendRequest.status === "accepted"){
    throw new apiError(400, "friend request already accepted")
   };

  friendRequest.status = "accepted";
  await friendRequest.save();

  // add the users to each other;s friend list array
  // $addtoset is used to  add the user to the friend list only if they are not already preset
   await User.findByIdAndUpdate(friendRequest.sender,{
    $addToSet: {friends:friendRequest.receiver}
   })
   await User.findByIdAndUpdate(friendRequest.receiver,{
    $addToSet: {friends: friendRequest.sender}
   })
   
    res.status(200).json(new apiResponse(friendRequest,200, " friend request accepted successfully"))
})

const getFriendRequest = asyncHandler(async (req, res) => {
  const currentuserId = req.user._id;

  // Get incoming friend requests
  const incommingRequests = await friendReq.find({
    receiver: currentuserId,
    status: "pending",
  }).populate("sender", "fullName profilepic nativelangauge Learninglangauge");

  // Get accepted friend requests
  const acceptedRequests = await friendReq.find({
    receiver: currentuserId,
    status: "accepted",
  }).populate("sender", "fullName profilepic nativelangauge Learninglangauge");

  // Optional error if nothing found
  if (!incommingRequests.length && !acceptedRequests.length) {
    throw new apiError(404, "No friend requests found");
  }

  res.status(200).json(new apiResponse(
    {
      incommingRequests,
      acceptedRequests,
    },
    200,
    "Friend requests fetched successfully"
  ));
});

const getongoingfriendRequest = asyncHandler(async(req,res)=>{

  const senderId = req.user._id;
  const ongoingfriendRequests = await friendReq.find({
   sender: senderId,
   status:"pending",
  }).populate("receiver", "fullName profilepic nativelangauge Learninglangauge");

   if (!ongoingfriendRequests.length && !ongoingfriendRequests.length) {
    throw new apiError(404, "No friend requests found");
  };

  res.status(200).json( new apiResponse( ongoingfriendRequests, 200, "ongoing friend requests fetched successfully"))

})




export {getRecommandedFriends,getFriendList,sendfriendRequest,acceptFriendRequest,getFriendRequest,getongoingfriendRequest};