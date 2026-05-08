import crypto from "crypto";
import User from '../models/user.js';

export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
          success: false,
        message: "Email and OTP are required",
      });
    }

    const hashedOTP = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    const user = await User.findOne({ email })
      .select("+emailOTP +emailOTPExpire");

    if (!user) {
      return res.status(404).json({
           success: false,
        message: "User not found",
      });
    }

    
    if (user.isVerified) {
      return res.status(400).json({
          success: false,
        message: "Email already verified",
      });
    }

    
    if (
      user.emailOTP !== hashedOTP ||
      user.emailOTPExpire < Date.now()
    ) {
      return res.status(400).json({
           success: false,
        message: "Invalid or expired OTP",
      });
    }

    
    user.isVerified = true;
    user.emailOTP = undefined;
    user.emailOTPExpire = undefined;

    await user.save();

    res.json({
        success: true,
      message: "Email verified successfully",
    });

  } catch (error) {
    res.status(500).json({
        success: false,
      message: error.message || "Server Error",
    });
  }
};