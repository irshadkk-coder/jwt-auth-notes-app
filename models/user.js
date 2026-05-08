import mongoose from "mongoose";

const userSchema =new mongoose.Schema({
   name :{type:String,required:true},
   email:{type:String,required:true,unique:true},
   password:{type:String,required:true,minlength: 6,select: false},
   resetPasswordToken:{type:String},
   resetPasswordExpires:{type:Date},
   isVerified: {type: Boolean,default: false,},
   emailOTP: {type: String,select: false},
   emailOTPExpire: {type: Date,select: false},
   loginAttempts: {type:Number,default: 0},
   lockUntil: {type: Date}},
   {timestamps:true})

export default mongoose.model("User",userSchema)