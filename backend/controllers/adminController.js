// controllers/adminController.js
import asyncHandler from "express-async-handler";
import User from "../models/UserModel.js";
import Product from "../models/productModel.js";
import Order from "../models/OrderModel.js";
import Cart from "../models/CartModel.js";
import Review from "../models/ReviewModel.js";

const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalOrders, 
    totalUsers, 
    totalProducts, 
    lowStockProducts, 
    totalRevenue,
    recentOrders
  ] = await Promise.all([
    Order.countDocuments(),
    User.countDocuments({ role: { $ne: 'admin' } }),
    Product.countDocuments(),
    Product.countDocuments({ stock: { $lt: 5 } }),
    Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalPrice' } } }]),
    Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email')
  ]);

  res.json({
    success: true,
    data: {
      stats: {
        totalOrders,
        totalUsers,
        totalProducts,
        lowStockProducts,
        revenue: totalRevenue[0]?.total || 0
      },
      recentOrders
    }
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: { $ne: 'admin' } })
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(100);

  res.json({
    success: true,
    count: users.length,
    data: users
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  
  if (user.role === 'admin') {
    res.status(400);
    throw new Error('Cannot delete admin user');
  }

  await User.findByIdAndDelete(req.params.id);
  
  // Also clear their carts/reviews
  await Cart.deleteMany({ user: req.params.id });
  await Review.deleteMany({ user: req.params.id });

  res.json({ 
    success: true, 
    message: 'User deleted successfully' 
  });
});

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
    .populate('category', 'name')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: products.length,
    data: products
  });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate('user', 'name email')
    .populate('products.product', 'name price image')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: orders.length,
    data: orders
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = req.body.status; // 'pending', 'shipped', 'delivered'
  order.updatedAt = Date.now();
  
  const updatedOrder = await order.save();

  res.json({ 
    success: true, 
    data: updatedOrder 
  });
});

const getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({})
    .populate('user', 'name')
    .populate('product', 'name')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: reviews.length,
    data: reviews
  });
});

const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  await Review.findByIdAndDelete(req.params.id);
  
  res.json({ 
    success: true, 
    message: 'Review deleted successfully' 
  });
});

export {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllProducts,
  getAllOrders,
  updateOrderStatus,
  getReviews,
  deleteReview
};
