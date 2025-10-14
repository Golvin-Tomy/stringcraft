

import asyncHandler from "express-async-handler";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


export const createPaymentIntent = asyncHandler(async (req, res) => {
  const { items, currency = "usd" } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error("No items provided for payment");
  }

  
  const amount = items.reduce((sum, item) => sum + item.price * item.qty * 100, 0);

  if (process.env.PAYMENT_MODE === "mock") {
    return res.status(200).json({
      success: true,
      clientSecret: "mock_client_secret",
      amount,
      currency,
    });
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount),
    currency,
    automatic_payment_methods: { enabled: true },
  });

  res.status(200).json({
    success: true,
    clientSecret: paymentIntent.client_secret,
  });
});


export const createCheckoutSession = asyncHandler(async (req, res) => {
  const { items, successUrl, cancelUrl } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error("No items provided for checkout");
  }

  if (process.env.PAYMENT_MODE === "mock") {
    return res.status(200).json({ success: true, url: "/checkout/mock-success" });
  }

  const line_items = items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: { name: item.name, images: item.images },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.qty,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  res.status(200).json({ success: true, url: session.url });
});
