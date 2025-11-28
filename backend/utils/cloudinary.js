import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

// Configure Cloudinary once at module load (not conditional)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (fileBuffer, folder = "stringcraft") => {
  try {
    // Check if Cloudinary is configured
    if (!cloudinary.config().cloud_name) {
      console.log("⚠️ Using local storage (Cloudinary not configured)");
      return saveLocally(fileBuffer);
    }

    // Cloudinary upload
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) return reject(error);
          resolve({ url: result.secure_url, public_id: result.public_id });
        }
      );
      uploadStream.end(fileBuffer);
    });

  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error.message);
    
    // Fallback to local storage on Cloudinary failure
    console.log("🔄 Falling back to local storage");
    return saveLocally(fileBuffer);
  }
};

// Extract local storage logic to separate function
const saveLocally = (fileBuffer) => {
  const uploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
  const filePath = path.join(uploadDir, fileName);
  fs.writeFileSync(filePath, fileBuffer);

  return { url: `/uploads/${fileName}` };
};

