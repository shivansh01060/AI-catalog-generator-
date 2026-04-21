function RecommendationsPopup({
  aiRecommendations,
  recommendations,
  productName,
  onClose,
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50"
        style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      />
      {/* Flex centering wrapper */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ pointerEvents: "none" }}
      >
        {/* Popup */}
        <div
          className="glass rounded-3xl p-8"
          style={{
            width: "100%",
            maxWidth: "680px",
            maxHeight: "85vh",
            overflowX: "hidden",
            overflowY: "auto",
            border: "1px solid rgba(99,57,255,0.4)",
            boxShadow: "0 0 80px rgba(99,57,255,0.3)",
            animation: "popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
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
          <div className="flex items-start justify-between mb-6">
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-2"
                style={{ background: "rgba(99,57,255,0.2)", color: "#a78bfa" }}
              >
                🎯 Smart Recommendations
              </div>
              <h2 className="font-display font-bold text-white text-xl">
                Similar to "{productName?.substring(0, 35)}"
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              ✕
            </button>
          </div>

          {/* Section 1 — AI Suggestions */}
          {aiRecommendations?.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: "#a78bfa" }}
                >
                  🤖 AI Suggested
                </span>
                <span className="text-xs text-gray-500">
                  — Works for any product
                </span>
              </div>

              <div className="space-y-2">
                {aiRecommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-2xl"
                    style={{
                      background: "rgba(99,57,255,0.06)",
                      border: "1px solid rgba(99,57,255,0.15)",
                      animation: `popIn 0.3s ease ${i * 0.06}s both`,
                    }}
                  >
                    {/* Rank */}
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{
                        background: "rgba(99,57,255,0.25)",
                        color: "#a78bfa",
                      }}
                    >
                      {i + 1}
                    </div>

                    {/* Avatar */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold"
                      style={{
                        background: `linear-gradient(135deg,
                          hsl(${(i * 55 + 200) % 360}, 70%, 35%),
                          hsl(${(i * 55 + 260) % 360}, 70%, 25%))`,
                      }}
                    >
                      {rec.name?.charAt(0)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm line-clamp-1">
                        {rec.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {rec.brand}
                      </p>
                      <p className="text-xs mt-1" style={{ color: "#a78bfa" }}>
                        💡 {rec.reason}
                      </p>
                    </div>

                    {/* Price + Score */}
                    <div className="text-right flex-shrink-0">
                      <p
                        className="font-bold text-sm"
                        style={{ color: "#00c8ff" }}
                      >
                        ₹{rec.estimatedPrice?.toLocaleString()}
                      </p>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
                        style={{
                          background: "rgba(99,57,255,0.2)",
                          color: "#a78bfa",
                        }}
                      >
                        {rec.matchScore}% match
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Divider */}
          {recommendations?.length > 0 && (
            <div className="flex items-center gap-3 my-4">
              <div
                className="flex-1 h-px"
                style={{ background: "rgba(255,255,255,0.06)" }}
              />
              <span className="text-xs text-gray-500">From your catalog</span>
              <div
                className="flex-1 h-px"
                style={{ background: "rgba(255,255,255,0.06)" }}
              />
            </div>
          )}

          {/* Section 2 — Dataset Matches */}
          {recommendations?.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: "#00c8ff" }}
                >
                  ◈ Catalog Matches
                </span>
                <span className="text-xs text-gray-500">
                  — From your 19k products
                </span>
              </div>

              <div className="space-y-2">
                {recommendations.map((rec, i) => (
                  <div
                    key={rec._id}
                    className="flex items-center gap-4 p-4 rounded-2xl"
                    style={{
                      background: "rgba(0,200,255,0.04)",
                      border: "1px solid rgba(0,200,255,0.1)",
                      animation: `popIn 0.3s ease ${i * 0.06}s both`,
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{
                        background: "rgba(0,200,255,0.15)",
                        color: "#00c8ff",
                      }}
                    >
                      {i + 1}
                    </div>

                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold"
                      style={{
                        background: `linear-gradient(135deg,
                          hsl(${(i * 45 + 180) % 360}, 60%, 30%),
                          hsl(${(i * 45 + 220) % 360}, 60%, 20%))`,
                      }}
                    >
                      {rec.name?.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm line-clamp-1">
                        {rec.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {rec.brand} • {rec.category?.substring(0, 20)}
                      </p>
                      {rec.description && (
                        <p className="text-xs mt-1 text-gray-600 line-clamp-1">
                          {rec.description}
                        </p>
                      )}
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p
                        className="font-bold text-sm"
                        style={{ color: "#00c8ff" }}
                      >
                        ₹{rec.price?.toLocaleString()}
                      </p>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
                        style={{
                          background: "rgba(16,185,129,0.15)",
                          color: "#34d399",
                        }}
                      >
                        {rec.similarityScore}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div
            className="pt-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
          >
            <p className="text-xs text-gray-500 text-center mb-3">
              🤖 AI suggestions • ◈ Cosine similarity matching
            </p>
            <button
              onClick={onClose}
              className="btn-neon w-full text-white py-3 rounded-xl font-medium text-sm"
            >
              Got it ✓
            </button>
          </div>
        </div>{" "}
        {/* closes popup */}
      </div>{" "}
      {/* closes flex wrapper */}
    </>
  );
}

export default RecommendationsPopup;
