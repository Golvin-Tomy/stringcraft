
import React from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  CubeIcon,
  ShoppingCartIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

const AdminSidebar = () => {
  const linkClasses = ({ isActive }) =>
    `flex items-center px-4 py-2 rounded hover:bg-indigo-600 hover:text-white transition ${
      isActive ? "bg-indigo-600 text-white" : "text-gray-700"
    }`;

  return (
    <aside className="w-64 bg-gray-100 border-r hidden md:flex flex-col">
      <div className="p-4 text-xl font-bold text-indigo-600">Admin</div>
      <nav className="flex-1 flex flex-col space-y-1 p-2">
        <NavLink to="/admin" className={linkClasses}>
          <HomeIcon className="h-5 w-5 mr-2" />
          Dashboard
        </NavLink>
        <NavLink to="/admin/products" className={linkClasses}>
          <CubeIcon className="h-5 w-5 mr-2" />
          Products
        </NavLink>
        <NavLink to="/admin/orders" className={linkClasses}>
          <ShoppingCartIcon className="h-5 w-5 mr-2" />
          Orders
        </NavLink>
        <NavLink to="/admin/users" className={linkClasses}>
          <UsersIcon className="h-5 w-5 mr-2" />
          Users
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
