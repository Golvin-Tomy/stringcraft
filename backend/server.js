import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/db.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

import passport from "./middleware/googleAuth.js";
import session from "express-session";
import MongoStore from "connect-mongo";

dotenv.config();
connectDB();

const app = express();

// 🔥 CORS - EXACTLY LIKE THIS (NO CHANGES)
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
  optionsSuccessStatus: 200
}));

// 🔥 BODY PARSERS
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// 🔥 SECURITY & LOGGING
app.use(helmet());
app.use(morgan("dev"));

// 🔥 ROOT ROUTE
app.get("/", (req, res) => {
  res.json({ success: true, message: "StringCraft API 🚀" });
});

// 🔥 SESSION
app.use(session({
  secret: process.env.JWT_SECRET || "your_jwt_secret_here",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    secure: false, // Set true in production HTTPS
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: 'lax'
  }
}));

// 🔥 PASSPORT
app.use(passport.initialize());
app.use(passport.session());

// 🔥 ROUTES
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/review", reviewRoutes);

// 🔥 ERROR HANDLERS - LAST
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log(`🌐 Frontend: http://localhost:5173`);
});
