import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const router = express.Router();

// GET all users (admin)
router.get("/", protect, admin, asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json({ success: true, data: users });
}));

// DELETE user (admin)
router.delete("/:id", protect, admin, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  await user.deleteOne();
  res.json({ success: true, message: "User deleted" });
}));

// UPDATE user role (admin)
router.put("/:id/role", protect, admin, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  user.role = req.body.role;
  await user.save();
  res.json({ success: true, data: user });
}));

export default router;