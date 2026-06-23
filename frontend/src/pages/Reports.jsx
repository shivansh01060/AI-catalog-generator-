import { useState, useEffect } from "react";
import axios from "axios";
import API from "../config/api";

function ReportCard({ title, value, change, icon, color }) {
  return (
    <div className="glass rounded-2xl p-6 glow-border">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
          <p className="font-display text-3xl font-bold text-white">{value}</p>
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
          style={{ background: `${color}15` }}
        >
          {icon}
        </div>
      </div>
      {change && (
        <div
          className="inline-block px-3 py-1 rounded-lg text-xs font-medium"
          style={{
            background:
              change.includes("+") || change.includes("↑")
                ? "rgba(16, 185, 129, 0.1)"
                : "rgba(239, 68, 68, 0.1)",
            color:
              change.includes("+") || change.includes("↑")
                ? "#10b981"
                : "#ef4444",
          }}
        >
          {change}
        </div>
      )}
    </div>
  );
}

function Reports() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");

  useEffect(() => {
    axios
      .get(`${API}/api/products/stats`)
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mesh-bg min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-1">
                📊 Reports & Analytics
              </h1>
              <p className="text-gray-400 text-sm md:text-base">
                Comprehensive insights into your product catalog
              </p>
            </div>
            <div className="flex gap-2">
              {["week", "month", "year"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${
                    timeRange === range
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                  style={
                    timeRange === range
                      ? {
                          background:
                            "linear-gradient(135deg, rgba(30,64,175,0.5), rgba(59,130,246,0.3))",
                          border: "1px solid rgba(59, 130, 246, 0.3)",
                        }
                      : { background: "rgba(255,255,255,0.04)" }
                  }
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading reports...</p>
          </div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <ReportCard
                title="Total Products"
                value={stats?.totalProducts || 0}
                change="+12% this month"
                icon="📦"
                color="#3b82f6"
              />
              <ReportCard
                title="AI Descriptions"
                value={stats?.withDescriptions || 0}
                change={`${stats?.descriptionCoverage || 0}% coverage`}
                color="#10b981"
              />
              <ReportCard
                title="Revenue Generated"
                value={`₹${(stats?.totalProducts * 5000).toLocaleString()}`}
                change="+8.5% vs last period"
                icon="💰"
                color="#f59e0b"
              />
              <ReportCard
                title="Processing Speed"
                value="2.3s"
                change="↑ 15% faster"
                icon="⚡"
                color="#8b5cf6"
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Category Distribution */}
              <div className="glass rounded-2xl p-6 glow-border">
                <h3 className="font-display font-bold text-white mb-6">
                  📈 Category Distribution
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      name: "Electronics",
                      count: 245,
                      pct: 35,
                      color: "#3b82f6",
                    },
                    { name: "Fashion", count: 189, pct: 27, color: "#8b5cf6" },
                    {
                      name: "Home & Garden",
                      count: 156,
                      pct: 22,
                      color: "#10b981",
                    },
                    {
                      name: "Sports & Outdoors",
                      count: 110,
                      pct: 16,
                      color: "#f59e0b",
                    },
                  ].map((cat, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-300">
                          {cat.name}
                        </span>
                        <span className="text-sm font-bold text-white">
                          {cat.count}
                        </span>
                      </div>
                      <div
                        className="h-2 rounded-full"
                        style={{ background: "rgba(255,255,255,0.05)" }}
                      >
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${cat.pct}%`,
                            background: cat.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="glass rounded-2xl p-6 glow-border">
                <h3 className="font-display font-bold text-white mb-6">
                  🎯 Performance Metrics
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      metric: "Description Accuracy",
                      value: 94,
                      target: 95,
                    },
                    { metric: "Recommendation Match", value: 89, target: 90 },
                    { metric: "User Satisfaction", value: 92, target: 95 },
                    { metric: "System Uptime", value: 99.8, target: 99.9 },
                  ].map((perf, i) => (
                    <div key={i}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-300">
                          {perf.metric}
                        </span>
                        <span className="text-sm font-bold text-white">
                          {perf.value}%
                        </span>
                      </div>
                      <div
                        className="h-2 rounded-full"
                        style={{ background: "rgba(255,255,255,0.05)" }}
                      >
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${perf.value}%`,
                            background:
                              perf.value >= perf.target ? "#10b981" : "#f59e0b",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Export Section */}
            <div className="glass rounded-2xl p-6 glow-border">
              <h3 className="font-display font-bold text-white mb-4">
                📥 Export Reports
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button className="px-4 py-3 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-300 hover:bg-blue-600/30 transition text-sm font-medium">
                  📄 Download PDF
                </button>
                <button className="px-4 py-3 rounded-xl bg-green-600/20 border border-green-500/30 text-green-300 hover:bg-green-600/30 transition text-sm font-medium">
                  📊 Export to Excel
                </button>
                <button className="px-4 py-3 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30 transition text-sm font-medium">
                  📧 Email Report
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Reports;
