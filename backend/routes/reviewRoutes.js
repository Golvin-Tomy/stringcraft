

import express from "express";
import {
  getAllReviewsAdmin,
  approveReview,
  deleteReviewAdmin,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();


router.get("/admin", protect, adminOnly, getAllReviewsAdmin);
router.put("/admin/:id/approve", protect, adminOnly, approveReview);
router.delete("/admin/:id", protect, adminOnly, deleteReviewAdmin);

export default router;
