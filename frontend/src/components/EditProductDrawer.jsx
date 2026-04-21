import { useState, useEffect } from "react";
import axios from "axios";
import ImageUploader from "./ImageUploader";

const API = "http://localhost:5000";

function EditProductDrawer({ product, onClose, onUpdate }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    brand: "",
    spec: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const [descLoading, setDescLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");

  // Fill form when product changes
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        category: product.category || "",
        brand: product.brand || "",
        spec: product.spec || "",
        price: product.price || "",
      });
      setDescription(product.description || "");
      setMessage("");
    }
  }, [product]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Save edited product
  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.put(`${API}/api/products/${product._id}`, form);
      onUpdate(res.data); // update parent state
      setMessage("✅ Product updated!");
    } catch (err) {
      setMessage("❌ Error updating product");
    } finally {
      setLoading(false);
    }
  };

  // Regenerate AI description
  const handleRegenerate = async () => {
    setDescLoading(true);
    try {
      const res = await axios.post(`${API}/api/generate-description`, {
        productId: product._id,
      });
      setDescription(res.data.description);
      onUpdate({ ...product, description: res.data.description });
    } catch (err) {
      setMessage("❌ Error generating description");
    } finally {
      setDescLoading(false);
    }
  };

  if (!product) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-full z-50 overflow-y-auto"
        style={{
          width: "480px",
          background: "linear-gradient(180deg, #0d0d1a 0%, #060612 100%)",
          borderLeft: "1px solid rgba(99,57,255,0.3)",
          boxShadow: "-20px 0 60px rgba(99,57,255,0.15)",
          animation: "slideIn 0.3s ease",
        }}
      >
        <style>{`
          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}</style>

        {/* Header */}
        <div
          className="flex items-center justify-between p-6"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div>
            <h2 className="font-display font-bold text-white text-xl">
              Edit Product
            </h2>
            <p className="text-gray-500 text-xs mt-1">Update product details</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white transition"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            ✕
          </button>
        </div>
        {/* Image Upload Section */}
        <div className="p-6 pb-0">
          <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
            Product Image
          </label>
          <ImageUploader
            productId={product._id}
            currentImage={product.imageUrl}
            onUpdate={(data) => onUpdate({ ...product, ...data })}
            primary="#6339ff"
          />
        </div>
        {/* Form */}
        <div className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
              Product Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="input-dark w-full rounded-xl px-4 py-3 text-sm"
            />
          </div>

          {/* Category + Brand */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                Category
              </label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                className="input-dark w-full rounded-xl px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                Brand
              </label>
              <input
                name="brand"
                value={form.brand}
                onChange={handleChange}
                className="input-dark w-full rounded-xl px-4 py-3 text-sm"
              />
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
              Price (₹)
            </label>
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              type="number"
              className="input-dark w-full rounded-xl px-4 py-3 text-sm"
            />
          </div>

          {/* Specs */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
              Specifications
            </label>
            <textarea
              name="spec"
              value={form.spec}
              onChange={handleChange}
              rows={3}
              className="input-dark w-full rounded-xl px-4 py-3 text-sm resize-none"
            />
          </div>

          {/* Message */}
          {message && (
            <p
              className="text-sm"
              style={{
                color: message.includes("✅") ? "#4ade80" : "#f87171",
              }}
            >
              {message}
            </p>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={loading}
            className="btn-neon w-full text-white py-3 rounded-xl font-medium text-sm disabled:opacity-50"
          >
            {loading ? "Saving..." : "💾 Save Changes"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />
            <span className="text-xs text-gray-500">AI Tools</span>
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />
          </div>

          {/* AI Description section */}
          <div
            className="rounded-2xl p-4"
            style={{
              background: "rgba(99,57,255,0.08)",
              border: "1px solid rgba(99,57,255,0.2)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-purple-400 uppercase tracking-wider">
                🤖 AI Description
              </span>
              <button
                onClick={handleRegenerate}
                disabled={descLoading}
                className="text-xs px-3 py-1.5 rounded-lg font-medium transition disabled:opacity-50"
                style={{ background: "rgba(99,57,255,0.3)", color: "#a78bfa" }}
              >
                {descLoading ? "Generating..." : "✨ Regenerate"}
              </button>
            </div>

            {description ? (
              <p className="text-gray-300 text-sm leading-relaxed">
                {description}
              </p>
            ) : (
              <p className="text-gray-500 text-sm">
                No description yet. Click Regenerate!
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProductDrawer;
