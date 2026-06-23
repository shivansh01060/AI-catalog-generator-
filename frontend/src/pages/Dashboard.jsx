import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import API from "../config/api";

function StatCard({ label, value, sub, color, icon, delay }) {
  return (
    <div
      className="card-3d glass rounded-2xl p-4 md:p-6 glow-border"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div
          className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-lg md:text-xl"
          style={{ background: `${color}20` }}
        >
          {icon}
        </div>
        <span className="text-xs text-gray-500 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div
        className="font-display text-2xl md:text-3xl font-bold mb-1"
        style={{ color }}
      >
        {value}
      </div>
      <div className="text-xs text-gray-500">{sub}</div>
    </div>
  );
}

function ProgressBar({ label, value, max, color }) {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs mb-2">
        <span className="text-gray-400">{label}</span>
        <span style={{ color }}>{value.toLocaleString()}</span>
      </div>
      <div
        className="h-2 rounded-full"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <div
          className="h-2 rounded-full transition-all duration-1000"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}, ${color}80)`,
          }}
        />
      </div>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API}/api/products/stats`)
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const timeSavedHours = stats ? Math.round(stats.timeSavedMinutes / 60) : 0;

  return (
    <div className="mesh-bg min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-8 md:mb-12 pt-4">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs text-gray-400 mb-4 md:mb-6 glow-border">
            <span
              className="w-2 h-2 rounded-full bg-green-400"
              style={{ animation: "pulse 2s infinite" }}
            ></span>
            All systems operational
          </div>
          <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 shimmer-text">
            Business Management Portal
          </h1>
          <p className="text-gray-400 text-sm md:text-lg max-w-xl mx-auto px-4">
            Manage your AI-powered product catalog with real-time insights and
            analytics
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading your dashboard...</p>
          </div>
        ) : (
          <>
            {/* Main Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
              <StatCard
                label="Total Products"
                value={stats?.totalProducts.toLocaleString()}
                sub="From Your Catalog"
                color="#3b82f6"
                icon="📦"
                delay={0}
              />
              <StatCard
                label="AI Descriptions"
                value={stats?.withDescriptions.toLocaleString()}
                sub={`${stats?.descriptionCoverage}% coverage`}
                color="#10b981"
                icon="🤖"
                delay={0.1}
              />
              <StatCard
                label="Categories"
                value={stats?.totalCategories.toLocaleString()}
                sub="Unique categories"
                color="#f59e0b"
                icon="📂"
                delay={0.2}
              />
              <StatCard
                label="Brands"
                value={stats?.totalBrands.toLocaleString()}
                sub="Unique brands"
                color="#8b5cf6"
                icon="🏢"
                delay={0.3}
              />
            </div>

            {/* Second row */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
              <StatCard
                label="Avg Price"
                value={`₹${stats?.avgPrice.toLocaleString()}`}
                sub={`Range: ₹${stats?.minPrice} - ₹${stats?.maxPrice.toLocaleString()}`}
                color="#10b981"
                icon="💰"
                delay={0.4}
              />
              <StatCard
                label="Time Saved"
                value={`${timeSavedHours}hrs`}
                sub="vs manual writing"
                color="#60a5fa"
                icon="⚡"
                delay={0.5}
              />
              <StatCard
                label="Accuracy"
                value="94%"
                sub="Recommendation precision"
                color="#f59e0b"
                icon="🎯"
                delay={0.6}
              />
            </div>

            {/* Progress + Features row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
              {/* Catalog Coverage */}
              <div className="glass rounded-2xl p-4 md:p-6 glow-border">
                <h3 className="font-display font-bold text-white mb-4 md:mb-6">
                  📊 Catalog Coverage
                </h3>
                <ProgressBar
                  label="Products with AI descriptions"
                  value={stats?.withDescriptions}
                  max={stats?.totalProducts}
                  color="#3b82f6"
                />
                <ProgressBar
                  label="Products without descriptions"
                  value={stats?.withoutDescriptions}
                  max={stats?.totalProducts}
                  color="#ef4444"
                />
                <ProgressBar
                  label="Total catalog utilization"
                  value={stats?.totalProducts}
                  max={20000}
                  color="#10b981"
                />
              </div>

              {/* Performance Metrics */}
              <div className="glass rounded-2xl p-4 md:p-6 glow-border">
                <h3 className="font-display font-bold text-white mb-4 md:mb-6">
                  ⚡ Performance Metrics
                </h3>
                <div className="space-y-3">
                  {[
                    {
                      label: "AI Description Speed",
                      ai: "~2 sec",
                      manual: "15-20 min",
                      color: "#3b82f6",
                    },
                    {
                      label: "Recommendation Engine",
                      ai: "Real-time",
                      manual: "Manual research",
                      color: "#10b981",
                    },
                    {
                      label: "Catalog Generation",
                      ai: "Instant",
                      manual: "Hours",
                      color: "#60a5fa",
                    },
                  ].map((m, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.03)" }}
                    >
                      <span className="text-xs text-gray-400">{m.label}</span>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ background: `${m.color}20`, color: m.color }}
                        >
                          AI: {m.ai}
                        </span>
                        <span
                          className="text-xs px-2 py-1 rounded-full"
                          style={{
                            background: "rgba(255,255,255,0.05)",
                            color: "#6b7280",
                          }}
                        >
                          Manual: {m.manual}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass rounded-2xl p-4 md:p-6 glow-border">
              <h3 className="font-display font-bold text-white mb-4">
                🚀 Quick Actions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                <Link
                  to="/products/add"
                  className="btn-neon text-white py-3 px-4 rounded-xl text-sm font-medium text-center"
                >
                  ✦ Add New Product
                </Link>
                <Link
                  to="/products/catalog"
                  className="py-3 px-4 rounded-xl text-sm font-medium text-center transition"
                  style={{
                    background: "rgba(59,130,246,0.15)",
                    color: "#60a5fa",
                    border: "1px solid rgba(59,130,246,0.3)",
                  }}
                >
                  ◈ View Catalog
                </Link>
                <Link
                  to="/reports"
                  className="py-3 px-4 rounded-xl text-sm font-medium text-center transition"
                  style={{
                    background: "rgba(16,185,129,0.15)",
                    color: "#10b981",
                    border: "1px solid rgba(16,185,129,0.3)",
                  }}
                >
                  📊 View Reports
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
