import { useState, useEffect } from "react";
import axios from "axios";
import { exportCatalogPDF } from "../utils/exportPDF";
import API from "../config/api";

const LAYOUT_OPTIONS = [
  {
    id: "grid",
    label: "Grid Layout",
    icon: "⊞",
    desc: "3 per row, compact",
  },
  {
    id: "list",
    label: "List Layout",
    icon: "☰",
    desc: "Table format",
  },
  {
    id: "detailed",
    label: "Detailed",
    icon: "◻",
    desc: "Full details per page",
  },
];

function ExportModal({ onClose, showToast }) {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedLayout, setSelectedLayout] = useState("grid");
  const [filter, setFilter] = useState("all");
  const [exporting, setExporting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API}/api/templates`)
      .then((res) => {
        setTemplates(res.data.templates);
        setSelectedTemplate(res.data.templates[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const layouts = ["all", "grid", "list", "magazine", "minimal", "dark"];
  const filtered =
    filter === "all" ? templates : templates.filter((t) => t.layout === filter);

  const handleExport = async () => {
    setExporting(true);
    showToast("Fetching products...", "loading");
    try {
      const res = await axios.get(`${API}/api/products?limit=500`);
      showToast("Generating PDF...", "loading");
      exportCatalogPDF(res.data, selectedTemplate, selectedLayout);
      showToast("PDF downloaded!", "success");
      onClose();
    } catch (err) {
      showToast("Failed to export PDF", "error");
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50"
        style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      />

      {/* Modal — bottom sheet on mobile, centered on desktop */}
      <div
        className="fixed z-50 glass
                    bottom-0 left-0 right-0 rounded-t-3xl
                    md:bottom-auto md:left-1/2 md:top-1/2 md:right-auto md:rounded-3xl md:-translate-x-1/2 md:-translate-y-1/2"
        style={{
          width: "min(780px, 100%)",
          maxHeight: "92vh",
          overflowY: "auto",
          border: "1px solid rgba(99,57,255,0.4)",
          boxShadow: "0 0 80px rgba(99,57,255,0.25)",
          animation: "popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <style>{`
          @keyframes popIn {
            from { transform: scale(0.92) translateY(30px); opacity: 0; }
            to { transform: scale(1) translateY(0); opacity: 1; }
          }
          @media (min-width: 768px) {
            @keyframes popIn {
              from { transform: translate(-50%,-50%) scale(0.85); opacity: 0; }
              to { transform: translate(-50%,-50%) scale(1); opacity: 1; }
            }
          }
        `}</style>

        {/* Drag handle — mobile only */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div
            className="w-10 h-1 rounded-full"
            style={{ background: "rgba(255,255,255,0.2)" }}
          />
        </div>

        {/* Header */}
        <div
          className="flex items-center justify-between px-4 md:px-6 py-4 pb-3"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-1.5"
              style={{ background: "rgba(255,60,120,0.15)", color: "#ff3c78" }}
            >
              📄 Export Catalog
            </div>
            <h2 className="font-display font-bold text-white text-xl md:text-2xl">
              Export as PDF
            </h2>
            <p className="text-gray-400 text-xs md:text-sm mt-0.5">
              Pick a template and layout
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition flex-shrink-0"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            ✕
          </button>
        </div>

        <div className="px-4 md:px-6 py-4 space-y-5 md:space-y-6">
          {/* Step 1 — Layout picker */}
          <div>
            <h3 className="font-display font-bold text-white mb-0.5 text-sm md:text-base">
              Step 1 — Choose Layout
            </h3>
            <p className="text-gray-500 text-xs mb-3">
              How products are arranged in the PDF
            </p>
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              {LAYOUT_OPTIONS.map((layout) => (
                <div
                  key={layout.id}
                  onClick={() => setSelectedLayout(layout.id)}
                  className="cursor-pointer rounded-2xl p-3 md:p-4 transition-all active:scale-95"
                  style={
                    selectedLayout === layout.id
                      ? {
                          background: "rgba(99,57,255,0.2)",
                          border: "2px solid rgba(99,57,255,0.6)",
                          boxShadow: "0 0 20px rgba(99,57,255,0.2)",
                        }
                      : {
                          background: "rgba(255,255,255,0.03)",
                          border: "2px solid rgba(255,255,255,0.06)",
                        }
                  }
                >
                  <div className="text-xl md:text-2xl mb-1.5">
                    {layout.icon}
                  </div>
                  <p className="font-bold text-white text-xs md:text-sm leading-tight">
                    {layout.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                    {layout.desc}
                  </p>
                  {selectedLayout === layout.id && (
                    <div
                      className="mt-1.5 text-xs font-bold"
                      style={{ color: "#a78bfa" }}
                    >
                      ✓
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 2 — Template picker */}
          <div>
            <h3 className="font-display font-bold text-white mb-0.5 text-sm md:text-base">
              Step 2 — Choose Template
            </h3>
            <p className="text-gray-500 text-xs mb-3">
              Template colors applied to the PDF
            </p>

            {/* Filter tabs — horizontally scrollable on mobile */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap scrollbar-hide">
              {layouts.map((l) => (
                <button
                  key={l}
                  onClick={() => setFilter(l)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition flex-shrink-0"
                  style={
                    filter === l
                      ? { background: "rgba(99,57,255,0.4)", color: "white" }
                      : {
                          background: "rgba(255,255,255,0.04)",
                          color: "#9ca3af",
                        }
                  }
                >
                  {l}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mx-auto" />
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 md:gap-3 max-h-44 overflow-y-auto pr-1">
                {filtered.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className="cursor-pointer rounded-xl overflow-hidden transition-all active:scale-95"
                    style={
                      selectedTemplate?.id === template.id
                        ? {
                            border: "2px solid #6339ff",
                            boxShadow: "0 0 15px rgba(99,57,255,0.4)",
                            transform: "scale(1.05)",
                          }
                        : { border: "1px solid rgba(255,255,255,0.08)" }
                    }
                  >
                    <div
                      className="h-12 md:h-14 flex items-center justify-center relative"
                      style={{ backgroundColor: template.theme.bg }}
                    >
                      <div
                        className="absolute inset-0 opacity-30"
                        style={{
                          background: `radial-gradient(circle, ${template.theme.primary}, transparent)`,
                        }}
                      />
                      <div
                        className="w-5 h-5 md:w-6 md:h-6 rounded-lg relative z-10"
                        style={{
                          background: template.theme.primary,
                          boxShadow: `0 4px 12px ${template.theme.primary}80`,
                        }}
                      />
                    </div>
                    <div
                      className="px-1.5 py-1"
                      style={{ background: "rgba(0,0,0,0.5)" }}
                    >
                      <p className="text-xs text-white truncate font-medium leading-tight">
                        {template.theme.name}
                      </p>
                      <p className="text-xs text-gray-500 capitalize hidden sm:block">
                        {template.layout}
                      </p>
                    </div>
                    {selectedTemplate?.id === template.id && (
                      <div
                        className="text-center py-0.5 text-xs font-bold text-white"
                        style={{
                          background: "linear-gradient(135deg,#6339ff,#00c8ff)",
                        }}
                      >
                        ✓
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected preview */}
          {selectedTemplate && (
            <div
              className="rounded-2xl p-3 md:p-4 flex items-center gap-3 md:gap-4"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex gap-1.5 md:gap-2 flex-shrink-0">
                {[
                  selectedTemplate.theme.primary,
                  selectedTemplate.theme.secondary,
                  selectedTemplate.theme.bg,
                ].map((c, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 md:w-8 md:h-8 rounded-full border border-white/10"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm truncate">
                  {selectedTemplate.name}
                </p>
                <p className="text-gray-400 text-xs capitalize">
                  {selectedLayout} • {selectedTemplate.theme.name}
                </p>
              </div>
              <div
                className="hidden sm:block ml-auto text-xs px-3 py-1 rounded-full flex-shrink-0"
                style={{ background: "rgba(99,57,255,0.2)", color: "#a78bfa" }}
              >
                Ready
              </div>
            </div>
          )}

          {/* Export button */}
          <button
            onClick={handleExport}
            disabled={exporting || !selectedTemplate}
            className="btn-neon w-full text-white py-3.5 md:py-4 rounded-2xl font-bold text-sm md:text-base disabled:opacity-50 flex items-center justify-center gap-3 active:scale-95 transition-transform"
          >
            {exporting ? (
              <>
                <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                📄 Export PDF — {selectedTemplate?.theme?.name} •{" "}
                {selectedLayout}
              </>
            )}
          </button>

          {/* Bottom safe-area spacer for mobile */}
          <div className="h-2 md:h-0" />
        </div>
      </div>
    </>
  );
}

export default ExportModal;
