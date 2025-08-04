import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



const UserSchema = new mongoose.Schema({
  fullName:{
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: true,
  },
  password:{
    type: String,
    required: true,
    minlength:6,
  },
  bio:{
    type: String,
    default: ""
  },
  refreshToken: {
    type: String,
  },
   profilepic:{
    type: String,
    default: ""
  },
   nativelangauge:{
    type: String,
    default: ""
  },
   Learninglangauge:{
    type: String,
    default: ""
  },
  location:{
    type: String,
    default: ""
  },
  onBoarding:{
    type:Boolean,
    default:false,
  },
  friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

}, {timestamps:true});

UserSchema.pre("save", async function(next){
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password,10)
  next();
})

UserSchema.methods.comparePassword = async function (existedPassword) {
  const isMatch = await bcrypt.compare(existedPassword, this.password);
  return isMatch;
}

UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};



export const User = mongoose.model("User", UserSchema);