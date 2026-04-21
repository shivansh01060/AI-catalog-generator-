import { useState, useEffect } from "react";
import axios from "axios";
import EditProductDrawer from "../components/EditProductDrawer";
import RecommendationsPopup from "../components/RecommendationsPopup";
import SkeletonCard from "../components/SkeletonCard";
import SearchFilters from "../components/SearchFilters";
import ExportModal from "../components/ExportModal";
import { useTemplate } from "../context/TemplateContext";
import { useToast } from "../components/Toast";
import ReviewsPanel from "../components/ReviewsPanel";

const API = "http://localhost:5000";
const PAGE_SIZE = 12;

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className="text-xs"
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

function getRating(id) {
  const num = parseInt(id?.slice(-4), 16) || 0;
  return Math.round((3 + (num % 20) / 10) * 10) / 10;
}

function getReviews(id) {
  const num = parseInt(id?.slice(-6), 16) || 0;
  return 50 + (num % 950);
}

function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [generating, setGenerating] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState(["All"]);
  const [recommendations, setRecommendations] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [recProduct, setRecProduct] = useState(null);
  const [showRecPopup, setShowRecPopup] = useState(false);
  const [recLoading, setRecLoading] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [showExportModal, setShowExportModal] = useState(false);
  const [reviewProduct, setReviewProduct] = useState(null);

  // ✅ Unified filter state
  const [filters, setFilters] = useState({
    q: "",
    minPrice: 0,
    maxPrice: 1000000,
    brand: "all",
    category: "all",
    hasDesc: false,
    sortBy: "newest",
  });

  const { activeTemplate } = useTemplate();
  const { showToast, ToastComponent } = useToast();

  const primary = activeTemplate?.theme.primary || "#6339ff";
  const secondary = activeTemplate?.theme.secondary || "#00c8ff";
  const bg = activeTemplate?.theme.bg || "#060612";
  const textColor = activeTemplate?.theme.text || "#e2e8f0";
  const isDark = activeTemplate?.layout === "dark" || !activeTemplate;
  const cols = activeTemplate?.layoutConfig?.columns || 3;
  const gridClass =
    { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" }[
      cols
    ] || "grid-cols-3";

  useEffect(() => {
    fetchProducts(1, true, filters);
  }, []);

  // ✅ Updated fetchProducts using search API
  const fetchProducts = async (
    pageNum = 1,
    reset = false,
    currentFilters = filters,
  ) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const params = new URLSearchParams({
        page: pageNum,
        limit: PAGE_SIZE,
        ...(currentFilters.q && { q: currentFilters.q }),
        ...(currentFilters.minPrice > 0 && {
          minPrice: currentFilters.minPrice,
        }),
        ...(currentFilters.maxPrice < 1000000 && {
          maxPrice: currentFilters.maxPrice,
        }),
        ...(currentFilters.brand !== "all" && { brand: currentFilters.brand }),
        ...(currentFilters.category !== "all" && {
          category: currentFilters.category,
        }),
        ...(currentFilters.hasDesc && { hasDesc: true }),
        sortBy: currentFilters.sortBy,
      });

      const res = await axios.get(`${API}/api/products/search?${params}`);
      const {
        products: newProducts,
        total: totalCount,
        hasMore: more,
      } = res.data;

      if (reset) {
        setProducts(newProducts);
        const cats = [
          "All",
          ...new Set(
            newProducts
              .map((p) =>
                p.category
                  ?.split(">>")[0]
                  ?.replace(/[\[\]"]/g, "")
                  .trim(),
              )
              .filter(Boolean),
          ),
        ].slice(0, 8);
        setCategories(cats);
      } else {
        setProducts((prev) => [...prev, ...newProducts]);
      }

      setTotal(totalCount);
      setHasMore(more);
      setPage(pageNum);
    } catch (err) {
      showToast("Failed to load products", "error");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // ✅ Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchProducts(1, true, newFilters);
  };

  const handleLoadMore = () => {
    fetchProducts(page + 1, false, filters);
  };

  const generateDesc = async (productId) => {
    setGenerating(productId);
    showToast("Generating AI description...", "loading");
    try {
      const res = await axios.post(`${API}/api/generate-description`, {
        productId,
      });
      setProducts(
        products.map((p) =>
          p._id === productId ? { ...p, description: res.data.description } : p,
        ),
      );
      showToast("Description generated!", "success");
    } catch (err) {
      showToast("Failed to generate description", "error");
    } finally {
      setGenerating(null);
    }
  };

  const handleFindSimilar = async (e, product) => {
    e.stopPropagation();
    setRecLoading(product._id);
    showToast("Finding similar products...", "loading");
    try {
      const res = await axios.post(`${API}/api/recommend`, {
        productId: product._id,
      });
      setAiRecommendations(res.data.aiRecommendations || []);
      setRecommendations(res.data.recommendations || []);
      setRecProduct(product);
      setShowRecPopup(true);
      showToast("Recommendations ready!", "success");
    } catch (err) {
      showToast("Failed to get recommendations", "error");
    } finally {
      setRecLoading(null);
    }
  };

  const handleUpdate = (updatedProduct) => {
    setProducts(
      products.map((p) => (p._id === updatedProduct._id ? updatedProduct : p)),
    );
    showToast("Product updated!", "success");
  };

  return (
    <div
      className="min-h-screen p-8 transition-all duration-500"
      style={{ background: isDark ? "#060612" : bg }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            {activeTemplate && (
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-2"
                style={{
                  background: `${primary}20`,
                  color: primary,
                  border: `1px solid ${primary}40`,
                }}
              >
                🎨 {activeTemplate.name}
              </div>
            )}
            <h1 className="font-display text-4xl font-bold shimmer-text mb-1">
              Product Catalog
            </h1>
            <p style={{ color: isDark ? "#9ca3af" : `${textColor}99` }}>
              {total.toLocaleString()} products found
            </p>
          </div>

          {/* Export button */}
          <button
            onClick={() => setShowExportModal(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all"
            style={{
              background: "rgba(255,60,120,0.15)",
              color: "#ff3c78",
              border: "1px solid rgba(255,60,120,0.3)",
            }}
          >
            📄 Export PDF
          </button>
        </div>

        {/* ✅ Advanced Search Filters */}
        <SearchFilters
          filters={filters}
          onChange={handleFilterChange}
          primary={primary}
          isDark={isDark}
          textColor={textColor}
        />

        {/* Loading skeletons */}
        {loading ? (
          <div className={`grid ${gridClass} gap-6`}>
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-gray-400 mb-2">No products found</p>
            <p className="text-gray-600 text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className={`grid ${gridClass} gap-6`}>
              {products.map((product) => {
                const rating = getRating(product._id);
                const reviews = getReviews(product._id);
                const shortCat = product.category
                  ?.split(">>")[0]
                  ?.replace(/[\[\]"]/g, "")
                  .trim();

                return (
                  <div
                    key={product._id}
                    className="card-3d rounded-2xl overflow-hidden group cursor-pointer transition-all"
                    style={{
                      background: isDark ? "rgba(255,255,255,0.03)" : "white",
                      border: `1px solid ${primary}15`,
                    }}
                    onClick={() => setSelectedProduct(product)}
                  >
                    {/* Image area — real image or gradient fallback */}
                    <div
                      className="h-40 relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg,
      hsl(${parseInt(product._id?.slice(-4), 16) % 360}, 40%, 15%),
      hsl(${(parseInt(product._id?.slice(-4), 16) + 60) % 360}, 40%, 10%))`,
                      }}
                    >
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <>
                          <div
                            className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-20"
                            style={{ background: primary }}
                          />
                          <div
                            className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-10"
                            style={{ background: secondary }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div
                              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold float"
                              style={{
                                background: `${primary}30`,
                                border: `2px solid ${primary}40`,
                              }}
                            >
                              {product.name?.charAt(0).toUpperCase()}
                            </div>
                          </div>
                        </>
                      )}

                      {/* Always show badges */}
                      <div
                        className="absolute top-3 left-3 text-xs px-2 py-1 rounded-lg"
                        style={{
                          background: "rgba(0,0,0,0.6)",
                          color: "white",
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        {shortCat?.substring(0, 12)}
                      </div>
                      <div
                        className="absolute top-3 right-3 text-xs px-2 py-1 rounded-lg font-bold"
                        style={{
                          background: `${secondary}30`,
                          color: secondary,
                          border: `1px solid ${secondary}40`,
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        ₹{product.price}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4">
                      <h3
                        className="font-display font-bold line-clamp-2 text-sm mb-1"
                        style={{ color: isDark ? "white" : textColor }}
                      >
                        {product.name}
                      </h3>
                      <p
                        className="text-xs mb-2"
                        style={{ color: isDark ? "#6b7280" : `${textColor}70` }}
                      >
                        {product.brand || "Unknown Brand"}
                      </p>

                      {/* Stars */}
                      <div className="flex items-center gap-2 mb-3">
                        <Stars rating={Math.round(rating)} />
                        <span
                          className="text-xs font-medium"
                          style={{ color: "#f59e0b" }}
                        >
                          {rating}
                        </span>
                        <span
                          className="text-xs"
                          style={{
                            color: isDark ? "#4b5563" : `${textColor}50`,
                          }}
                        >
                          ({reviews.toLocaleString()})
                        </span>
                      </div>

                      {/* Description or generate button */}
                      {product.description ? (
                        <div
                          className="rounded-xl p-2.5 text-xs line-clamp-2 leading-relaxed mb-3"
                          style={{
                            background: `${primary}08`,
                            border: `1px solid ${primary}15`,
                            color: isDark ? "#9ca3af" : `${textColor}80`,
                          }}
                        >
                          {product.description}
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            generateDesc(product._id);
                          }}
                          disabled={generating === product._id}
                          className="w-full text-xs py-2 rounded-xl mb-3 transition-all disabled:opacity-50"
                          style={{
                            background: `${primary}15`,
                            color: primary,
                            border: `1px solid ${primary}25`,
                          }}
                        >
                          {generating === product._id
                            ? "✨ Generating..."
                            : "✨ Generate AI Description"}
                        </button>
                      )}

                      {/* Find Similar button */}
                      <button
                        onClick={(e) => handleFindSimilar(e, product)}
                        disabled={recLoading === product._id}
                        className="w-full text-xs py-2 rounded-xl transition-all disabled:opacity-50 opacity-0 group-hover:opacity-100"
                        style={{
                          background: `${secondary}15`,
                          color: secondary,
                          border: `1px solid ${secondary}25`,
                        }}
                      >
                        {recLoading === product._id
                          ? "Finding..."
                          : "🎯 Find Similar Products"}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setReviewProduct(product);
                        }}
                        className="w-full text-xs py-2 rounded-xl transition-all mt-2"
                        style={{
                          background: "rgba(245,158,11,0.1)",
                          color: "#f59e0b",
                          border: "1px solid rgba(245,158,11,0.2)",
                        }}
                      >
                        ★ Reviews
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="btn-neon text-white px-8 py-3 rounded-xl font-medium text-sm disabled:opacity-50"
                >
                  {loadingMore ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Loading more...
                    </span>
                  ) : (
                    "Load More Products ↓"
                  )}
                </button>
                <p className="text-gray-600 text-xs mt-2">
                  Showing {products.length} of {total.toLocaleString()}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <EditProductDrawer
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onUpdate={handleUpdate}
      />

      {showRecPopup && (
        <RecommendationsPopup
          aiRecommendations={aiRecommendations}
          recommendations={recommendations}
          productName={recProduct?.name}
          onClose={() => setShowRecPopup(false)}
        />
      )}

      {showExportModal && (
        <ExportModal
          onClose={() => setShowExportModal(false)}
          showToast={showToast}
        />
      )}

      {ToastComponent}
      {reviewProduct && (
        <ReviewsPanel
          productId={reviewProduct._id}
          productName={reviewProduct.name}
          onClose={() => setReviewProduct(null)}
        />
      )}
    </div>
  );
}

export default Catalog;
