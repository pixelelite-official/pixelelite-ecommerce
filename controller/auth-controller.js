const User = require("../model/user");
const Otp = require("../model/otp");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { sendOtpEmail } = require("../services/mailServices");

exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Generate a 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to database with expiration of 2 minutes
    const otpEntry = new Otp({ email, otp: otpCode });
    await otpEntry.save();

    // Send OTP via email
    await sendOtpEmail(email, otpCode);

    res.status(200).json({ message: "OTP sent to your email address." });
  } catch (error) {
    res.status(500).json({ error: "Error sending OTP. Please try again." });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find the OTP entry
    const otpEntry = await Otp.findOne({ email, otp });

    if (!otpEntry) {
      return res.status(400).json({ error: "Invalid or expired OTP." });
    }

    // OTP is valid
    // Delete the OTP entry after verification
    await Otp.deleteOne({ _id: otpEntry._id });

    res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error verifying OTP. Please try again." });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Find the user
    const user = await User.findOne({ name:email });

    if (!user) {
      return res.status(400).json({ error: "User not found." });
    }

    // Hash the new password
    const saltRounds = parseInt(process.env.SALT, 10) || 10; // Use 10 if SALT is undefined or invalid
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    // Update the password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error resetting password. Please try again." });
  }
};
