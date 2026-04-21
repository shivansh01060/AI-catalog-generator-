import { useState, useRef } from "react";
import axios from "axios";

const API = "http://localhost:5000";

function ImageUploader({
  productId,
  currentImage,
  onUpdate,
  primary = "#6339ff",
}) {
  const [mode, setMode] = useState("upload"); // upload | url
  const [urlInput, setUrlInput] = useState("");
  const [preview, setPreview] = useState(currentImage || "");
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  const handleFileUpload = async (file) => {
    if (!file) return;
    setLoading(true);

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await axios.post(
        `${API}/api/products/${productId}/image`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      setPreview(`${API}${res.data.imageUrl}`);
      onUpdate({ imageUrl: `${API}${res.data.imageUrl}` });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUrlSave = async () => {
    if (!urlInput.trim()) return;
    setLoading(true);
    try {
      const res = await axios.put(
        `${API}/api/products/${productId}/image-url`,
        { imageUrl: urlInput },
      );
      setPreview(urlInput);
      onUpdate({ imageUrl: urlInput });
      setUrlInput("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: `1px solid ${primary}25` }}
    >
      {/* Image Preview */}
      <div
        className="relative h-48 flex items-center justify-center overflow-hidden"
        style={{
          background: preview
            ? "transparent"
            : `linear-gradient(135deg, ${primary}15, ${primary}05)`,
        }}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="Product"
              className="w-full h-full object-cover"
              onError={() => setPreview("")}
            />
            {/* Overlay on hover */}
            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-all"
              style={{ background: "rgba(0,0,0,0.6)" }}
            >
              <button
                onClick={() => fileRef.current?.click()}
                className="text-white text-sm font-medium px-4 py-2 rounded-xl"
                style={{ background: `${primary}80` }}
              >
                Change Image
              </button>
            </div>
          </>
        ) : (
          <div
            className="flex flex-col items-center justify-center w-full h-full cursor-pointer transition-all"
            style={{ background: dragOver ? `${primary}20` : "transparent" }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-3"
              style={{ background: `${primary}20` }}
            >
              {dragOver ? "📂" : "🖼️"}
            </div>
            <p className="text-sm font-medium" style={{ color: primary }}>
              {dragOver ? "Drop to upload" : "Click or drag image here"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG, WEBP — Max 5MB
            </p>
          </div>
        )}

        {loading && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.7)" }}
          >
            <div
              className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: `${primary}40`, borderTopColor: primary }}
            />
          </div>
        )}
      </div>

      {/* Upload Controls */}
      <div className="p-4" style={{ background: "rgba(0,0,0,0.3)" }}>
        {/* Mode tabs */}
        <div className="flex gap-2 mb-3">
          {["upload", "url"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="flex-1 py-1.5 rounded-lg text-xs font-medium capitalize transition"
              style={
                mode === m
                  ? {
                      background: `${primary}30`,
                      color: primary,
                      border: `1px solid ${primary}40`,
                    }
                  : {
                      background: "rgba(255,255,255,0.04)",
                      color: "#6b7280",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }
              }
            >
              {m === "upload" ? "📁 File Upload" : "🔗 Image URL"}
            </button>
          ))}
        </div>

        {/* File upload */}
        {mode === "upload" && (
          <>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files[0])}
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-50"
              style={{
                background: `${primary}20`,
                color: primary,
                border: `1px solid ${primary}30`,
              }}
            >
              {loading ? "Uploading..." : "Choose File"}
            </button>
          </>
        )}

        {/* URL input */}
        {mode === "url" && (
          <div className="flex gap-2">
            <input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="input-dark flex-1 rounded-xl px-3 py-2.5 text-xs"
            />
            <button
              onClick={handleUrlSave}
              disabled={loading || !urlInput}
              className="px-4 py-2.5 rounded-xl text-xs font-medium transition disabled:opacity-50"
              style={{ background: primary, color: "white" }}
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImageUploader;
