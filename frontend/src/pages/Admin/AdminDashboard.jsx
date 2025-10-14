import React from "react";
import AdminProducts from "./Products.jsx";
import AdminOrders from "./Orders.jsx";
import AdminUsers from "./Users.jsx";
import AdminReviews from "./Reviews.jsx";

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p>Use the navigation to manage products, orders, users, and reviews.</p>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div>
          <h2 className="font-semibold">Products</h2>
          <AdminProducts />
        </div>
        <div>
          <h2 className="font-semibold">Orders</h2>
          <AdminOrders />
        </div>
        <div>
          <h2 className="font-semibold">Users</h2>
          <AdminUsers />
        </div>
        <div>
          <h2 className="font-semibold">Reviews</h2>
          <AdminReviews />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
