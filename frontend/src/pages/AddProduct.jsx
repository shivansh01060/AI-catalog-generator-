import { useState } from "react";
import axios from "axios";
import RecommendationsPopup from "../components/RecommendationsPopup";
import { useToast } from "../components/Toast";
import API from "../config/api";

function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    brand: "",
    spec: "",
    price: "",
  });
  const [description, setDescription] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [productId, setProductId] = useState(null);
  const [productName, setProductName] = useState("");
  const [loading, setLoading] = useState(false);
  const [descLoading, setDescLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const { showToast, ToastComponent } = useToast();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.name || !form.category || !form.price) {
      showToast("Name, category and price are required!", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/products`, form);
      setProductId(res.data._id);
      setProductName(res.data.name);
      showToast("Product saved successfully!", "success");
      const recRes = await axios.post(`${API}/api/recommend`, {
        productId: res.data._id,
      });
      setAiRecommendations(recRes.data.aiRecommendations || []);
      setRecommendations(recRes.data.recommendations || []);
      if (
        recRes.data.aiRecommendations?.length > 0 ||
        recRes.data.recommendations?.length > 0
      ) {
        setShowPopup(true);
      }
    } catch (err) {
      showToast("Error saving product", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!productId) return;
    setDescLoading(true);
    showToast("Generating AI description...", "loading");
    try {
      const res = await axios.post(`${API}/api/generate-description`, {
        productId,
      });
      setDescription(res.data.description);
      showToast("Description generated!", "success");
    } catch (err) {
      showToast("Error generating description", "error");
    } finally {
      setDescLoading(false);
    }
  };

  const fields = [
    {
      name: "name",
      label: "Product Name",
      placeholder: "e.g. Samsung Galaxy M34",
    },
    { name: "category", label: "Category", placeholder: "e.g. Smartphones" },
    { name: "brand", label: "Brand", placeholder: "e.g. Samsung" },
    {
      name: "price",
      label: "Price (₹)",
      placeholder: "e.g. 18999",
      type: "number",
    },
  ];

  return (
    <div className="mesh-bg min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="font-display text-2xl md:text-4xl font-bold shimmer-text mb-2">
            Add New Product
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Fill in the details and let AI do the rest
          </p>
        </div>

        {/* Form Card */}
        <div className="glass rounded-3xl p-4 md:p-8 mb-6 glow-border">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {fields.map((f) => (
              <div key={f.name}>
                <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                  {f.label}
                </label>
                <input
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  type={f.type || "text"}
                  className="input-dark w-full rounded-xl px-4 py-3 text-sm"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
              Specifications
            </label>
            <textarea
              name="spec"
              value={form.spec}
              onChange={handleChange}
              placeholder="e.g. 6GB RAM, 128GB Storage, 6000mAh battery"
              rows={3}
              className="input-dark w-full rounded-xl px-4 py-3 text-sm resize-none"
            />
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-neon text-white px-5 py-3 rounded-xl font-medium text-sm disabled:opacity-50 flex-1 sm:flex-none"
            >
              {loading ? "⏳ Saving..." : "💾 Save Product"}
            </button>

            {productId && (
              <button
                onClick={handleGenerate}
                disabled={descLoading}
                className="text-white px-5 py-3 rounded-xl font-medium text-sm disabled:opacity-50 transition flex-1 sm:flex-none"
                style={{
                  background: "rgba(99,57,255,0.3)",
                  border: "1px solid rgba(99,57,255,0.4)",
                }}
              >
                {descLoading
                  ? "✨ Generating..."
                  : "🤖 Generate AI Description"}
              </button>
            )}

            {recommendations.length > 0 && (
              <button
                onClick={() => setShowPopup(true)}
                className="text-white px-5 py-3 rounded-xl font-medium text-sm transition flex-1 sm:flex-none"
                style={{
                  background: "rgba(0,200,255,0.15)",
                  border: "1px solid rgba(0,200,255,0.3)",
                  color: "#00c8ff",
                }}
              >
                🎯 View Similar ({recommendations.length})
              </button>
            )}
          </div>
        </div>

        {/* AI Description */}
        {description && (
          <div
            className="glass rounded-3xl p-4 md:p-6 mb-6"
            style={{
              borderLeft: "3px solid #6339ff",
              boxShadow: "0 0 30px rgba(99,57,255,0.15)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-purple-400 text-sm font-medium uppercase tracking-wider">
                🤖 AI Generated Description
              </span>
            </div>
            <p className="text-gray-200 leading-relaxed text-sm md:text-base">
              {description}
            </p>
          </div>
        )}

        {ToastComponent}
      </div>

      {showPopup && (
        <RecommendationsPopup
          aiRecommendations={aiRecommendations}
          recommendations={recommendations}
          productName={productName}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
}

export default AddProduct;
