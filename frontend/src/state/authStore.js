

import { create } from "zustand";
import api from "../services/api.js"; // Axios instance
import { setToken, getToken, logout as clearToken } from "../utils/auth.js";

const useAuthStore = create((set, get) => ({
  user: null,
  token: getToken() || null,
  loading: false,

  // Initialize user from token
  initUser: async () => {
    const token = getToken();
    if (!token) return;
    set({ loading: true });
    try {
      const { data } = await api.get("/users/profile"); // fetch profile
      set({ user: data.data, token });
    } catch (err) {
      console.error(err);
      get().logout();
    } finally {
      set({ loading: false });
    }
  },

  // Login
  login: async (email, password) => {
    set({ loading: true });
    try {
      const { data } = await api.post("/auth/login", { email, password });
      set({ user: data.data.user, token: data.data.token });
      setToken(data.data.token);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || "Login failed" };
    } finally {
      set({ loading: false });
    }
  },

  // Signup
  signup: async (name, email, password) => {
    set({ loading: true });
    try {
      const { data } = await api.post("/auth/signup", { name, email, password });
      set({ user: data.data.user, token: data.data.token });
      setToken(data.data.token);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || "Signup failed" };
    } finally {
      set({ loading: false });
    }
  },

  // Logout
  logout: () => {
    set({ user: null, token: null });
    clearToken();
  },

  // Update user profile locally
  updateUser: (updatedUser) => set({ user: updatedUser }),
}));

export default useAuthStore;
