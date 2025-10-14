

import express from "express";
import { createPaymentIntent, createCheckoutSession } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/create-payment-intent", protect, createPaymentIntent);


router.post("/create-checkout-session", protect, createCheckoutSession);

export default router;
