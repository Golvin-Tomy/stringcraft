

import React from "react";
import { useNavigate } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/outline";

const AdminHeader = ({ adminName }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth state (Zustand/Context)
    // Example: authStore.logout();
    navigate("/signin");
  };

  return (
    <header className="bg-white border-b shadow px-4 py-3 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-700">Admin Dashboard</h1>

      <div className="flex items-center space-x-4">
        <span className="hidden sm:inline text-gray-700 font-medium">{adminName}</span>
        <UserCircleIcon className="h-6 w-6 text-gray-700" />
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
