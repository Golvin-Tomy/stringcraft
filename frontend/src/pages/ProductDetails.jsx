import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import RatingStars from "../components/RatingStars.jsx";
import Reviews from "../components/Review.jsx";
import useCartStore from "../state/cartStore.js";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [toast, setToast] = useState(null);
  const [selectedQty, setSelectedQty] = useState(1);
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addItem(product, selectedQty);
    setToast({
      message: "Added to Cart!",
      name: product.name,
      image: product.images?.[0]?.url || "",
    });
    setTimeout(() => setToast(null), 3000);
  };

  if (!product) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image */}
        <div className="flex justify-center">
          {product.images?.length > 0 ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-full max-w-lg h-auto rounded-xl object-cover shadow"
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 rounded-xl" />
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="flex items-center gap-2">
            <RatingStars rating={product.ratings} />
            <span className="text-sm text-gray-500">
              {product.ratings > 0 ? `${product.ratings} / 5` : "No ratings yet"}
            </span>
          </div>
          <p className="text-gray-700">{product.description}</p>
          <p className="text-2xl font-bold text-gray-900">₹{product.price.toLocaleString()}</p>
          <p className={`text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Qty:</label>
            <input
              type="number"
              min="1"
              max={product.stock}
              value={selectedQty}
              onChange={(e) => setSelectedQty(Number(e.target.value))}
              className="w-16 border rounded-lg px-2 py-1.5 text-center focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full md:w-auto bg-black text-white px-10 py-4 rounded-lg text-lg font-bold hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Reviews — using the proper Reviews component */}
      <Reviews productId={id} />  {/* ← replaces the old inline reviews section */}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="bg-green-600 text-white rounded-lg shadow-2xl flex items-center p-4 max-w-sm">
            <svg className="w-10 h-10 mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            <div className="flex-1">
              <div className="font-bold text-lg">{toast.message}</div>
              <div className="text-sm opacity-90">{toast.name}</div>
            </div>
            {toast.image && (
              <img src={toast.image} alt={toast.name} className="w-16 h-16 object-cover rounded-lg ml-4" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;