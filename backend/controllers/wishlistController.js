import asyncHandler from "express-async-handler";
import Wishlist from "../models/wishlistModel.js";

// Get user's wishlist
export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id })
    .populate("products");
  res.json({ success: true, data: wishlist?.products || [] });
});

// Add product to wishlist
export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;

  let wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [productId] });
  } else {
    if (wishlist.products.includes(productId)) {
      res.status(400);
      throw new Error("Product already in wishlist");
    }
    wishlist.products.push(productId);
    await wishlist.save();
  }

  res.json({ success: true, data: wishlist.products });
});

// Remove product from wishlist
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });

  if (!wishlist) {
    res.status(404);
    throw new Error("Wishlist not found");
  }

  wishlist.products = wishlist.products.filter(
    (id) => id.toString() !== req.params.productId
  );
  await wishlist.save();

  res.json({ success: true, data: wishlist.products });
});