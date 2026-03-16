import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import useWishlistStore from "../state/wishlistStore";
import useAuthStore from "../state/authStore";

const ProductCard = ({ product, admin, onDelete }) => {
  const { isWishlisted, toggleWishlist } = useWishlistStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const wishlisted = isWishlisted(product._id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate("/signin");
      return;
    }
    await toggleWishlist(product._id);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col">
      {/* Image + Heart */}
      <Link to={`/products/${product._id}`} className="group relative">
        <div className="w-full aspect-w-1 aspect-h-1 overflow-hidden rounded-t-xl bg-gray-100">
          <img
            src={product.images?.[0]?.url || "/placeholder.png"}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        {/* Heart button */}
        {!admin && (
          <button
            onClick={handleWishlist}
            className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow hover:scale-110 transition-transform"
          >
            {wishlisted ? (
              <HeartSolid className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5 text-gray-400 hover:text-red-500 transition" />
            )}
          </button>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="mt-auto flex items-center justify-between text-sm font-medium">
          <span className="text-indigo-600 font-bold text-base">₹{product.price.toLocaleString()}</span>
          <span className="text-yellow-500 bg-yellow-100 px-2 py-0.5 rounded-md">{product.ratings}★</span>
        </div>

        {admin && (
          <div className="flex gap-2 mt-4">
            <Link
              to={`/admin/edit-product/${product._id}`}
              className="flex-1 text-center bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
            >
              Edit
            </Link>
            <button
              onClick={() => onDelete(product._id)}
              className="flex-1 text-center bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition text-sm"
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