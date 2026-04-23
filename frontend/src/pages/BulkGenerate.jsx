import { useState, useEffect, useRef } from "react";
import axios from "axios";

import API from "../config/api";

function BulkGenerate() {
  const [products, setProducts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [results, setResults] = useState([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [limit, setLimit] = useState(10);
  const [mode, setMode] = useState("auto"); // auto | manual
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);
  const resultsRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Auto scroll to latest result
  useEffect(() => {
    if (resultsRef.current) {
      resultsRef.current.scrollTop = resultsRef.current.scrollHeight;
    }
  }, [results]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${API}/api/products/search?limit=50&sortBy=newest`,
      );
      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const selectAll = () => {
    const withoutDesc = filtered
      .filter((p) => !p.description)
      .map((p) => p._id);
    setSelectedIds(withoutDesc);
  };

  const clearAll = () => setSelectedIds([]);

  const handleStart = async () => {
    setRunning(true);
    setDone(false);
    setResults([]);
    setProgress(0);

    const body =
      mode === "manual" && selectedIds.length > 0
        ? { productIds: selectedIds }
        : { limit };

    const totalCount = mode === "manual" ? selectedIds.length : limit;
    setTotal(totalCount);

    try {
      const response = await fetch(`${API}/api/generate-description/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop(); // keep incomplete line

        for (const line of lines) {
          if (line.trim()) {
            try {
              const result = JSON.parse(line);
              setResults((prev) => [...prev, result]);
              setProgress((prev) => prev + 1);
            } catch (e) {
              // skip malformed lines
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRunning(false);
      setDone(true);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const withoutDesc = products.filter((p) => !p.description).length;
  const progressPct = total > 0 ? Math.round((progress / total) * 100) : 0;

  return (
    <div className="mesh-bg min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold shimmer-text mb-2">
            Bulk AI Generator
          </h1>
          <p className="text-gray-400">
            Generate AI descriptions for multiple products at once
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Left — Controls */}
          <div className="space-y-4">
            {/* Stats */}
            <div className="glass rounded-2xl p-5 glow-border">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p
                    className="font-display text-3xl font-bold"
                    style={{ color: "#ff3c78" }}
                  >
                    {withoutDesc}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Need descriptions
                  </p>
                </div>
                <div className="text-center">
                  <p
                    className="font-display text-3xl font-bold"
                    style={{ color: "#10b981" }}
                  >
                    {products.length - withoutDesc}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Already done</p>
                </div>
              </div>
            </div>

            {/* Mode selector */}
            <div className="glass rounded-2xl p-5 glow-border">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Generation Mode
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    id: "auto",
                    label: "Auto Select",
                    icon: "⚡",
                    desc: "Picks products without descriptions",
                  },
                  {
                    id: "manual",
                    label: "Manual Select",
                    icon: "✋",
                    desc: "You choose which products",
                  },
                ].map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className="cursor-pointer rounded-xl p-3 transition-all"
                    style={
                      mode === m.id
                        ? {
                            background: "rgba(99,57,255,0.2)",
                            border: "2px solid rgba(99,57,255,0.5)",
                          }
                        : {
                            background: "rgba(255,255,255,0.03)",
                            border: "2px solid rgba(255,255,255,0.06)",
                          }
                    }
                  >
                    <p className="text-lg mb-1">{m.icon}</p>
                    <p className="text-sm font-bold text-white">{m.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{m.desc}</p>
                    {mode === m.id && (
                      <p
                        className="text-xs font-bold mt-1"
                        style={{ color: "#a78bfa" }}
                      >
                        ✓ Active
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Auto mode — limit slider */}
            {mode === "auto" && (
              <div className="glass rounded-2xl p-5 glow-border">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    How many products?
                  </p>
                  <span
                    className="font-display font-bold text-2xl"
                    style={{ color: "#6339ff" }}
                  >
                    {limit}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={limit}
                  onChange={(e) => setLimit(parseInt(e.target.value))}
                  className="w-full accent-purple-500"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>1</span>
                  <span>50</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  ⏱ Est. time: ~{Math.ceil(limit * 1.5)} seconds
                </p>
              </div>
            )}

            {/* Manual mode — product selector */}
            {mode === "manual" && (
              <div className="glass rounded-2xl p-5 glow-border">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Select Products ({selectedIds.length} selected)
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={selectAll}
                      className="text-xs px-2 py-1 rounded-lg transition"
                      style={{
                        background: "rgba(99,57,255,0.2)",
                        color: "#a78bfa",
                      }}
                    >
                      Select All
                    </button>
                    <button
                      onClick={clearAll}
                      className="text-xs px-2 py-1 rounded-lg transition"
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        color: "#9ca3af",
                      }}
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Search */}
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="input-dark w-full rounded-xl px-3 py-2 text-xs mb-3"
                />

                {/* Product list */}
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {loading ? (
                    <p className="text-gray-500 text-xs text-center py-4">
                      Loading...
                    </p>
                  ) : (
                    filtered.map((product) => (
                      <div
                        key={product._id}
                        onClick={() => toggleSelect(product._id)}
                        className="flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all"
                        style={{
                          background: selectedIds.includes(product._id)
                            ? "rgba(99,57,255,0.15)"
                            : "rgba(255,255,255,0.02)",
                          border: selectedIds.includes(product._id)
                            ? "1px solid rgba(99,57,255,0.3)"
                            : "1px solid transparent",
                        }}
                      >
                        {/* Checkbox */}
                        <div
                          className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                          style={{
                            background: selectedIds.includes(product._id)
                              ? "#6339ff"
                              : "rgba(255,255,255,0.1)",
                            border: "1px solid rgba(99,57,255,0.4)",
                          }}
                        >
                          {selectedIds.includes(product._id) && (
                            <span className="text-white text-xs">✓</span>
                          )}
                        </div>

                        {/* Product info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {product.brand}
                          </p>
                        </div>

                        {/* Status */}
                        {product.description ? (
                          <span
                            className="text-xs px-1.5 py-0.5 rounded-full flex-shrink-0"
                            style={{
                              background: "rgba(16,185,129,0.15)",
                              color: "#34d399",
                            }}
                          >
                            ✓
                          </span>
                        ) : (
                          <span
                            className="text-xs px-1.5 py-0.5 rounded-full flex-shrink-0"
                            style={{
                              background: "rgba(255,60,120,0.15)",
                              color: "#ff3c78",
                            }}
                          >
                            —
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Start button */}
            <button
              onClick={handleStart}
              disabled={
                running || (mode === "manual" && selectedIds.length === 0)
              }
              className="btn-neon w-full text-white py-4 rounded-2xl font-bold text-base disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {running ? (
                <>
                  <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Generating... ({progress}/{total})
                </>
              ) : (
                <>
                  🤖 Start Bulk Generation
                  {mode === "auto"
                    ? ` (${limit} products)`
                    : ` (${selectedIds.length} selected)`}
                </>
              )}
            </button>
          </div>

          {/* Right — Live Results */}
          <div
            className="glass rounded-2xl p-5 glow-border flex flex-col"
            style={{ minHeight: "500px" }}
          >
            {/* Results header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-white">
                Live Results
              </h3>
              {running && (
                <span
                  className="flex items-center gap-2 text-xs"
                  style={{ color: "#a78bfa" }}
                >
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  Generating...
                </span>
              )}
              {done && (
                <span
                  className="text-xs font-bold"
                  style={{ color: "#10b981" }}
                >
                  ✅ Complete!
                </span>
              )}
            </div>

            {/* Progress bar */}
            {(running || done) && total > 0 && (
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>
                    {progress} of {total} generated
                  </span>
                  <span>{progressPct}%</span>
                </div>
                <div
                  className="h-2 rounded-full"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${progressPct}%`,
                      background: "linear-gradient(90deg, #6339ff, #00c8ff)",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Results stream */}
            <div
              ref={resultsRef}
              className="flex-1 space-y-3 overflow-y-auto"
              style={{ maxHeight: "400px" }}
            >
              {results.length === 0 && !running && (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <p className="text-4xl mb-3">🤖</p>
                  <p className="text-gray-400 text-sm">
                    Results will appear here as they generate
                  </p>
                  <p className="text-gray-600 text-xs mt-1">
                    Each description streams in one by one
                  </p>
                </div>
              )}

              {results.map((result, i) => (
                <div
                  key={result._id}
                  className="rounded-2xl p-4"
                  style={{
                    background: result.success
                      ? "rgba(16,185,129,0.06)"
                      : "rgba(239,68,68,0.06)",
                    border: result.success
                      ? "1px solid rgba(16,185,129,0.2)"
                      : "1px solid rgba(239,68,68,0.2)",
                    animation: "slideIn 0.3s ease",
                  }}
                >
                  <style>{`
                    @keyframes slideIn {
                      from { transform: translateY(10px); opacity: 0; }
                      to { transform: translateY(0); opacity: 1; }
                    }
                  `}</style>

                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-sm font-bold text-white line-clamp-1">
                      {result.name}
                    </p>
                    {result.success ? (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{
                          background: "rgba(16,185,129,0.2)",
                          color: "#34d399",
                        }}
                      >
                        ✓ Done
                      </span>
                    ) : (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{
                          background: "rgba(239,68,68,0.2)",
                          color: "#f87171",
                        }}
                      >
                        ✗ Failed
                      </span>
                    )}
                  </div>

                  {result.success ? (
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                      {result.description}
                    </p>
                  ) : (
                    <p className="text-xs" style={{ color: "#f87171" }}>
                      {result.error || "Generation failed"}
                    </p>
                  )}
                </div>
              ))}

              {/* Loading indicator for next item */}
              {running && (
                <div
                  className="rounded-2xl p-4 flex items-center gap-3"
                  style={{
                    background: "rgba(99,57,255,0.06)",
                    border: "1px solid rgba(99,57,255,0.15)",
                  }}
                >
                  <div className="w-4 h-4 rounded-full border-2 border-purple-400 border-t-transparent animate-spin flex-shrink-0" />
                  <p className="text-xs text-gray-400">
                    Generating next description...
                  </p>
                </div>
              )}
            </div>

            {/* Summary */}
            {done && results.length > 0 && (
              <div
                className="mt-4 pt-4"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p
                      className="font-bold text-lg"
                      style={{ color: "#10b981" }}
                    >
                      {results.filter((r) => r.success).length}
                    </p>
                    <p className="text-xs text-gray-500">Successful</p>
                  </div>
                  <div>
                    <p
                      className="font-bold text-lg"
                      style={{ color: "#f87171" }}
                    >
                      {results.filter((r) => !r.success).length}
                    </p>
                    <p className="text-xs text-gray-500">Failed</p>
                  </div>
                  <div>
                    <p
                      className="font-bold text-lg"
                      style={{ color: "#00c8ff" }}
                    >
                      {results.length}
                    </p>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BulkGenerate;
