import asyncHandler from "express-async-handler";
import Review from "../models/reviewModel.js";
import Product from "../models/productModel.js";

export const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({
    product: req.params.productId,
    isApproved: true,
  })
    .populate("user", "name")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: reviews });
});

// Create a review
export const createReview = asyncHandler(async (req, res) => {
  const { product, rating, comment } = req.body;

  // Check if user already reviewed this product
  const existing = await Review.findOne({ product, user: req.user._id });
  if (existing) {
    res.status(400);
    throw new Error("You have already reviewed this product");
  }

  const review = await Review.create({
    user: req.user._id,
    product,
    rating,
    comment,
    isApproved: false, 
  });

  // Update product average rating
  await updateProductRating(product);

  res.status(201).json({ success: true, data: review });
});

// Edit own review
export const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  if (review.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to edit this review");
  }

  review.rating = req.body.rating || review.rating;
  review.comment = req.body.comment || review.comment;
  review.isApproved = false;  

  const updated = await review.save();
  await updateProductRating(review.product);

  res.json({ success: true, data: updated });
});

// Delete own review
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(401);
    throw new Error("Not authorized");
  }

  await review.deleteOne();
  await updateProductRating(review.product);

  res.json({ success: true, message: "Review deleted" });
});

// Admin — get all reviews
export const getAllReviewsAdmin = asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate("user", "name email")
    .populate("product", "name")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: reviews });
});

// Admin — approve review
export const approveReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  review.isApproved = true;
  const updated = await review.save();
  await updateProductRating(review.product);

  res.json({ success: true, data: updated });
});

// Admin — delete review
export const deleteReviewAdmin = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  await review.deleteOne();
  await updateProductRating(review.product);

  res.json({ success: true, message: "Review deleted" });
});

// Helper — recalculate product average rating from approved reviews
const updateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId, isApproved: true });
  const avg = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  await Product.findByIdAndUpdate(productId, {
    ratings: Math.round(avg * 10) / 10,  
  });
};