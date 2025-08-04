import mongoose from "mongoose";

const friendreqSchema = new mongoose.Schema({
  sender:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  receiver:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status:{
    type: String,
    enum: ["pending", "accepted", ],
    default: "pending"
  }

}, {timestamps:true})

export const friendReq = mongoose.model("friendReq", friendreqSchema);