import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useWishlistStore from "../state/wishlistStore";
import useCartStore from "../state/cartStore";
import useAuthStore from "../state/authStore";
import { HeartIcon, ShoppingCartIcon, TrashIcon } from "@heroicons/react/24/outline";

const Wishlist = () => {
  const { items, fetchWishlist, toggleWishlist, loading } = useWishlistStore();
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate("/signin"); return; }
    fetchWishlist();
  }, [user]);

  const handleMoveToCart = (product) => {
    addItem(product, 1);
    toggleWishlist(product._id);
  };

  if (loading) return <div className="text-center py-20"><p className="text-gray-500">Loading wishlist...</p></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <HeartIcon className="w-7 h-7 text-red-500" />
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          {items.length > 0 && (
            <span className="text-sm text-gray-400">({items.length} item{items.length !== 1 ? "s" : ""})</span>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
            <HeartIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-400 mb-6">Save guitars you love and come back to them later.</p>
            <Link
              to="/products"
              className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((product) => (
              <div key={product._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                {/* Image */}
                <Link to={`/products/${product._id}`} className="group relative">
                  <img
                    src={product.images?.[0]?.url || "/placeholder.png"}
                    alt={product.name}
                    className="w-full h-52 object-contain bg-gray-50 group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                {/* Info */}
                <div className="p-4 flex flex-col flex-grow">
                  <Link to={`/products/${product._id}`}>
                    <h3 className="font-semibold text-gray-800 hover:underline line-clamp-1">{product.name}</h3>
                  </Link>
                  <p className="text-sm text-gray-400 mt-0.5">{product.brand}</p>
                  <p className="text-lg font-bold text-gray-900 mt-2">₹{product.price.toLocaleString()}</p>

                  <div className="flex gap-2 mt-4">
                    {/* Add to Cart */}
                    <button
                      onClick={() => handleMoveToCart(product)}
                      className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition"
                    >
                      <ShoppingCartIcon className="w-4 h-4" />
                      Add to Cart
                    </button>

                    {/* Remove from Wishlist */}
                    <button
                      onClick={() => toggleWishlist(product._id)}
                      className="p-2.5 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition group"
                    >
                      <TrashIcon className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;