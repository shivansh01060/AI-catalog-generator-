import { useState, useEffect } from "react";
import axios from "axios";
import { useTemplate } from "../context/TemplateContext";
import { useNavigate } from "react-router-dom";
import API from "../config/api";

function Templates() {
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const { setActiveTemplate } = useTemplate();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API}/api/templates`)
      .then((res) => setTemplates(res.data.templates))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const layouts = ["all", "grid", "list", "magazine", "minimal", "dark"];
  const filtered =
    filter === "all" ? templates : templates.filter((t) => t.layout === filter);

  const handleApply = () => {
    setActiveTemplate(selected);
    setApplied(true);
    setTimeout(() => navigate("/catalog"), 800);
  };

  return (
    <div className="mesh-bg min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="font-display text-2xl md:text-4xl font-bold shimmer-text mb-1">
            Catalog Templates
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            100 professional designs — pick yours
          </p>
        </div>

        {/* Filter tabs — scrollable on mobile */}
        <div className="flex gap-2 mb-6 md:mb-8 overflow-x-auto pb-1 scrollbar-none">
          {layouts.map((layout) => (
            <button
              key={layout}
              onClick={() => setFilter(layout)}
              className={`px-3 md:px-4 py-2 rounded-xl text-xs md:text-sm font-medium capitalize transition-all whitespace-nowrap flex-shrink-0 ${
                filter === layout
                  ? "text-white glow-border"
                  : "text-gray-400 hover:text-white"
              }`}
              style={
                filter === layout
                  ? {
                      background:
                        "linear-gradient(135deg, rgba(99,57,255,0.4), rgba(0,200,255,0.2))",
                    }
                  : { background: "rgba(255,255,255,0.04)" }
              }
            >
              {layout}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-32">
            <div className="w-12 h-12 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mx-auto" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {filtered.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelected(template)}
                className={`card-3d cursor-pointer rounded-2xl overflow-hidden transition-all ${
                  selected?.id === template.id
                    ? "ring-2 ring-purple-500 scale-105"
                    : ""
                }`}
                style={{ border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {/* Preview */}
                <div
                  className="h-24 md:h-28 flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundColor: template.theme.bg }}
                >
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${template.theme.primary}, transparent)`,
                    }}
                  />
                  <div className="relative text-center">
                    <div
                      className="w-8 h-8 md:w-10 md:h-10 rounded-xl mx-auto mb-2 float"
                      style={{
                        background: template.theme.primary,
                        boxShadow: `0 8px 20px ${template.theme.primary}60`,
                      }}
                    />
                    <div
                      className="w-14 md:w-16 h-1.5 rounded-full mx-auto mb-1"
                      style={{ background: template.theme.secondary }}
                    />
                    <div
                      className="w-10 h-1 rounded-full mx-auto"
                      style={{
                        background: template.theme.secondary,
                        opacity: 0.6,
                      }}
                    />
                  </div>
                </div>

                {/* Info */}
                <div
                  className="p-2 md:p-3"
                  style={{ background: "rgba(0,0,0,0.4)" }}
                >
                  <p className="text-xs font-bold text-white truncate">
                    {template.theme.name}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {template.layout}
                  </p>
                </div>

                {selected?.id === template.id && (
                  <div
                    className="text-center py-1 text-xs font-bold text-white"
                    style={{
                      background: "linear-gradient(135deg, #6339ff, #00c8ff)",
                    }}
                  >
                    ✓ Selected
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Selected panel — bottom sheet on mobile, fixed card on desktop */}
        {selected && (
          <div
            className="fixed bottom-0 left-0 right-0 md:bottom-6 md:left-auto md:right-6 glass md:rounded-2xl rounded-t-2xl p-4 md:p-6 md:w-72 glow-border"
            style={{ zIndex: 100 }}
          >
            <h3 className="font-display font-bold text-white mb-1">
              {selected.name}
            </h3>
            <p className="text-xs text-gray-400 capitalize mb-3 md:mb-4">
              {selected.layout} layout • {selected.theme.name}
            </p>
            <div className="flex gap-2 mb-3 md:mb-4">
              {[
                selected.theme.primary,
                selected.theme.secondary,
                selected.theme.bg,
              ].map((c, i) => (
                <div
                  key={i}
                  className="w-6 h-6 md:w-7 md:h-7 rounded-full border border-white/10"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelected(null)}
                className="py-2.5 px-3 rounded-xl text-sm text-gray-400 flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                ✕
              </button>
              <button
                onClick={handleApply}
                className="btn-neon flex-1 text-white py-2.5 rounded-xl text-sm font-medium"
              >
                {applied ? "✅ Applying..." : "🎨 Apply Template"}
              </button>
            </div>
          </div>
        )}

        {/* Spacer so content isn't hidden behind bottom sheet on mobile */}
        {selected && <div className="h-36 md:h-0" />}
      </div>
    </div>
  );
}

export default Templates;
