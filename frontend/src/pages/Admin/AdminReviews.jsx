import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../../components/Toast.jsx";

const AdminReviews = () => {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/reviews/admin", {
        withCredentials: true,
      });
      setReviews(data.data || data);
    } catch (err) {
      showToast(err.response?.data?.error || "Failed to load reviews", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(
        `/api/reviews/admin/${id}/approve`,
        {},
        { withCredentials: true }
      );
      showToast("Review approved!", "success");
      fetchReviews();
    } catch (err) {
      showToast(err.response?.data?.error || "Approve failed", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this review?")) return;

    try {
      await axios.delete(`/api/reviews/admin/${id}`, {
        withCredentials: true,
      });
      showToast("Review deleted", "success");
      fetchReviews();
    } catch (err) {
      showToast(err.response?.data?.error || "Delete failed", "error");
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
          <p className="text-gray-600 mt-1">Total: {reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={fetchReviews}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium"
        >
          Refresh Reviews
        </button>
      </div>

      {/* Empty State */}
      {reviews.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow">
          <p className="text-2xl text-gray-600 mb-4">No reviews yet</p>
          <p className="text-gray-500">Customer reviews will appear here when submitted</p>
        </div>
      ) : (
        /* Reviews Table */
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">User</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Rating</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Comment</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reviews.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium">{r.user?.name || "Guest"}</td>
                    <td className="px-6 py-4 text-sm">{r.product?.name || "Unknown"}</td>
                    <td className="px-6 py-4">
                      <span className="text-yellow-500 font-bold">{r.rating} ★</span>
                    </td>
                    <td className="px-6 py-4 text-sm max-w-xs truncate" title={r.comment}>
                      {r.comment}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          r.isApproved
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {r.isApproved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      {!r.isApproved && (
                        <button
                          onClick={() => handleApprove(r._id)}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition text-sm font-medium"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm font-medium"
                      >
                        Delete
                      </button>
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
