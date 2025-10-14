

import { create } from "zustand";

// Helper to load/save cart from localStorage
const loadCart = () => {
  try {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const useCartStore = create((set, get) => ({
  cartItems: loadCart(),

  // Add or update item
  addItem: (product, qty = 1) => {
    const existing = get().cartItems.find((item) => item._id === product._id);
    let updated;
    if (existing) {
      updated = get().cartItems.map((item) =>
        item._id === product._id ? { ...item, qty: item.qty + qty } : item
      );
    } else {
      updated = [...get().cartItems, { ...product, qty }];
    }
    set({ cartItems: updated });
    saveCart(updated);
  },

  // Remove item
  removeItem: (productId) => {
    const updated = get().cartItems.filter((item) => item._id !== productId);
    set({ cartItems: updated });
    saveCart(updated);
  },

  // Update quantity
  updateQty: (productId, qty) => {
    const updated = get().cartItems.map((item) =>
      item._id === productId ? { ...item, qty } : item
    );
    set({ cartItems: updated });
    saveCart(updated);
  },

  // Clear cart
  clearCart: () => {
    set({ cartItems: [] });
    localStorage.removeItem("cart");
  },

  // Get totals
  getTotalItems: () => get().cartItems.reduce((sum, item) => sum + item.qty, 0),
  getTotalPrice: () =>
    get().cartItems.reduce((sum, item) => sum + item.qty * item.price, 0),
}));

export default useCartStore;
