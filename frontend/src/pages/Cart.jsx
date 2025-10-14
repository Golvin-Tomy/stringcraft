

import React from "react";
import { useCart } from "../context/CartContext.jsx"; // or Zustand store
import CartItem from "../components/CartItem.jsx";
import CartSummary from "../components/CartSummary.jsx";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, updateQty, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-semibold mb-4">Your Cart is Empty</h2>
        <Link
          to="/products"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Cart Items */}
      <div className="flex-1 space-y-4">
        {cartItems.map((item) => (
          <CartItem
            key={item._id}
            item={item}
            onUpdateQty={updateQty}
            onRemove={removeFromCart}
          />
        ))}
      </div>

      {/* Cart Summary */}
      <div className="md:w-96">
        <CartSummary cartItems={cartItems} />
        <button
          onClick={handleCheckout}
          className="w-full mt-4 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
