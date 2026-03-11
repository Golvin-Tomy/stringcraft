// routes/adminRoutes.js
import express from "express";
import asyncHandler from "express-async-handler";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllProducts,
  getAllOrders,
  updateOrderStatus,
  getReviews,
  deleteReview,
} from "../controllers/adminController.js";
import Product from "../models/productModel.js";

const router = express.Router();

router.use(protect, admin);

router.get("/dashboard", asyncHandler(getDashboardStats));
router.get("/users", asyncHandler(getAllUsers));
router.delete("/users/:id", asyncHandler(deleteUser));
router.get(
  "/products",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
  }),
);
router.get(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    res.json(product);
  }),
);

router.put(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;
    product.description = req.body.description || product.description;

    // update stock instead of quantity
    product.stock = req.body.quantity || product.stock;

    // save uploaded image
    if (req.body.imageUrl) {
      product.images = [
        {
          url: req.body.imageUrl,
        },
      ];
    }

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  })
);
router.delete(
  "/products/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    await product.deleteOne();

    res.json({ message: "Product deleted successfully" });
  }),
);

router.get("/orders", asyncHandler(getAllOrders));
router.put("/orders/:id", asyncHandler(updateOrderStatus));
router.get("/reviews", asyncHandler(getReviews));
router.delete("/reviews/:id", asyncHandler(deleteReview));

export default router;
