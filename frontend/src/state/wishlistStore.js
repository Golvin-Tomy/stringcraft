import { create } from "zustand";
import api from "../services/api.js";

const useWishlistStore = create((set, get) => ({
  items: [],        // array of full product objects
  loading: false,

  // Fetch wishlist from DB
  fetchWishlist: async () => {
    set({ loading: true });
    try {
      const { data } = await api.get("/wishlist");
      set({ items: data.data || [] });
    } catch (err) {
      console.error("Failed to fetch wishlist", err);
    } finally {
      set({ loading: false });
    }
  },

  // Check if product is wishlisted
  isWishlisted: (productId) =>
    get().items.some((p) => p._id === productId),

  // Toggle wishlist
  toggleWishlist: async (productId) => {
    const alreadyWishlisted = get().isWishlisted(productId);
    try {
      if (alreadyWishlisted) {
        await api.delete(`/wishlist/${productId}`);
        set({ items: get().items.filter((p) => p._id !== productId) });
      } else {
        await api.post("/wishlist", { productId });
        // refetch to get full product data
        const { data } = await api.get("/wishlist");
        set({ items: data.data || [] });
      }
    } catch (err) {
      console.error("Wishlist toggle failed", err);
    }
  },

  clearWishlist: () => set({ items: [] }),
}));

export default useWishlistStore;