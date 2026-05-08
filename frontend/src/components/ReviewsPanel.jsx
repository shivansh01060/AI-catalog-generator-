// ReviewsPanel.jsx — Mobile-responsive version
// Drop-in replacement; props interface unchanged.

import { useState } from "react";

function StarRating({ value, max = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className="text-sm leading-none"
          style={{ color: i < Math.round(value) ? "#fbbf24" : "#374151" }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function ReviewsPanel({ reviews = [], averageRating, totalReviews }) {
  const [visibleCount, setVisibleCount] = useState(5);

  if (!reviews.length) {
    return (
      <div
        className="rounded-2xl p-6 text-center"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <p className="text-4xl mb-3">💬</p>
        <p className="text-gray-400 text-sm">No reviews yet.</p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Summary header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 p-4 md:p-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-3">
          <div>
            <p className="text-3xl font-bold text-white leading-none">
              {averageRating?.toFixed(1) ?? "—"}
            </p>
            <StarRating value={averageRating ?? 0} />
          </div>
          <div>
            <p className="text-xs text-gray-500">
              {totalReviews ?? reviews.length} review
              {(totalReviews ?? reviews.length) !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Review list */}
      <div className="divide-y divide-white/5">
        {reviews.slice(0, visibleCount).map((review, i) => (
          <div key={review._id ?? i} className="p-4 md:p-5">
            {/* Reviewer row */}
            <div className="flex items-start gap-3 mb-2">
              {/* Avatar */}
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg,
                    hsl(${(i * 67 + 200) % 360}, 60%, 35%),
                    hsl(${(i * 67 + 260) % 360}, 60%, 25%))`,
                }}
              >
                {(review.userName ?? review.user ?? "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <p className="text-sm font-semibold text-white truncate">
                    {review.userName ?? review.user ?? "Anonymous"}
                  </p>
                  {review.verified && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-md font-medium"
                      style={{
                        background: "rgba(16,185,129,0.15)",
                        color: "#34d399",
                      }}
                    >
                      ✓ Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <StarRating value={review.rating ?? 0} />
                  {review.date && (
                    <p className="text-xs text-gray-600">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Review text */}
            {review.comment && (
              <p className="text-sm text-gray-400 leading-relaxed pl-11">
                {review.comment}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Load more */}
      {visibleCount < reviews.length && (
        <div
          className="p-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <button
            onClick={() => setVisibleCount((c) => c + 5)}
            className="w-full py-2.5 rounded-xl text-sm font-medium transition active:scale-95"
            style={{
              background: "rgba(99,57,255,0.1)",
              color: "#a78bfa",
              border: "1px solid rgba(99,57,255,0.2)",
            }}
          >
            Load more ({reviews.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}

export default ReviewsPanel;
