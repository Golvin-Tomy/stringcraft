

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";


if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}


export const uploadToCloudinary = async (fileBuffer, folder = "stringcraft") => {
  try {
   
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder },
          (error, result) => {
            if (error) return reject(error);
            resolve({ url: result.secure_url });
          }
        );

        uploadStream.end(fileBuffer);
      });
    }


    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.jpg`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, fileBuffer);

    return { url: `/uploads/${fileName}` };
  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error);
    throw new Error("Image upload failed");
  }
};
