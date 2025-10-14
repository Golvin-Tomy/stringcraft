import React from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../state/authStore";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;
