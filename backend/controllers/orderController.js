import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js"; 

// Create new order (after payment)
export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentResult } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  const itemsPrice = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const taxPrice = parseFloat((itemsPrice * 0.1).toFixed(2));
  const shippingPrice = itemsPrice > 200 ? 0 : 20;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  const order = new Order({
    user: req.user._id,
    items,
    shippingAddress,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentResult,
    isPaid: paymentResult?.status === "succeeded",
    paidAt: paymentResult?.status === "succeeded" ? Date.now() : null,
  });

  const createdOrder = await order.save();
  res.status(201).json({ success: true, data: createdOrder });
});


export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json({ success: true, data: orders });
});


export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email");
  if (order) {
    if (order.user._id.toString() === req.user._id.toString() || req.user.isAdmin) {
      res.json({ success: true, data: order });
    } else {
      res.status(403);
      throw new Error("Not authorized to view this order");
    }
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});


export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user", "name email");
  res.json({ success: true, count: orders.length, data: orders });
});


export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { isPaid, isDelivered } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    if (isPaid !== undefined) order.isPaid = isPaid;
    if (isDelivered !== undefined) order.isDelivered = isDelivered;
    if (isDelivered) order.deliveredAt = Date.now();
    if (isPaid) order.paidAt = Date.now();

    const updatedOrder = await order.save();
    res.json({ success: true, data: updatedOrder });
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});
