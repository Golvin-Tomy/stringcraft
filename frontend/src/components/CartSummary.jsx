
import React from "react";
import { useNavigate } from "react-router-dom";

const CartSummary = ({ cartItems }) => {
  const navigate = useNavigate();

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const taxPrice = +(itemsPrice * 0.1).toFixed(2); // 10% tax
  const shippingPrice = itemsPrice > 500 ? 0 : 25;
  const totalPrice = +(itemsPrice + taxPrice + shippingPrice).toFixed(2);

  return (
    <div className="bg-white border rounded-lg p-6 shadow-md">
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Items:</span>
          <span>${itemsPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax (10%):</span>
          <span>${taxPrice}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping:</span>
          <span>${shippingPrice}</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>Total:</span>
          <span>${totalPrice}</span>
        </div>
      </div>

      <button
        onClick={() => navigate("/checkout")}
        className="w-full mt-4 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartSummary;
