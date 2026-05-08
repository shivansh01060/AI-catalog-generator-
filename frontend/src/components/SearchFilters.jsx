import { useState, useEffect } from "react";
import axios from "axios";
import API from "../config/api";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "name_asc", label: "Name: A → Z" },
];

function SearchFilters({ filters, onChange, primary, isDark, textColor }) {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    axios
      .get(`${API}/api/products/filters`)
      .then((res) => {
        setBrands(res.data.brands || []);
        setCategories(res.data.categories || []);
      })
      .catch(console.error);
  }, []);

  const activeCount = Object.values(filters).filter(
    (v) => v && v !== "newest" && v !== "0" && v !== "1000000",
  ).length;

  const inputStyle = {
    background: `${primary}10`,
    border: `1px solid ${primary}25`,
    color: isDark ? "white" : textColor,
    outline: "none",
    borderRadius: "12px",
    padding: "10px 12px",
    fontSize: "14px",
    width: "100%",
    WebkitAppearance: "none",
  };

  const labelStyle = {
    fontSize: "11px",
    fontWeight: "600",
    color: isDark ? "#9ca3af" : `${textColor}80`,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "6px",
    display: "block",
  };

  const handleReset = (e) => {
    e.stopPropagation();
    onChange({
      q: "",
      minPrice: 0,
      maxPrice: 1000000,
      brand: "all",
      category: "all",
      hasDesc: false,
      sortBy: "newest",
    });
  };

  return (
    <div
      className="rounded-2xl mb-5 md:mb-6 overflow-hidden transition-all"
      style={{
        background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
        border: `1px solid ${primary}20`,
      }}
    >
      {/* Toggle Header */}
      <div
        className="flex items-center justify-between p-3 md:p-4 cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <span
            className="text-sm font-bold truncate"
            style={{ color: isDark ? "white" : textColor }}
          >
            🔍 Advanced Filters
          </span>
          {activeCount > 0 && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0"
              style={{ background: primary, color: "white" }}
            >
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleReset}
            className="text-xs px-2.5 py-1 rounded-lg transition active:scale-95"
            style={{ background: `${primary}15`, color: primary }}
          >
            Reset
          </button>
          <span style={{ color: primary, fontSize: "16px", lineHeight: 1 }}>
            {expanded ? "▲" : "▼"}
          </span>
        </div>
      </div>

      {/* Filters Panel */}
      {expanded && (
        <div
          className="px-3 md:px-4 pb-4"
          style={{ borderTop: `1px solid ${primary}15` }}
        >
          {/* Row 1: Search (full width) + Sort */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-3">
            <div className="sm:col-span-2">
              <label style={labelStyle}>Search</label>
              <input
                value={filters.q}
                onChange={(e) => onChange({ ...filters, q: e.target.value })}
                placeholder="Name, brand, category..."
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  onChange({ ...filters, sortBy: e.target.value })
                }
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    style={{ background: "#1a1a2e" }}
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* AI Description toggle */}
            <div>
              <label style={labelStyle}>AI Description</label>
              <div
                className="flex items-center gap-3 rounded-xl cursor-pointer transition active:scale-95"
                style={{
                  background: filters.hasDesc ? `${primary}20` : `${primary}08`,
                  border: `1px solid ${
                    filters.hasDesc ? primary : primary + "20"
                  }`,
                  padding: "10px 12px",
                }}
                onClick={() =>
                  onChange({ ...filters, hasDesc: !filters.hasDesc })
                }
              >
                <div
                  className="w-10 h-5 rounded-full relative transition-all flex-shrink-0"
                  style={{
                    background: filters.hasDesc
                      ? primary
                      : "rgba(255,255,255,0.1)",
                  }}
                >
                  <div
                    className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                    style={{ left: filters.hasDesc ? "22px" : "2px" }}
                  />
                </div>
                <span
                  className="text-xs"
                  style={{
                    color: filters.hasDesc
                      ? primary
                      : isDark
                        ? "#6b7280"
                        : `${textColor}60`,
                  }}
                >
                  {filters.hasDesc ? "Has AI desc" : "All products"}
                </span>
              </div>
            </div>
          </div>

          {/* Row 2: Price + Brand + Category */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
            <div>
              <label style={labelStyle}>Min Price (₹)</label>
              <input
                type="number"
                inputMode="numeric"
                value={filters.minPrice}
                onChange={(e) =>
                  onChange({ ...filters, minPrice: e.target.value })
                }
                placeholder="0"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Max Price (₹)</label>
              <input
                type="number"
                inputMode="numeric"
                value={filters.maxPrice}
                onChange={(e) =>
                  onChange({ ...filters, maxPrice: e.target.value })
                }
                placeholder="1000000"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Brand</label>
              <input
                value={filters.brand === "all" ? "" : filters.brand}
                onChange={(e) =>
                  onChange({ ...filters, brand: e.target.value || "all" })
                }
                placeholder="e.g. Samsung"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Category</label>
              <input
                value={filters.category === "all" ? "" : filters.category}
                onChange={(e) =>
                  onChange({ ...filters, category: e.target.value || "all" })
                }
                placeholder="e.g. Smartphones"
                style={inputStyle}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchFilters;
