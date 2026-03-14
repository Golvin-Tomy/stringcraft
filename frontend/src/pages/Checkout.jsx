import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../state/cartStore";
import useAuthStore from "../state/authStore";
import api from "../services/api.js";
import { useToast } from "../components/Toast.jsx";
import { ShoppingBagIcon, TruckIcon, CurrencyRupeeIcon } from "@heroicons/react/24/outline";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { addToast } = useToast();

  const [shipping, setShipping] = useState({
    fullName: user?.name || "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    phone: user?.phone || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setShipping({ ...shipping, [e.target.name]: e.target.value });

  const itemsPrice = getTotalPrice();
  const shippingPrice = itemsPrice > 5000 ? 0 : 99;
  const totalPrice = itemsPrice + shippingPrice;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      addToast("Your cart is empty", "error");
      return;
    }

    setLoading(true);
    try {
      const orderItems = cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        image: item.image || item.images?.[0]?.url || "",
        price: item.price,
        quantity: item.qty,
      }));

      const { data } = await api.post("/orders", {
        orderItems,
        shippingAddress: shipping,
        paymentMethod: "Cash on Delivery",
      });

      clearCart();
      addToast("Order placed successfully!", "success");
      navigate(`/account`);
    } catch (err) {
      console.error("ORDER ERROR:", err.response?.data);
      addToast(err.response?.data?.message || "Failed to place order", "error");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
        <ShoppingBagIcon className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Add some guitars before checking out.</p>
        <button
          onClick={() => navigate("/products")}
          className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6">
          {/* Left — Shipping Form */}
          <div className="flex-1 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-5">
                <TruckIcon className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text" name="fullName" value={shipping.fullName}
                    onChange={handleChange} placeholder="John Doe"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black transition"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text" name="address" value={shipping.address}
                    onChange={handleChange} placeholder="Street, House/Flat No."
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text" name="city" value={shipping.city}
                    onChange={handleChange} placeholder="Mumbai"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text" name="state" value={shipping.state}
                    onChange={handleChange} placeholder="Maharashtra"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input
                    type="text" name="postalCode" value={shipping.postalCode}
                    onChange={handleChange} placeholder="400001"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text" name="phone" value={shipping.phone}
                    onChange={handleChange} placeholder="+91 00000 00000"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black transition"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <CurrencyRupeeIcon className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
              </div>
              <div className="flex items-center gap-3 border border-black rounded-lg px-4 py-3 bg-gray-50">
                <div className="w-4 h-4 rounded-full bg-black shrink-0" />
                <span className="text-sm font-medium text-gray-800">Cash on Delivery</span>
              </div>
            </div>
          </div>

          {/* Right — Order Summary */}
          <div className="lg:w-80 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-5">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-5 max-h-60 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <img
                      src={item.image} alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 font-medium truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 shrink-0">
                      ₹{(item.price * item.qty).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Items</span>
                  <span>₹{itemsPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={shippingPrice === 0 ? "text-green-600 font-medium" : ""}>
                    {shippingPrice === 0 ? "FREE" : `₹${shippingPrice}`}
                  </span>
                </div>
                {shippingPrice > 0 && (
                  <p className="text-xs text-gray-400">Free shipping on orders above ₹5,000</p>
                )}
                <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full bg-black text-white py-4 rounded-xl font-bold text-sm hover:bg-gray-800 transition disabled:opacity-50"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;