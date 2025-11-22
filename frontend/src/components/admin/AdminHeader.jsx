import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";   // ← your AuthContext

const AdminHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();   // ← get user & logout from context

  const handleLogout = () => {
    logout();   // ← this clears context + localStorage + cookie
    navigate("/signin");
  };

  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <h1 class

Name="text-2xl font-bold">StringCraft Admin</h1>
        {/* Optional: Show admin name */}
        {user && (
          <span className="text-sm opacity-80">
            Hi, {user.name?.split(" ")[0] || "Admin"} 👋
          </span>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
      >
        Logout
      </button>
    </header>
  );
};

export default AdminHeader;
