import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, admin, onDelete }) => {
  return (
    <div className="bg-white border rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col">

      {/* Product Image */}
      <Link to={`/products/${product._id}`}>
        <img
          src={product.images?.[0]?.url || "/placeholder.png"}
          alt={product.name}
          className="h-48 w-full object-cover"
        />
      </Link>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">

        <h3 className="text-lg font-semibold mb-1">
          {product.name}
        </h3>

        <p className="text-gray-500 text-sm mb-2 truncate">
          {product.description}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-indigo-600 font-bold">
            ₹{product.price}
          </span>

          <span className="text-yellow-500">
            {product.ratings}★
          </span>
        </div>

        {/* ADMIN BUTTONS */}
        {admin && (
          <div className="flex gap-2 mt-4">

            {/* EDIT BUTTON */}
            <Link
              to={`/admin/edit-product/${product._id}`}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
            >
              Edit
            </Link>

            {/* DELETE BUTTON */}
            <button
              onClick={() => onDelete(product._id)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
            >
              Delete
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

export default ProductCard;