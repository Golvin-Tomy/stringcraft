

import axios from "axios";
import { getToken, logout } from "../utils/auth.js"; // helper to get JWT from localStorage or context

// Create Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // send cookies if refresh token is stored in httpOnly cookie
});

// Request interceptor: attach Authorization header
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 / token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Optionally implement refresh token logic here
      logout(); // clear token and redirect to signin
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default api;
