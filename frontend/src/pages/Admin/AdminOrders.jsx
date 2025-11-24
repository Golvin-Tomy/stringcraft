import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../../components/Toast.jsx";

const AdminOrders = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/orders/admin", {
        withCredentials: true,
      });
      setOrders(data.data || data);
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(
        `/api/orders/admin/${orderId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      showToast("Order updated successfully!", "success");
      fetchOrders(); // Refresh list
    } catch (err) {
      showToast(err.response?.data?.error || "Update failed", "error");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-xl">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
        <button
          onClick={fetchOrders}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Refresh Orders
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow">
          <p className="text-xl text-gray-600">No orders yet</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Payment</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Delivery</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium">...{order._id.slice(-8)}</td>
                    <td className="px-6 py-4 text-sm">{order.user?.name || "Guest"}</td>
                    <td className="px-6 py-4 text-sm font-semibold">₹{order.totalPrice.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.isPaid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {order.isPaid ? "Paid" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.isDelivered ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {order.isDelivered ? "Delivered" : "Processing"}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      {!order.isDelivered && (
                        <button
                          onClick={() => updateStatus(order._id, "delivered")}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm font-medium"
                        >
                          Mark Delivered
                        </button>
                      )}
                      {order.isDelivered && (
                        <span className="text-green-600 font-bold">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;