

import React, { useState, useEffect } from "react";
import api from "../services/api.js";
import useAuthStore from "../state/authStore.jsx";
import { useToast } from "./ToastProvider.jsx";
import RatingStars from "./RatingStars.jsx";

const Reviews = ({ productId }) => {
  const { user } = useAuthStore();
  const { showToast } = useToast();

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editing, setEditing] = useState(null); // review _id being edited
  const [loading, setLoading] = useState(false);

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      const { data } = await api.get(`/reviews/product/${productId}`);
      setReviews(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) return showToast("Please provide rating & comment", "error");
    setLoading(true);

    try {
      if (editing) {
        // Edit review
        await api.put(`/reviews/${editing}`, { rating, comment });
        showToast("Review updated", "success");
      } else {
        // Create review
        await api.post(`/reviews`, { product: productId, rating, comment });
        showToast("Review submitted", "success");
      }
      setRating(0);
      setComment("");
      setEditing(null);
      fetchReviews();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.error || "Failed to submit review", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (review) => {
    setEditing(review._id);
    setRating(review.rating);
    setComment(review.comment);
  };

  const handleDelete = async (_id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await api.delete(`/reviews/${_id}`);
      showToast("Review deleted", "success");
      fetchReviews();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.error || "Failed to delete review", "error");
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Reviews</h3>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-6 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="font-medium">Your Rating:</span>
            <RatingStars rating={rating} setRating={setRating} editable />
          </div>
          <textarea
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="3"
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {editing ? "Update Review" : "Submit Review"}
          </button>
          {editing && (
            <button
              type="button"
              className="ml-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => {
                setEditing(null);
                setRating(0);
                setComment("");
              }}
            >
              Cancel
            </button>
          )}
        </form>
      ) : (
        <p className="text-gray-500">Please log in to submit a review.</p>
      )}

      <ul className="space-y-4">
        {reviews.map((r) => (
          <li key={r._id} className="border rounded p-3">
            <div className="flex justify-between items-center">
              <div>
                <RatingStars rating={r.rating} />
                <p className="font-medium">{r.user?.name || "User"}</p>
              </div>
              {user && r.user?._id === user._id && (
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(r)}
                    className="text-indigo-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            <p className="mt-2">{r.comment}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reviews;
