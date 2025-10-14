
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import useCartStore from "../state/cartStore";
import api from "../services/api.js";
import { useToast } from "../components/Toast.jsx";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
  const { cartItems, getTotalPrice, clearCart } = useCartStore();
  const stripe = useStripe();
  const elements = useElements();
  const { showToast } = useToast();

  const [shipping, setShipping] = useState({ name: "", address: "", city: "", postalCode: "", country: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      // 1. Create PaymentIntent on backend
      const { data } = await api.post("/payments/create-payment-intent", {
        items: cartItems,
        currency: "usd"
      });

      const clientSecret = data.clientSecret;

      // 2. Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) }
      });

      if (result.error) {
        showToast(result.error.message, "error");
      } else if (result.paymentIntent.status === "succeeded") {
        showToast("Payment successful! Order created.", "success");

        // 3. Create order in backend
        await api.post("/orders", {
          items: cartItems,
          shippingAddress: shipping,
          paymentResult: result.paymentIntent
        });

        clearCart();
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.error || "Payment failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-2xl font-semibold">Checkout</h2>

      {/* Shipping Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={shipping.name}
          onChange={handleChange}
          required
          className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={shipping.address}
          onChange={handleChange}
          required
          className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={shipping.city}
          onChange={handleChange}
          required
          className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={shipping.postalCode}
          onChange={handleChange}
          required
          className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={shipping.country}
          onChange={handleChange}
          required
          className="border px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 p-4 rounded space-y-2">
        <h3 className="font-semibold">Order Summary</h3>
        <p>Total Items: {cartItems.reduce((sum, item) => sum + item.qty, 0)}</p>
        <p>Total Price: ${getTotalPrice().toFixed(2)}</p>
      </div>

      {/* Stripe Card */}
      <div className="border p-4 rounded">
        <CardElement className="p-2 border rounded" />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

const Checkout = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;
