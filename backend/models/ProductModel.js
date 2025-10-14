

import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true
    },
    slug: {
      type: String,
      unique: true
    },
    description: {
      type: String,
      required: [true, "Product description is required"]
    },
    category: {
      type: String,
      required: [true, "Category is required"]
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String }
      }
    ],
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    type: {
      type: String,
      enum: ["electric", "acoustic", "ukulele"],
      required: true
    },
    ratings: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    }
  },
  {
    timestamps: true
  }
);


productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;
