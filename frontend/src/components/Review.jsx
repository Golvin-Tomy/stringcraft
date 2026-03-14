import React, { useState, useEffect } from "react";
import api from "../services/api.js";
import useAuthStore from "../state/authStore.js";
import { useToast } from "./Toast.jsx";  // ← fixed import
import RatingStars from "./RatingStars.jsx";

const Reviews = ({ productId }) => {
  const { user } = useAuthStore();
  const { addToast } = useToast();  // ← fixed: addToast not showToast

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      const { data } = await api.get(`/reviews/product/${productId}`);
      setReviews(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return addToast("Please select a star rating", "error");
    if (!comment.trim()) return addToast("Please write a comment", "error");

    setLoading(true);
    try {
      if (editing) {
        await api.put(`/reviews/${editing}`, { rating, comment });
        addToast("Review updated!", "success");
      } else {
        await api.post(`/reviews`, { product: productId, rating, comment });
        addToast("Review submitted!", "success");
      }
      setRating(0);
      setComment("");
      setEditing(null);
      fetchReviews();
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to submit review", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (review) => {
    setEditing(review._id);
    setRating(review.rating);
    setComment(review.comment);
    window.scrollTo({ top: document.body.scrollHeight * 0.6, behavior: "smooth" });
  };

  const handleDelete = async (_id) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await api.delete(`/reviews/${_id}`);
      addToast("Review deleted", "success");
      fetchReviews();
    } catch (err) {
      addToast(err.response?.data?.message || "Failed to delete review", "error");
    }
  };

  return (
    <div className="mt-10">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Customer Reviews
        {reviews.length > 0 && (
          <span className="ml-2 text-base font-normal text-gray-400">
            ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
          </span>
        )}
      </h3>

      {/* Review Form */}
      {user ? (
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
          <h4 className="font-semibold text-gray-800 mb-4">
            {editing ? "Edit Your Review" : "Write a Review"}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Rating:</span>
              <RatingStars rating={rating} setRating={setRating} editable />
              {rating > 0 && (
                <span className="text-sm text-gray-500">
                  {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
                </span>
              )}
            </div>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black transition resize-none"
              rows="4"
              placeholder="Share your experience with this product..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition disabled:opacity-50"
              >
                {loading ? "Submitting..." : editing ? "Update Review" : "Submit Review"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => { setEditing(null); setRating(0); setComment(""); }}
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100 text-center">
          <p className="text-gray-500 text-sm">
            Please{" "}
            <a href="/signin" className="text-black font-semibold hover:underline">
              sign in
            </a>{" "}
            to write a review.
          </p>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <p className="text-lg">No reviews yet.</p>
          <p className="text-sm mt-1">Be the first to review this product!</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li key={r._id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {r.user?.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{r.user?.name || "User"}</p>
                    <RatingStars rating={r.rating} />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-400">
                    {new Date(r.createdAt).toLocaleDateString("en-IN")}
                  </p>
                  {user && r.user?._id === user._id && (
                    <>
                      <button
                        onClick={() => handleEdit(r)}
                        className="text-xs text-indigo-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">{r.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Reviews;