import React from "react";
import { useAuthStore } from "./state/authStore";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import ToastProvider from "./components/Toast.jsx";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Search from "../src/components/SearchBar.jsx";
import About from "../src/pages/About.jsx";

import SignIn from "./pages/Auth/SignIn.jsx";
import SignUp from "./pages/Auth/SignUp.jsx";

import Checkout from "./pages/Checkout.jsx";
import Account from "./pages/Account.jsx";

import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import AdminProducts from "./pages/Admin/AdminProducts.jsx";
import AdminOrders from "./pages/Admin/AdminOrders.jsx";
import AdminUsers from "./pages/Admin/AdminUsers.jsx";
import AdminReviews from "./pages/Admin/AdminReviews.jsx";
import AddProduct from "./pages/Admin/AddProducts.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";
import EditProduct from "./pages/Admin/EditProduct.jsx";

import NotFound from "./pages/NotFound.jsx";

import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setState: setAuth, initUser } = useAuthStore();

    useEffect(() => {
    initUser();
  }, []);
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");
    const authSuccess = urlParams.get("auth") === "success";

    if (token && authSuccess) {
      // ✅ Save token + user from OAuth
      setAuth({
        user: {
          _id: "from-oauth",
          name: "Google User",
          email: "from-oauth",
          role: "user",
        },
        token,
      });

      navigate("/", { replace: true });
    }
  }, [location.search, navigate, setAuth]);



  const isAdminPage = location.pathname.startsWith("/admin");
  const isAuthPage =
    location.pathname === "/signin" || location.pathname === "/signup";
  const showHeaderFooter = !isAdminPage && !isAuthPage;

  return (
    <ToastProvider>
      <div className="flex flex-col min-h-screen bg-white text-black">
        <Toaster position="top-right" />
        {/* Header */}
        {showHeaderFooter && <Header />}

        {/* Main Content */}
        <main className="flex-grow container mx-auto px-4 py-6">
          <Routes>
            {/* 🌍 Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/search" element={<Search />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/about" element={<About />} />

            {/* 🔐 Protected (User) Routes */}
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              }
            />

            {/* 🛠️ Admin Routes */}

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />{" "}
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />{" "}
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="edit-product/:id" element={<EditProduct />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="reviews" element={<AdminReviews />} />
            </Route>

            {/* 🚫 404 - Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Footer */}
        {showHeaderFooter && <Footer />}
      </div>
    </ToastProvider>
  );
};

export default App;
