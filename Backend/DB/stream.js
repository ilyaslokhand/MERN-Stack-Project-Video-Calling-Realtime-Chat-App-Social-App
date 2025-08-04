import { StreamChat } from "stream-chat";
import { configDotenv } from "dotenv";
import apiError from "../Utils/apiError.js";

configDotenv();

const apiKey = process.env.STREAM_API_KEY;
const secretKey = process.env.STREAM_SECRET_KEY;

if (!apiKey || !secretKey){
  throw new apiError(500, "stream api key or seceret key is not defined");
}

const client = StreamChat.getInstance(apiKey,secretKey)

export const upsertStreamUser = async(userData)=>{
  try {
    await client.upsertUsers([userData]);
    return userData;
  } catch (error) {
    throw new apiError(500, "failed to upsert stream user", error)
  }

}

export const generatestreamToken = (userId)=>{
  try {
    const userIdstring = userId.toString();
    return client.createToken(userIdstring)
  } catch (error) {
    console.log("error generating stream token", error)
  }
}