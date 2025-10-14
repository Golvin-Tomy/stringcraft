

import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import colors from "colors";

import connectDB from "./config/db.js";
import Product from "./models/ProductModel.js"
import User from "./models/User.js";


dotenv.config();


const adminUser = {
  name: "Admin User",
  email: "admin@stringcraft.com",
  password: bcrypt.hashSync("Admin123!", 10),
  role: "admin",
};


const products = [
  {
    name: "Fender Stratocaster",
    slug: "fender-stratocaster",
    description: "Iconic electric guitar with classic design.",
    category: "electric",
    type: "electric",
    price: 1200,
    stock: 10,
    images: [{ url: "https://via.placeholder.com/300x300" }],
  },
  {
    name: "Gibson Les Paul",
    slug: "gibson-les-paul",
    description: "Legendary electric guitar with rich tone.",
    category: "electric",
    type: "electric",
    price: 1500,
    stock: 8,
    images: [{ url: "https://via.placeholder.com/300x300" }],
  },
  {
    name: "Yamaha FG800",
    slug: "yamaha-fg800",
    description: "Affordable acoustic guitar for beginners.",
    category: "acoustic",
    type: "acoustic",
    price: 200,
    stock: 15,
    images: [{ url: "https://via.placeholder.com/300x300" }],
  },
  {
    name: "Cordoba C5",
    slug: "cordoba-c5",
    description: "Nylon-string classical acoustic guitar.",
    category: "acoustic",
    type: "acoustic",
    price: 400,
    stock: 7,
    images: [{ url: "https://via.placeholder.com/300x300" }],
  },
  {
    name: "Kala KA-15S",
    slug: "kala-ka-15s",
    description: "Entry-level soprano ukulele with great tone.",
    category: "ukulele",
    type: "ukulele",
    price: 80,
    stock: 20,
    images: [{ url: "https://via.placeholder.com/300x300" }],
  },
  {
    name: "Lanikai LU-21",
    slug: "lanikai-lu-21",
    description: "High-quality concert ukulele.",
    category: "ukulele",
    type: "ukulele",
    price: 150,
    stock: 10,
    images: [{ url: "https://via.placeholder.com/300x300" }],
  },

];


const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();

    // Insert admin user
    const admin = await User.create(adminUser);
    console.log(colors.green("✅ Admin user created: "), admin.email);

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(colors.green(`✅ ${createdProducts.length} products created.`));

    process.exit();
  } catch (err) {
    console.error(colors.red(err));
    process.exit(1);
  }
};

seedData();
