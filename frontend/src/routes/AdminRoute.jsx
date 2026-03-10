import React from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../state/authStore";

const AdminRoute = ({ children }) => {
  const { user, token } = useAuthStore();  // ✅ ADD TOKEN CHECK

  console.log('AdminRoute check:', { user: user?.email, hasToken: !!token });  // ✅ DEBUG

  if (!user || !token) {  // ✅ BOTH REQUIRED
    console.log('❌ No user/token - redirect to signin');
    return <Navigate to="/signin" replace />;
  }

  if (user.role !== "admin") {
    console.log('❌ Not admin - redirect to home');
    return <Navigate to="/" replace />;
  }

  console.log('✅ AdminRoute PASSED');
  return children;
};

export default AdminRoute;
