import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  generateToken,
} from "../controllers/authController.js";

import passport from "../middleware/googleAuth.js";

const router = express.Router();

router.post("/signup", registerUser);

router.post("/login", loginUser);

router.post("/logout", protect, logoutUser);

router.post("/forgot-password", forgotPassword);

router.put("/reset-password/:token", resetPassword);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful auth → generate same JWT as normal login
    generateToken(res, req.user._id);  // ← your existing function
    res.redirect("http://localhost:5173/"); // ← your frontend URL (Vite default)
  }
);

export default router;
