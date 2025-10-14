

import React, { useEffect, useState } from "react";
import api from "../../services/api.js";
import { useToast } from "../../components/Toast.jsx";

const AdminReviews = () => {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get("/reviews/admin");
      setReviews(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (id) => {
    try {
      await api.put(`/reviews/admin/${id}/approve`);
      showToast("Review approved", "success");
      fetchReviews();
    } catch (err) {
      console.error(err);
      showToast("Failed to approve review", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await api.delete(`/reviews/admin/${id}`);
      showToast("Review deleted", "success");
      fetchReviews();
    } catch (err) {
      console.error(err);
      showToast("Failed to delete review", "error");
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Review Moderation</h2>
      <table className="w-full table-auto border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">User</th>
            <th className="border px-2 py-1">Product</th>
            <th className="border px-2 py-1">Rating</th>
            <th className="border px-2 py-1">Comment</th>
            <th className="border px-2 py-1">Approved</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r) => (
            <tr key={r._id} className="hover:bg-gray-50">
              <td className="border px-2 py-1">{r.user?.name}</td>
              <td className="border px-2 py-1">{r.product?.name}</td>
              <td className="border px-2 py-1">{r.rating}</td>
              <td className="border px-2 py-1">{r.comment}</td>
              <td className="border px-2 py-1">{r.isApproved ? "Yes" : "No"}</td>
              <td className="border px-2 py-1 space-x-2">
                {!r.isApproved && (
                  <button
                    onClick={() => handleApprove(r._id)}
                    className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                )}
                <button
                  onClick={() => handleDelete(r._id)}
                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminReviews;
