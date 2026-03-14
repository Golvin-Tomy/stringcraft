import React, { useEffect, useState } from "react";
import api from "../../services/api.js";           // ← use api instance
import { useToast } from "../../components/Toast.jsx";

const AdminReviews = () => {
  const { addToast } = useToast();                 // ← addToast not showToast
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/reviews/admin/all");  // ← correct route
      setReviews(data.data || []);
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to load reviews", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/reviews/admin/${id}/approve`, {});
      addToast("Review approved!", "success");
      fetchReviews();
    } catch (err) {
      addToast(err.response?.data?.message || "Approve failed", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this review?")) return;
    try {
      await api.delete(`/reviews/admin/${id}`);
      addToast("Review deleted", "success");
      fetchReviews();
    } catch (err) {
      addToast(err.response?.data?.message || "Delete failed", "error");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-600">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Review Moderation</h1>
          <p className="text-gray-600 mt-1">
            Total: {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={fetchReviews}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition font-medium"
        >
          Refresh
        </button>
      </div>

      {/* Empty State */}
      {reviews.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow">
          <p className="text-2xl text-gray-600 mb-2">No reviews yet</p>
          <p className="text-gray-500">Customer reviews will appear here when submitted</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">User</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Rating</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Comment</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reviews.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {r.user?.name?.[0]?.toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{r.user?.name || "Unknown"}</p>
                          <p className="text-xs text-gray-400">{r.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {r.product?.name || "Unknown"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-yellow-500 font-bold text-sm">
                        {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                      <p className="truncate" title={r.comment}>{r.comment}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        r.isApproved
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {r.isApproved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {!r.isApproved && (
                          <button
                            onClick={() => handleApprove(r._id)}
                            className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition text-xs font-semibold"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(r._id)}
                          className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition text-xs font-semibold"
                        >
                          Delete
                        </button>
                      </div>
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

export default AdminReviews;