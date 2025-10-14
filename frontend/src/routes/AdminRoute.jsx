import React from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../state/authStore";

const AdminRoute = ({ children }) => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
