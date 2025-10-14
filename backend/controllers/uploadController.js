

import asyncHandler from "express-async-handler";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const storage = multer.diskStorage({
  destination(req, file, cb) {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, JPG, PNG files are allowed"));
  }
};

export const upload = multer({ storage, fileFilter });


export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error("No files uploaded");
  }

  const uploadedFiles = [];

  for (const file of req.files) {
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "stringcraft/products"
      });
      uploadedFiles.push({
        url: result.secure_url,
        public_id: result.public_id
      });

      
      fs.unlinkSync(file.path);
    } else {
      
      uploadedFiles.push({
        url: `${req.protocol}://${req.get("host")}/${file.path}`,
        public_id: null
      });
    }
  }

  res.status(201).json({ success: true, data: uploadedFiles });
});
