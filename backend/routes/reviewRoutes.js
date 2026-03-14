import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  getAllReviewsAdmin,
  approveReview,
  deleteReviewAdmin,
} from "../controllers/reviewController.js";

const router = express.Router();

// User routes
router.get("/product/:productId", getProductReviews);
router.post("/", protect, createReview);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

// Admin routes
router.get("/admin/all", protect, admin, getAllReviewsAdmin);
router.put("/admin/:id/approve", protect, admin, approveReview);
router.delete("/admin/:id", protect, admin, deleteReviewAdmin);

export default router;