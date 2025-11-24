import asyncHandler from "express-async-handler";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Local storage (fallback if no Cloudinary)
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename(req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `image-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only .png, .jpg, .jpeg, .webp format allowed!"));
  }
};

export const upload = multer({ storage, fileFilter });

// UPLOAD SINGLE OR MULTIPLE IMAGES
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error("No image files uploaded");
  }

  const uploadedUrls = [];

  for (const file of req.files) {
    try {
      // Try Cloudinary first
      if (
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
      ) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "stringcraft/products",
          transformation: [
            { width: 1000, height: 1000, crop: "limit" },
            { quality: "auto", fetch_format: "auto" },
          ],
        });

        uploadedUrls.push(result.secure_url);

        // Delete local file after Cloudinary upload
        fs.unlinkSync(file.path);
      } else {
        // Fallback to local storage
        const url = `${req.protocol}://${req.get("host")}/${file.path.replace(/\\/g, "/")}`;
        uploadedUrls.push(url);
      }
    } catch (err) {
      console.error("Upload failed for:", file.originalname, err);
      uploadedUrls.push("/images/placeholder.jpg"); // fallback image
    }
  }

  res.json({
    success: true,
    message: "Images uploaded successfully",
    urls: uploadedUrls, // ← returns array of URLs (perfect for AddProduct.jsx)
  });
});