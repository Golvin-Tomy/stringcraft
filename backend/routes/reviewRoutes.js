

import express from "express";
import {
  getAllReviewsAdmin,
  approveReview,
  deleteReviewAdmin,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();


router.get("/admin", protect, admin, getAllReviewsAdmin);
router.put("/admin/:id/approve", protect, admin, approveReview);
router.delete("/admin/:id", protect, admin, deleteReviewAdmin);

export default router;
