

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../../components/Toast.jsx";

const AdminOrders = () => {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/orders/admin");
      setOrders(data.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load orders", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/orders/admin/${id}`, { status });
      showToast("Order updated", "success");
      fetchOrders();
    } catch (err) {
      showToast(err.response?.data?.error || "Update failed", "error");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Orders Management</h2>
      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">User</th>
                <th className="border px-4 py-2">Total</th>
                <th className="border px-4 py-2">Paid</th>
                <th className="border px-4 py-2">Delivered</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{o._id.slice(-6)}</td>
                  <td className="border px-4 py-2">{o.user?.name}</td>
                  <td className="border px-4 py-2">${o.totalPrice.toFixed(2)}</td>
                  <td className="border px-4 py-2">{o.isPaid ? "Yes" : "No"}</td>
                  <td className="border px-4 py-2">{o.isDelivered ? "Yes" : "No"}</td>
                  <td className="border px-4 py-2 space-x-2">
                    {!o.isDelivered && (
                      <button
                        onClick={() => updateStatus(o._id, "delivered")}
                        className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
