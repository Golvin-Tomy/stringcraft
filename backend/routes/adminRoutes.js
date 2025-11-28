// routes/adminRoutes.js
import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  getDashboardStats,
  getAllUsers,
  deleteUser,
  getAllProducts,
  getAllOrders,
  updateOrderStatus,
  getReviews,
  deleteReview
} from '../controllers/adminController.js';

const router = express.Router();


router.use(protect, admin);

router.get('/dashboard', asyncHandler(getDashboardStats));
router.get('/users', asyncHandler(getAllUsers));
router.delete('/users/:id', asyncHandler(deleteUser));
router.get('/products', asyncHandler(getAllProducts));
router.get('/orders', asyncHandler(getAllOrders));
router.put('/orders/:id', asyncHandler(updateOrderStatus));
router.get('/reviews', asyncHandler(getReviews));
router.delete('/reviews/:id', asyncHandler(deleteReview));

export default router;
