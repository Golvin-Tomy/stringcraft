import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

export const getProducts = asyncHandler(async (req, res) => {
  let {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
    name,
    search,
    category,
    brand,
    minPrice,
    maxPrice,
    minRating,
    featured,
  } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  const query = {};
  if (brand) query.brand = brand;
  if (name || search) {
    query.name = { $regex: name || search, $options: "i" };
  }
  if (category) query.category = category;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }
  if (minRating) query.ratings = { $gte: parseFloat(minRating) };
  if (featured) query.featured = featured === "true";

  const total = await Product.countDocuments(query);
  const sortOrder = order === "asc" ? 1 : -1;

  const products = await Product.find(query)
    .sort({ [sortBy]: sortOrder })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({
    success: true,
    data: products,
    page,
    totalPages: Math.ceil(total / limit),
    totalItems: total,
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, stock, brand, images,featured } = req.body;

  const product = new Product({
    name,
    description,
    price: Number(price),
    category,
    stock: Number(stock),
    brand,
    images,
    featured: featured || false,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, stock, images,featured } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price ? Number(price) : product.price;
    product.category = category || product.category;
    product.stock = stock !== undefined ? Number(stock) : product.stock;
    product.images = images || product.images;
    product.featured = featured ?? product.featured;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});
