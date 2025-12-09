import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../state/authStore.js';
import api from '../../services/api.js';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => {
        setStats(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Dashboard error:', err);
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="p-6">

      {/* TOP BAR */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
          <p className="text-gray-600">Admin Dashboard</p>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="px-5 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* ADMIN MENU LINKS */}
      <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

        <Link to="/admin/products"
          className="p-4 bg-white border rounded-lg shadow hover:bg-gray-100 text-center">
          📦 Manage Products
        </Link>

        <Link to="/admin/orders"
          className="p-4 bg-white border rounded-lg shadow hover:bg-gray-100 text-center">
          📋 Manage Orders
        </Link>

        <Link to="/admin/users"
          className="p-4 bg-white border rounded-lg shadow hover:bg-gray-100 text-center">
          👥 Manage Users
        </Link>

        <Link to="/admin/reviews"
          className="p-4 bg-white border rounded-lg shadow hover:bg-gray-100 text-center">
          ⭐ Reviews
        </Link>

        <Link to="/admin/add-product"
          className="p-4 bg-white border rounded-lg shadow hover:bg-gray-100 text-center">
          ➕ Add Product
        </Link>

      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8 rounded-xl shadow-lg">
          <h3 className="text-lg opacity-90 mb-2">Total Orders</h3>
          <p className="text-4xl font-bold">{stats.stats?.totalOrders || 0}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 rounded-xl shadow-lg">
          <h3 className="text-lg opacity-90 mb-2">Total Users</h3>
          <p className="text-4xl font-bold">{stats.stats?.totalUsers || 0}</p>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-8 rounded-xl shadow-lg">
          <h3 className="text-lg opacity-90 mb-2">Low Stock</h3>
          <p className="text-4xl font-bold">{stats.stats?.lowStockProducts || 0}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-8 rounded-xl shadow-lg">
          <h3 className="text-lg opacity-90 mb-2">Products</h3>
          <p className="text-4xl font-bold">{stats.stats?.totalProducts || 0}</p>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
