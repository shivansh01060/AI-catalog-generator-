import { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  RadialBarChart,
  RadialBar,
} from "recharts";

const API = "http://localhost:5000";

const COLORS = [
  "#6339ff",
  "#00c8ff",
  "#ff3c78",
  "#f59e0b",
  "#10b981",
  "#a78bfa",
  "#34d399",
  "#fb923c",
  "#38bdf8",
  "#f472b6",
];

// Custom tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="glass rounded-xl p-3"
        style={{ border: "1px solid rgba(99,57,255,0.3)", minWidth: "140px" }}
      >
        <p className="text-xs text-gray-400 mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p
            key={i}
            className="text-sm font-bold"
            style={{ color: entry.color }}
          >
            {entry.name}:{" "}
            {typeof entry.value === "number"
              ? entry.value.toLocaleString()
              : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div className="card-3d glass rounded-2xl p-5 glow-border">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ background: `${color}20` }}
        >
          {icon}
        </div>
        <span className="text-xs text-gray-500 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="font-display text-3xl font-bold mb-1" style={{ color }}>
        {value}
      </div>
      <div className="text-xs text-gray-500">{sub}</div>
    </div>
  );
}

function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState("categories");

  useEffect(() => {
    axios
      .get(`${API}/api/products/analytics`)
      .then((res) => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const chartTabs = [
    { id: "categories", label: "Categories", icon: "📦" },
    { id: "brands", label: "Top Brands", icon: "🏷️" },
    { id: "price", label: "Price Range", icon: "💰" },
    { id: "coverage", label: "AI Coverage", icon: "🤖" },
  ];

  if (loading) {
    return (
      <div className="mesh-bg min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mesh-bg min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold shimmer-text mb-2">
            Analytics
          </h1>
          <p className="text-gray-400">
            Real-time insights from your product catalog
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Total Products"
            value={data?.summary.total.toLocaleString()}
            sub="In database"
            color="#6339ff"
            icon="◈"
          />
          <StatCard
            label="AI Descriptions"
            value={data?.summary.withDesc.toLocaleString()}
            sub={`${data?.summary.coverage}% coverage`}
            color="#00c8ff"
            icon="🤖"
          />
          <StatCard
            label="Without Desc"
            value={data?.summary.withoutDesc.toLocaleString()}
            sub="Needs generation"
            color="#ff3c78"
            icon="⚠️"
          />
          <StatCard
            label="Coverage"
            value={`${data?.summary.coverage}%`}
            sub="AI description rate"
            color="#10b981"
            icon="📊"
          />
        </div>

        {/* Chart Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {chartTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveChart(tab.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={
                activeChart === tab.id
                  ? {
                      background:
                        "linear-gradient(135deg, rgba(99,57,255,0.4), rgba(0,200,255,0.2))",
                      color: "white",
                      border: "1px solid rgba(99,57,255,0.4)",
                    }
                  : {
                      background: "rgba(255,255,255,0.04)",
                      color: "#9ca3af",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }
              }
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Charts */}
        <div className="glass rounded-3xl p-6 glow-border mb-6">
          {/* Categories Bar Chart */}
          {activeChart === "categories" && (
            <div>
              <h2 className="font-display font-bold text-white text-xl mb-1">
                Top 10 Categories
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Product count by category
              </p>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={data?.categoryData}
                  margin={{ top: 5, right: 20, left: 20, bottom: 60 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#9ca3af", fontSize: 11 }}
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Products" radius={[6, 6, 0, 0]}>
                    {data?.categoryData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Brands Bar Chart */}
          {activeChart === "brands" && (
            <div>
              <h2 className="font-display font-bold text-white text-xl mb-1">
                Top 10 Brands
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Most listed brands in catalog
              </p>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={data?.brandData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.05)"
                  />
                  <XAxis
                    type="number"
                    tick={{ fill: "#9ca3af", fontSize: 11 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: "#9ca3af", fontSize: 11 }}
                    width={80}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Products" radius={[0, 6, 6, 0]}>
                    {data?.brandData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Price Distribution */}
          {activeChart === "price" && (
            <div>
              <h2 className="font-display font-bold text-white text-xl mb-1">
                Price Distribution
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                How products are distributed across price ranges
              </p>
              <div className="grid grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={data?.priceData}
                    margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.05)"
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#9ca3af", fontSize: 10 }}
                      angle={-20}
                      textAnchor="end"
                    />
                    <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Products" radius={[6, 6, 0, 0]}>
                      {data?.priceData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data?.priceData.filter((d) => d.count > 0)}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={110}
                      paddingAngle={3}
                      dataKey="count"
                      nameKey="name"
                    >
                      {data?.priceData
                        .filter((d) => d.count > 0)
                        .map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      formatter={(value) => (
                        <span style={{ color: "#9ca3af", fontSize: "11px" }}>
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* AI Coverage Line Chart */}
          {activeChart === "coverage" && (
            <div>
              <h2 className="font-display font-bold text-white text-xl mb-1">
                AI Description Coverage
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Products vs AI descriptions over time
              </p>
              {data?.coverageData.length > 1 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart
                    data={data?.coverageData}
                    margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.05)"
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: "#9ca3af", fontSize: 10 }}
                    />
                    <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      formatter={(value) => (
                        <span style={{ color: "#9ca3af", fontSize: "12px" }}>
                          {value}
                        </span>
                      )}
                    />
                    <Line
                      type="monotone"
                      dataKey="total"
                      name="Total Products"
                      stroke="#6339ff"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="withDesc"
                      name="With AI Desc"
                      stroke="#00c8ff"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                // Fallback: show coverage as radial chart
                <div className="flex items-center justify-center gap-12">
                  <ResponsiveContainer width="50%" height={300}>
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="30%"
                      outerRadius="90%"
                      data={[
                        {
                          name: "With AI Desc",
                          value: data?.summary.coverage,
                          fill: "#6339ff",
                        },
                        {
                          name: "Without Desc",
                          value: 100 - data?.summary.coverage,
                          fill: "#ff3c78",
                        },
                      ]}
                    >
                      <RadialBar dataKey="value" cornerRadius={6} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        formatter={(value) => (
                          <span style={{ color: "#9ca3af", fontSize: "12px" }}>
                            {value}
                          </span>
                        )}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>

                  <div className="text-center">
                    <p className="font-display text-6xl font-bold shimmer-text">
                      {data?.summary.coverage}%
                    </p>
                    <p className="text-gray-400 mt-2">Coverage Rate</p>
                    <p className="text-gray-600 text-sm mt-1">
                      {data?.summary.withDesc.toLocaleString()} of{" "}
                      {data?.summary.total.toLocaleString()} products
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom two cards */}
        <div className="grid grid-cols-2 gap-6">
          {/* Category avg price */}
          <div className="glass rounded-2xl p-6 glow-border">
            <h3 className="font-display font-bold text-white mb-4">
              💰 Avg Price by Category
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={data?.categoryData.slice(0, 6)}
                margin={{ top: 5, right: 10, left: 10, bottom: 40 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.05)"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#9ca3af", fontSize: 9 }}
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fill: "#9ca3af", fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="avgPrice"
                  name="Avg Price (₹)"
                  radius={[4, 4, 0, 0]}
                  fill="#f59e0b"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick stats */}
          <div className="glass rounded-2xl p-6 glow-border">
            <h3 className="font-display font-bold text-white mb-4">
              ⚡ Quick Stats
            </h3>
            <div className="space-y-3">
              {[
                {
                  label: "Most listed brand",
                  value: data?.brandData[0]?.name || "—",
                  sub: `${data?.brandData[0]?.count} products`,
                  color: "#6339ff",
                },
                {
                  label: "Biggest category",
                  value: data?.categoryData[0]?.name?.substring(0, 20) || "—",
                  sub: `${data?.categoryData[0]?.count} products`,
                  color: "#00c8ff",
                },
                {
                  label: "Most common price range",
                  value:
                    [...(data?.priceData || [])].sort(
                      (a, b) => b.count - a.count,
                    )[0]?.name || "—",
                  sub: `${[...(data?.priceData || [])].sort((a, b) => b.count - a.count)[0]?.count?.toLocaleString()} products`,
                  color: "#ff3c78",
                },
                {
                  label: "AI description rate",
                  value: `${data?.summary.coverage}%`,
                  sub: `${data?.summary.withDesc} generated`,
                  color: "#10b981",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                >
                  <div>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                    <p className="text-sm font-bold text-white mt-0.5">
                      {stat.value}
                    </p>
                  </div>
                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{ background: `${stat.color}20`, color: stat.color }}
                  >
                    {stat.sub}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
