const express = require("express");
const router = express.Router();

// 100 templates = 5 layouts × 20 themes
const layouts = ["grid", "list", "magazine", "minimal", "dark"];

const themes = [
  {
    name: "Ocean Blue",
    primary: "#1e40af",
    secondary: "#93c5fd",
    bg: "#eff6ff",
    text: "#1e3a5f",
  },
  {
    name: "Forest Green",
    primary: "#166534",
    secondary: "#86efac",
    bg: "#f0fdf4",
    text: "#14532d",
  },
  {
    name: "Sunset Orange",
    primary: "#c2410c",
    secondary: "#fdba74",
    bg: "#fff7ed",
    text: "#7c2d12",
  },
  {
    name: "Royal Purple",
    primary: "#6d28d9",
    secondary: "#c4b5fd",
    bg: "#f5f3ff",
    text: "#4c1d95",
  },
  {
    name: "Rose Pink",
    primary: "#be185d",
    secondary: "#f9a8d4",
    bg: "#fdf2f8",
    text: "#831843",
  },
  {
    name: "Slate Gray",
    primary: "#334155",
    secondary: "#94a3b8",
    bg: "#f8fafc",
    text: "#0f172a",
  },
  {
    name: "Amber Gold",
    primary: "#b45309",
    secondary: "#fcd34d",
    bg: "#fffbeb",
    text: "#78350f",
  },
  {
    name: "Teal Fresh",
    primary: "#0f766e",
    secondary: "#5eead4",
    bg: "#f0fdfa",
    text: "#134e4a",
  },
  {
    name: "Crimson Red",
    primary: "#b91c1c",
    secondary: "#fca5a5",
    bg: "#fef2f2",
    text: "#7f1d1d",
  },
  {
    name: "Sky Light",
    primary: "#0369a1",
    secondary: "#7dd3fc",
    bg: "#f0f9ff",
    text: "#0c4a6e",
  },
  {
    name: "Midnight Dark",
    primary: "#818cf8",
    secondary: "#4f46e5",
    bg: "#0f172a",
    text: "#e2e8f0",
  },
  {
    name: "Neon Cyber",
    primary: "#22d3ee",
    secondary: "#06b6d4",
    bg: "#083344",
    text: "#cffafe",
  },
  {
    name: "Deep Space",
    primary: "#a78bfa",
    secondary: "#7c3aed",
    bg: "#13111c",
    text: "#ede9fe",
  },
  {
    name: "Carbon Dark",
    primary: "#f97316",
    secondary: "#ea580c",
    bg: "#1c1917",
    text: "#fafaf9",
  },
  {
    name: "Matrix Green",
    primary: "#4ade80",
    secondary: "#16a34a",
    bg: "#052e16",
    text: "#dcfce7",
  },
  {
    name: "Warm Ivory",
    primary: "#92400e",
    secondary: "#d97706",
    bg: "#fefce8",
    text: "#451a03",
  },
  {
    name: "Cool Mint",
    primary: "#059669",
    secondary: "#34d399",
    bg: "#ecfdf5",
    text: "#022c22",
  },
  {
    name: "Lavender Dream",
    primary: "#7e22ce",
    secondary: "#a855f7",
    bg: "#faf5ff",
    text: "#3b0764",
  },
  {
    name: "Coral Reef",
    primary: "#e11d48",
    secondary: "#fb7185",
    bg: "#fff1f2",
    text: "#881337",
  },
  {
    name: "Nordic Ice",
    primary: "#0ea5e9",
    secondary: "#38bdf8",
    bg: "#f0f9ff",
    text: "#082f49",
  },
];

const layoutConfigs = {
  grid: {
    columns: 3,
    cardStyle: "rounded shadow image-top",
    imageHeight: "200px",
    showDescription: true,
    showPrice: true,
  },
  list: {
    columns: 1,
    cardStyle: "horizontal bordered",
    imageHeight: "120px",
    showDescription: true,
    showPrice: true,
  },
  magazine: {
    columns: 2,
    cardStyle: "large-image overlay-text",
    imageHeight: "300px",
    showDescription: false,
    showPrice: true,
  },
  minimal: {
    columns: 4,
    cardStyle: "no-shadow minimal-border",
    imageHeight: "150px",
    showDescription: false,
    showPrice: true,
  },
  dark: {
    columns: 3,
    cardStyle: "dark-card glow-border",
    imageHeight: "200px",
    showDescription: true,
    showPrice: true,
  },
};

// Generate all 100 templates
const generateTemplates = () => {
  const templates = [];
  let id = 1;

  layouts.forEach((layout) => {
    themes.forEach((theme) => {
      templates.push({
        id,
        name: `${theme.name} ${layout.charAt(0).toUpperCase() + layout.slice(1)}`,
        layout,
        layoutConfig: layoutConfigs[layout],
        theme: {
          name: theme.name,
          primary: theme.primary,
          secondary: theme.secondary,
          bg: theme.bg,
          text: theme.text,
        },
        preview: `template_${layout}_${id}`,
      });
      id++;
    });
  });

  return templates;
};

const allTemplates = generateTemplates();

// GET /api/templates — get all 100 templates
router.get("/", (req, res) => {
  res.json({
    total: allTemplates.length,
    templates: allTemplates,
  });
});

// GET /api/templates/:id — get single template
router.get("/:id", (req, res) => {
  const template = allTemplates.find((t) => t.id === parseInt(req.params.id));
  if (!template) {
    return res.status(404).json({ message: "Template not found" });
  }
  res.json(template);
});

// GET /api/templates/layout/:layout — filter by layout
router.get("/layout/:layout", (req, res) => {
  const filtered = allTemplates.filter((t) => t.layout === req.params.layout);
  if (filtered.length === 0) {
    return res
      .status(404)
      .json({ message: "No templates found for this layout" });
  }
  res.json({ total: filtered.length, templates: filtered });
});

module.exports = router;
