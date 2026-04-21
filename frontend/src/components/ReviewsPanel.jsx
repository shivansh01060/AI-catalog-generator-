import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API = "http://localhost:5000";

function StarPicker({ value, onChange, size = "text-2xl" }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className={`${size} transition-transform hover:scale-110`}
          style={{
            color:
              star <= (hovered || value) ? "#f59e0b" : "rgba(255,255,255,0.15)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function StarDisplay({ rating, size = "text-sm" }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={size}
          style={{
            color: star <= rating ? "#f59e0b" : "rgba(255,255,255,0.15)",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function ReviewsPanel({ productId, productName, onClose }) {
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ rating: 0, comment: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userReview, setUserReview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`${API}/api/reviews/${productId}`);
      setReviews(res.data.reviews);
      setAvgRating(res.data.avgRating);
      setTotalReviews(res.data.totalReviews);

      // Check if user already reviewed
      if (user) {
        const mine = res.data.reviews.find((r) => r.userId === user._id);
        if (mine) {
          setUserReview(mine);
          setForm({ rating: mine.rating, comment: mine.comment });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.rating) {
      setError("Please select a star rating");
      return;
    }
    if (!form.comment.trim()) {
      setError("Please write a comment");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      if (editMode && userReview) {
        await axios.put(`${API}/api/reviews/${productId}`, form);
        setSuccess("Review updated!");
      } else {
        await axios.post(`${API}/api/reviews/${productId}`, form);
        setSuccess("Review submitted!");
      }
      setEditMode(false);
      fetchReviews();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API}/api/reviews/${productId}`);
      setUserReview(null);
      setForm({ rating: 0, comment: "" });
      setSuccess("Review deleted");
      fetchReviews();
    } catch (err) {
      setError("Failed to delete review");
    }
  };

  // Rating distribution
  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct:
      reviews.length > 0
        ? Math.round(
            (reviews.filter((r) => r.rating === star).length / reviews.length) *
              100,
          )
        : 0,
  }));

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50"
        style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ pointerEvents: "none" }}
      >
        <div
          className="glass rounded-3xl"
          style={{
            width: "100%",
            maxWidth: "720px",
            maxHeight: "88vh",
            overflowY: "auto",
            border: "1px solid rgba(99,57,255,0.4)",
            boxShadow: "0 0 80px rgba(99,57,255,0.25)",
            animation: "popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            pointerEvents: "all",
          }}
        >
          <style>{`
            @keyframes popIn {
              from { transform: scale(0.85); opacity: 0; }
              to { transform: scale(1); opacity: 1; }
            }
          `}</style>

          {/* Header */}
          <div
            className="flex items-center justify-between p-6 pb-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-2"
                style={{
                  background: "rgba(245,158,11,0.15)",
                  color: "#f59e0b",
                }}
              >
                ★ Reviews
              </div>
              <h2 className="font-display font-bold text-white text-xl">
                {productName?.substring(0, 40)}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              ✕
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Rating Summary */}
            {!loading && totalReviews > 0 && (
              <div
                className="flex items-center gap-8 p-5 rounded-2xl"
                style={{
                  background: "rgba(245,158,11,0.06)",
                  border: "1px solid rgba(245,158,11,0.15)",
                }}
              >
                {/* Big rating */}
                <div className="text-center flex-shrink-0">
                  <p
                    className="font-display text-6xl font-bold"
                    style={{ color: "#f59e0b" }}
                  >
                    {avgRating}
                  </p>
                  <StarDisplay rating={Math.round(avgRating)} size="text-lg" />
                  <p className="text-xs text-gray-500 mt-1">
                    {totalReviews} review{totalReviews !== 1 ? "s" : ""}
                  </p>
                </div>

                {/* Bar breakdown */}
                <div className="flex-1 space-y-2">
                  {ratingCounts.map(({ star, count, pct }) => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 w-4">{star}</span>
                      <span className="text-xs" style={{ color: "#f59e0b" }}>
                        ★
                      </span>
                      <div
                        className="flex-1 h-1.5 rounded-full"
                        style={{ background: "rgba(255,255,255,0.08)" }}
                      >
                        <div
                          className="h-1.5 rounded-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            background:
                              "linear-gradient(90deg, #f59e0b, #fcd34d)",
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-6">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Write a Review */}
            {user ? (
              <div
                className="rounded-2xl p-5"
                style={{
                  background: "rgba(99,57,255,0.06)",
                  border: "1px solid rgba(99,57,255,0.2)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white text-sm">
                    {userReview && !editMode
                      ? "Your Review"
                      : editMode
                        ? "Edit Your Review"
                        : "Write a Review"}
                  </h3>
                  {userReview && !editMode && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditMode(true)}
                        className="text-xs px-3 py-1.5 rounded-lg transition"
                        style={{
                          background: "rgba(99,57,255,0.2)",
                          color: "#a78bfa",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDelete}
                        className="text-xs px-3 py-1.5 rounded-lg transition"
                        style={{
                          background: "rgba(239,68,68,0.15)",
                          color: "#f87171",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* Show existing review or form */}
                {userReview && !editMode ? (
                  <div>
                    <StarDisplay rating={userReview.rating} size="text-xl" />
                    <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                      {userReview.comment}
                    </p>
                    <p className="text-xs text-gray-600 mt-2">
                      Posted{" "}
                      {new Date(userReview.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Star picker */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-400 mb-2">Your Rating</p>
                      <StarPicker
                        value={form.rating}
                        onChange={(val) => setForm({ ...form, rating: val })}
                        size="text-3xl"
                      />
                    </div>

                    {/* Comment */}
                    <div className="mb-4">
                      <p className="text-xs text-gray-400 mb-2">Your Review</p>
                      <textarea
                        value={form.comment}
                        onChange={(e) =>
                          setForm({ ...form, comment: e.target.value })
                        }
                        placeholder="Share your experience with this product..."
                        rows={3}
                        className="input-dark w-full rounded-xl px-4 py-3 text-sm resize-none"
                      />
                    </div>

                    {error && (
                      <p className="text-xs mb-3" style={{ color: "#f87171" }}>
                        ⚠️ {error}
                      </p>
                    )}
                    {success && (
                      <p className="text-xs mb-3" style={{ color: "#34d399" }}>
                        ✅ {success}
                      </p>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="btn-neon text-white px-6 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50"
                      >
                        {submitting
                          ? "Submitting..."
                          : editMode
                            ? "Update Review"
                            : "Submit Review"}
                      </button>
                      {editMode && (
                        <button
                          onClick={() => {
                            setEditMode(false);
                            setError("");
                          }}
                          className="px-6 py-2.5 rounded-xl text-sm font-medium transition"
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            color: "#9ca3af",
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div
                className="text-center py-6 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <p className="text-gray-400 text-sm">
                  Sign in to write a review
                </p>
              </div>
            )}

            {/* All Reviews */}
            <div>
              <h3 className="font-bold text-white text-sm mb-3">
                All Reviews {totalReviews > 0 && `(${totalReviews})`}
              </h3>

              {loading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin mx-auto" />
                </div>
              ) : reviews.length === 0 ? (
                <div
                  className="text-center py-10 rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <p className="text-4xl mb-2">⭐</p>
                  <p className="text-gray-400 text-sm">No reviews yet</p>
                  <p className="text-gray-600 text-xs mt-1">
                    Be the first to review!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {reviews.map((review, i) => (
                    <div
                      key={review._id}
                      className="rounded-2xl p-4"
                      style={{
                        background:
                          review.userId === user?._id
                            ? "rgba(99,57,255,0.08)"
                            : "rgba(255,255,255,0.03)",
                        border:
                          review.userId === user?._id
                            ? "1px solid rgba(99,57,255,0.2)"
                            : "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      {/* Review header */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {/* Avatar */}
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold"
                            style={{
                              background: `linear-gradient(135deg,
                                hsl(${(i * 60 + 200) % 360}, 70%, 35%),
                                hsl(${(i * 60 + 260) % 360}, 70%, 25%))`,
                            }}
                          >
                            {review.userName?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white leading-tight">
                              {review.userName}
                              {review.userId === user?._id && (
                                <span
                                  className="ml-2 text-xs px-1.5 py-0.5 rounded-full"
                                  style={{
                                    background: "rgba(99,57,255,0.2)",
                                    color: "#a78bfa",
                                  }}
                                >
                                  You
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-gray-600 leading-tight">
                              {new Date(review.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </p>
                          </div>
                        </div>
                        <StarDisplay rating={review.rating} />
                      </div>

                      <p className="text-sm text-gray-300 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReviewsPanel;
