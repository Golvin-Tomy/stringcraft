

import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white border rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col">
      <Link to={`/products/${product._id}`}>
        <img
          src={product.images?.[0] || "/placeholder.png"}
          alt={product.name}
          className="h-48 w-full object-cover"
        />
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-2 truncate">{product.description}</p>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-indigo-600 font-bold">${product.price}</span>
          <span className="text-yellow-500">{product.ratings}★</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
