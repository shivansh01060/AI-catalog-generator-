import { useState, useEffect } from "react";
import axios from "axios";
import { useTemplate } from "../context/TemplateContext";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000";

function Templates() {
  const [templates, setTemplates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const { setActiveTemplate } = useTemplate(); // ✅
  const navigate = useNavigate(); // ✅

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

  // ✅ Apply template and go to catalog
  const handleApply = () => {
    setActiveTemplate(selected);
    setApplied(true);
    setTimeout(() => {
      navigate("/catalog");
    }, 800);
  };

  return (
    <div className="mesh-bg min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold shimmer-text mb-1">
            Catalog Templates
          </h1>
          <p className="text-gray-400">100 professional designs — pick yours</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {layouts.map((layout) => (
            <button
              key={layout}
              onClick={() => setFilter(layout)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
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
            <div className="w-12 h-12 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
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
                  className="h-28 flex items-center justify-center relative overflow-hidden"
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
                      className="w-10 h-10 rounded-xl mx-auto mb-2 float"
                      style={{
                        background: template.theme.primary,
                        boxShadow: `0 8px 20px ${template.theme.primary}60`,
                      }}
                    />
                    <div
                      className="w-16 h-1.5 rounded-full mx-auto mb-1"
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
                <div className="p-3" style={{ background: "rgba(0,0,0,0.4)" }}>
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

        {/* Selected panel */}
        {selected && (
          <div
            className="fixed bottom-6 right-6 glass rounded-2xl p-6 w-72 glow-border"
            style={{ zIndex: 100 }}
          >
            <h3 className="font-display font-bold text-white mb-1">
              {selected.name}
            </h3>
            <p className="text-xs text-gray-400 capitalize mb-4">
              {selected.layout} layout • {selected.theme.name}
            </p>
            <div className="flex gap-2 mb-4">
              {[
                selected.theme.primary,
                selected.theme.secondary,
                selected.theme.bg,
              ].map((c, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border border-white/10"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <button
              onClick={handleApply}
              className="btn-neon w-full text-white py-2.5 rounded-xl text-sm font-medium"
            >
              {applied ? "✅ Applying..." : "🎨 Apply Template"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Templates;
