import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";


export const getProducts = asyncHandler(async (req, res) => {
  let {
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
    name,
    category,
    minPrice,
    maxPrice,
    minRating,
  } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  const query = {};

  if (name) query.name = { $regex: name, $options: "i" };
  if (category) query.category = category;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }
  if (minRating) query.ratings = { $gte: parseFloat(minRating) };

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
  const { name, description, price, category, stock, image } = req.body;

  const product = new Product({
    name,
    description,
    price,
    category,
    stock,
    image,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

/**
 * @desc Update product by ID
 * @route PUT /api/products/:id
 * @access Admin
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, stock, image } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock || product.stock;
    product.image = image || product.image;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

/**
 * @desc Delete product by ID
 * @route DELETE /api/products/:id
 * @access Admin
 */
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
