import express, { response } from 'express'
import User from '../models/user.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import crypto from "crypto";
import loginLimiter from '../middleware.js/authloginRatelimit.js'
import  RefreshToken from '../models/refreshToken.js'
import { generateAccessToken , generateRefreshToken} from '../utils/generateToken.js'
import sendEmail from '../utils/sendEmail.js'
import { verifyEmail } from '../Controllers/authControllers.js'
import { getMe } from "../Controllers/userControllers.js"
import  protect  from "../middleware.js/authMiddleware.js"




dotenv.config()

const router=express.Router()
const cookieOptions = (maxAge) => ({
  httpOnly: true,
  maxAge,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  secure: process.env.NODE_ENV === "production",
});

// register route


router.get("/me", protect, getMe);


router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 🔒 Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const userExist = await User.findOne({ email });

    // 🔍 If user already exists
    if (userExist) {

      // ✅ Already verified → block
      if (userExist.isVerified) {
        return res.status(400).json({
          success: false,
          message: "User already registered. Please login.",
        });
      }

      // 🔁 Not verified → resend OTP
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const hashedOTP = crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");

      userExist.name = name;
      userExist.password = hashedPassword;
      userExist.emailOTP = hashedOTP;
      userExist.emailOTPExpire = Date.now() + 10 * 60 * 1000;

      await userExist.save();

      await sendEmail({
        to: userExist.email,
        subject: "Verify your email",
        text: `Your OTP is: ${otp}`,
      });

      return res.status(200).json({
        success: true,
        message: "OTP resent. Please verify your email.",
      });
    }

    // 🆕 New user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOTP = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      emailOTP: hashedOTP,
      emailOTPExpire: Date.now() + 10 * 60 * 1000,
    });

    await sendEmail({
      to: newUser.email,
      subject: "Verify your email",
      text: `Your OTP is: ${otp}`,
    });

    return res.status(201).json({
      success: true,
      message: "OTP sent to your email. Please verify.",
    });

  } catch (error) {
    next(error);
  }
});

router.post("/verify-email", verifyEmail);




// user login

router.post('/login',loginLimiter,async(req,res,next)=>{
    try{
   const {email,password}=req.body

// check user

const user= await User.findOne({email}).select("+password");


    if (!user) {
      return res.status(403).json({ message: "Please register your email" });
    }


if(!user.isVerified){
    const error= new Error ("please verify your email")
    error.statusCode=404;
    throw error;
}

if (user.lockUntil && user.lockUntil > Date.now()) {
  return res.status(403).json({ message: "Account locked. Try later." });
}


if (user.lockUntil && user.lockUntil <= Date.now()) {
  user.lockUntil = undefined;
  user.loginAttempts=0;
  await user.save();
}

const isMatch=await bcrypt.compare(password,user.password)

if(!isMatch){
  user.loginAttempts += 1;

  if (user.loginAttempts >= 5) {
    user.lockUntil = Date.now() + 15 * 60 * 1000; // 15 mins lock
}
await user.save();

    const error= new Error ("invalid password")
    error.statusCode=400;
    throw error;
}

const accessToken=generateAccessToken(user._id)

const refreshToken=generateRefreshToken(user._id)

res.cookie("accessToken",accessToken,{
   
  ...cookieOptions(15 * 60 * 1000)
})
res.cookie("refreshToken",refreshToken,{
    ...cookieOptions(7 * 24 * 60 * 60 * 1000)
})
await RefreshToken.create({
  token: refreshToken,
  userId: user._id
});

user.loginAttempts = 0;
user.lockUntil = undefined;
await user.save();


res.json({
    success:true,
    message:"login succesfull",
    user: {
    email: user.email,
    id: user._id
  }
})



    }catch(error){
  next (error)
    }

})

router.post("/api/refresh", async (req, res) => {

  try {

    const oldToken = req.cookies.refreshToken;

    // 1. Check cookie exists
    if (!oldToken) {
      return res.status(401).json({
        message: "No refresh token"
      });
    }

      // 3. Verify refresh token
    const decoded = jwt.verify(
      oldToken,
      process.env.REFRESH_SECRET
    );

    // 2. Check token exists in DB
    const tokenDoc = await RefreshToken.findOne({
      token: oldToken,
      userId: decoded.id,
    });

    if (!tokenDoc) {
      return res.status(403).json({
        message: "Invalid refresh token"
      });
    }

  


  // DELETE old refresh token
  await RefreshToken.deleteOne({
    token: oldToken,
    userId: decoded.id
  });

    // CREATE new refresh token
  const newRefreshToken = jwt.sign(
    { id: decoded.id },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  await RefreshToken.create({
    token:newRefreshToken,
    userId:decoded.id
  })


    // 4. Create new access token
    const newAccessToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // 5. Set new access token cookie
    res.cookie("accessToken", newAccessToken, {
      ...cookieOptions(15 * 60 * 1000)
    });
      res.cookie("refreshToken", newRefreshToken, {
    ...cookieOptions(7 * 24 * 60 * 60 * 1000)
  });

    res.json({
      success: true,
      message: "Token Refreshed"
    });

  } catch (error) {
     res.clearCookie("accessToken");
    res.clearCookie("refreshToken");


    return res.status(403).json({
      message: "Invalid or expired refresh token"
    });

  }

});





router.post("/logout", async (req, res, next) => {
  try {

    const refreshTokenValue = req.cookies.refreshToken;

    if (refreshTokenValue) {
      await RefreshToken.deleteOne({
        token: refreshTokenValue
      });
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (error) {
    next(error);
  }
});

router.post("/forget-password",async(req,res)=>{
  try{
    const {email}=req.body

    const user=await User.findOne({email})
    if(!user){
       return res.status(404).json({ message: "User not found" });
         }

          // generate reset token
       const resetToken=crypto.randomBytes(32).toString("hex")
      
       const hashedToken=crypto
       .createHash("sha256")
       .update(resetToken)
       .digest("hex")

       
       user.resetPasswordToken=hashedToken;
       user.resetPasswordExpires=Date.now() +10 * 60 * 1000;

       await user.save()

       const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
       await sendEmail({
        to:user.email,
        subject:"password Reset",
        text:`Click here to reset password:${resetLink}`

       })
   res.json({
      message: "Reset token generated",
    
    });

  }catch(error){
 res.status(500).json({ message: error.message });
  }
})




router.post('/reset-password/:token',async(req,res)=>{
  try{
    const {token}=req.params;
    const {password}=req.body;
 const hashedToken=crypto.
 createHash("sha256")
 .update(token)
 .digest('hex')

 const user=await User.findOne({
   resetPasswordToken: hashedToken,
   resetPasswordExpires:{$gt:Date.now()}

 })
    if (!user) {
      return res.status(400).json({
        message: "Token is invalid or expired"
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword= await bcrypt.hash(password,salt)
    user.password=hashedPassword

       user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save()
    res.status(200).json({message:"succesfully changed password"})
  }catch(error){
    
  
  res.status(500).json({
    message: "Internal Server Error"
  });  
  }
})

export default router;
