

import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";


const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
};


export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists with this email");
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    phone
  });

  if (user) {
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user)
      }
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});


export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user)
      }
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});


export const logoutUser = asyncHandler(async (req, res) => {
  // If using cookies for refresh token, clear it here
  res.json({ success: true, message: "User logged out" });
});


export const refreshToken = asyncHandler(async (req, res) => {
  // Example: get refresh token from cookies
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    res.status(401);
    throw new Error("No refresh token provided");
  }

  // Verify token
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(401);
      throw new Error("Invalid refresh token");
    }

    const token = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.json({ success: true, token });
  });
});


export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found with this email");
  }

  // Generate reset token (random)
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

  // Save token in user model (you can add resetToken & resetTokenExpire fields)
  user.resetPasswordToken = resetTokenHash;
  user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save();

  // Prepare email
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  const message = `You requested a password reset. Click this link: ${resetUrl}`;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `"StringCraft" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "Password Reset Request",
      text: message
    });

    res.json({ success: true, message: "Email sent for password reset" });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(500);
    throw new Error("Email could not be sent");
  }
});


export const resetPassword = asyncHandler(async (req, res) => {
  const resetTokenHash = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: resetTokenHash,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired password reset token");
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.json({ success: true, message: "Password reset successful" });
});
