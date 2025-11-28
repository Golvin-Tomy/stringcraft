

import asyncHandler from "express-async-handler";
import Review from "../models/ReviewModel.js";


export const getAllReviewsAdmin = asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate("user", "name email")
    .populate("product", "name");
  res.json({ success: true, data: reviews });
});


export const approveReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }
  review.isApproved = true;
  const updated = await review.save();
  res.json({ success: true, data: updated });
});


export const deleteReviewAdmin = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }
  await review.remove();
  res.json({ success: true, data: "Review deleted" });
});
