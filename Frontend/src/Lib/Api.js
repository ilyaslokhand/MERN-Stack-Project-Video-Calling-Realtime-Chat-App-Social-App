import { axiosInstance } from "./Axios";

export const Singup = async (signupData) => {
  const response = await axiosInstance.post("/auth/register", signupData);
  return response.data;
};

export const currentUser = async () => {
  try {
    const response = await axiosInstance.get("/auth/currentUser");
    return response.data;
  } catch (error) {
    return null;
  }
};

export const onBoarding = async (boardingData) => {
  const response = await axiosInstance.post("/auth/onBoarding", boardingData);
  return response.data;
};

export const loginUser = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};

export const logoutUser = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const RecommandedFriends = async () => {
  const response = await axiosInstance.get("/user/recommendedFriends");
  return response?.data?.data;
};

export const FriendList = async () => {
  const response = await axiosInstance.get("/user/friendList");
  return response.data.data.friends;
};

export const sendfriendRequesttouser = async (userId) => {
  const response = await axiosInstance.post(`/user/friend-request/${userId}`);
  return response.data;
};

export const getOutgoingFriendReqs = async () => {
  const response = await axiosInstance.get("/user/ongoing-friend-Request");
   return response.data.data;
};


export const getFriendRequestData = async ()=>{
  const response = await axiosInstance.get("/user/friend-requests")
  return response.data.data
}

export const acceptFriendRequest = async (requestId)=>{
  const response = await axiosInstance.put(`user/friend-request/${requestId}/accept`)
  return response.data
}


export const getStreamToken = async()=>{
  const response = await axiosInstance.get('/chat/token')
  return response.data;
}