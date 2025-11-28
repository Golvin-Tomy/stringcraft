// pages/Admin/AdminDashboard.jsx - Uses your exact setup
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../../state/authStore.js';
import api from '../../services/api.js';

const AdminDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard') // Your backend endpoint
      .then(res => {
        setStats(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Dashboard error:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
          <p className="text-gray-600">Admin Dashboard</p>
        </div>
      </div>

      {/* Stats Cards */}
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Link to="/admin/products" className="p-8 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-300 hover:shadow-xl transition-all text-center">
          <div className="text-4xl mb-4">📦</div>
          <h3 className="text-xl font-semibold mb-2">Manage Products</h3>
          <p>Inventory & stock levels</p>
        </Link>
        <Link to="/admin/orders" className="p-8 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-green-300 hover:shadow-xl transition-all text-center">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-xl font-semibold mb-2">Manage Orders</h3>
          <p>Process & ship orders</p>
        </Link>
        <Link to="/admin/users" className="p-8 bg-white border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-300 hover:shadow-xl transition-all text-center">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-xl font-semibold mb-2">Manage Users</h3>
          <p>Customer accounts</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
