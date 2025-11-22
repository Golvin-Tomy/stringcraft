import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import RatingStars from "../components/RatingStars.jsx";
import { useCart } from "../context/CartContext.jsx";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [toast, setToast] = useState(null);
  const [selectedQty, setSelectedQty] = useState(1);
  const { addToCart } = useCart();

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
    addToCart(product, selectedQty);

    setToast({
      message: "Added to Cart!",
      name: product.name,
      image: product.images?.[0],
    });

    setTimeout(() => setToast(null), 3000);
  };

  if (!product) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>

        {/* Product info */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <RatingStars rating={product.ratings} />
          <p className="text-gray-700">{product.description}</p>
          <p className="text-xl font-semibold text-indigo-600">
            ₹{product.price}
          </p>
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
            onClick={handleAddToCart}
            className="w-full md:w-auto bg-black text-white px-10 py-4 rounded-lg text-lg font-bold hover:bg-gray-800 transition"
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
                <span className="font-medium">
                  {r.user?.name || "Anonymous"}
                </span>
                <RatingStars rating={r.rating} />
              </div>
              <p className="text-gray-700">{r.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-in">
          <div className="bg-green-600 text-white rounded-lg shadow-2xl flex items-center p-4 max-w-sm">
            <svg
              className="w-10 h-10 mr-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <div>
              <div className="font-bold text-lg">{toast.message}</div>
              <div className="text-sm opacity-90">{toast.name}</div>
            </div>
            {toast.image && (
              <img
                src={toast.image}
                alt={toast.name}
                className="w-16 h-16 object-cover rounded ml-4"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
