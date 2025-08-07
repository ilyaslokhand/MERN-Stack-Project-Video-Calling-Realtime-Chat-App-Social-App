import { axiosInstance } from "./Axios";

export const Singup =  async (signupData)=>{
const response = await axiosInstance.post('/auth/register',signupData);
return response.data
}

export const currentUser = async () => {
    const response = await axiosInstance.get("/auth/currentUser");
    return response.data; 
  }

export const onBoarding = async (boardingData)=>{
  const response = await axiosInstance.post('/auth/onBoarding',boardingData);
  return response.data;
  
}

export const loginUser = async (loginData)=>{
  const response = await axiosInstance.post('/auth/login',loginData);
  return response.data;
}