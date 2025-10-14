

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import RatingStars from "../components/RatingStars.jsx";
import { useCart } from "../context/CartContext.jsx"; // or Zustand store

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedQty, setSelectedQty] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="space-y-8">
      {/* Product top section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Carousel */}
        <div className="space-y-2">
          {product.images?.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 rounded-lg" />
          )}
          {/* Optional: Implement full carousel here */}
        </div>

        {/* Product info */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <RatingStars rating={product.ratings} />
          <p className="text-gray-700">{product.description}</p>
          <p className="text-xl font-semibold text-indigo-600">${product.price}</p>
          <div className="flex items-center space-x-2">
            <label>Qty:</label>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={selectedQty}
              onChange={(e) => setSelectedQty(Number(e.target.value))}
              className="w-16 border rounded px-2 py-1 text-center"
            />
          </div>
          <button
            onClick={() => addToCart(product, selectedQty)}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white border rounded-lg p-4">
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
        {product.reviews && product.reviews.length > 0 ? (
          product.reviews.map((r) => (
            <div key={r._id} className="border-b py-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{r.user?.name || "Anonymous"}</span>
                <RatingStars rating={r.rating} />
              </div>
              <p className="text-gray-700">{r.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
        {/* Optional: add review form for logged-in users */}
      </div>
    </div>
  );
};

export default ProductDetails;
