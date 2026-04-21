import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Convert hex color to RGB array
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [99, 57, 255];
};

export const exportCatalogPDF = (products, template, layout) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  const primary = hexToRgb(template?.theme?.primary || "#6339ff");
  const secondary = hexToRgb(template?.theme?.secondary || "#00c8ff");
  const bgHex = template?.theme?.bg || "#060612";
  const textHex = template?.theme?.text || "#e2e8f0";
  const isDark = template?.layout === "dark" || !template;

  const bg = isDark ? [6, 6, 18] : hexToRgb(bgHex);
  const textColor = isDark ? [220, 220, 255] : hexToRgb(textHex);
  const cardBg = isDark ? [15, 15, 30] : [245, 247, 255];

  const templateName = template?.name || "Default";

  // ── COVER PAGE ──────────────────────────────────────
  doc.setFillColor(...bg);
  doc.rect(0, 0, pageWidth, 297, "F");

  // Accent bar left
  doc.setFillColor(...primary);
  doc.rect(0, 0, 6, 297, "F");

  // Title
  doc.setTextColor(...primary);
  doc.setFontSize(38);
  doc.setFont("helvetica", "bold");
  doc.text("AI CATALOG", pageWidth / 2, 90, { align: "center" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...secondary);
  doc.text("Product Catalog Export", pageWidth / 2, 106, { align: "center" });

  // Template badge
  doc.setFillColor(...primary.map((c) => Math.min(c + 20, 255)));
  doc.roundedRect(pageWidth / 2 - 40, 116, 80, 10, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text(`🎨 ${templateName}`, pageWidth / 2, 123, { align: "center" });

  // Stats box
  doc.setFillColor(...cardBg);
  doc.roundedRect(30, 145, pageWidth - 60, 70, 6, 6, "F");
  doc.setDrawColor(...primary);
  doc.setLineWidth(0.5);
  doc.roundedRect(30, 145, pageWidth - 60, 70, 6, 6, "S");

  const withDesc = products.filter((p) => p.description).length;
  const stats = [
    { label: "Total Products", value: products.length },
    { label: "With AI Descriptions", value: withDesc },
    {
      label: "Layout Style",
      value: layout.charAt(0).toUpperCase() + layout.slice(1),
    },
  ];

  stats.forEach((stat, i) => {
    const x = 45 + i * 55;
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primary);
    doc.text(String(stat.value), x, 170);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textColor);
    doc.text(stat.label, x, 180);
  });

  doc.setFontSize(9);
  doc.setTextColor(...textColor.map((c) => Math.max(c - 60, 0)));
  doc.text(
    `Generated: ${new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}`,
    pageWidth / 2,
    228,
    { align: "center" },
  );

  doc.setFontSize(8);
  doc.setTextColor(...primary.map((c) => Math.max(c - 40, 0)));
  doc.text(
    "Powered by AI Catalog Generator • Groq LLaMA 3.1",
    pageWidth / 2,
    275,
    { align: "center" },
  );

  // ── CONTENT PAGES ───────────────────────────────────
  if (layout === "grid")
    renderGrid(
      doc,
      products,
      primary,
      secondary,
      bg,
      cardBg,
      textColor,
      pageWidth,
      templateName,
    );
  else if (layout === "list")
    renderList(
      doc,
      products,
      primary,
      secondary,
      bg,
      cardBg,
      textColor,
      pageWidth,
      templateName,
    );
  else if (layout === "detailed")
    renderDetailed(
      doc,
      products,
      primary,
      secondary,
      bg,
      cardBg,
      textColor,
      pageWidth,
      templateName,
    );

  const fileName = `AI_Catalog_${templateName.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);
};

// ── GRID LAYOUT (3 products per row) ──────────────────
function renderGrid(
  doc,
  products,
  primary,
  secondary,
  bg,
  cardBg,
  textColor,
  pageWidth,
  templateName,
) {
  const cols = 3;
  const cardW = (pageWidth - 28 - (cols - 1) * 6) / cols;
  const cardH = 70;
  const startX = 14;
  let x = startX;
  let y = 30;

  products.forEach((product, index) => {
    if (index % (cols * 3) === 0) {
      doc.addPage();
      doc.setFillColor(...bg);
      doc.rect(0, 0, pageWidth, 297, "F");
      addPageHeader(
        doc,
        primary,
        textColor,
        pageWidth,
        templateName,
        Math.ceil(index / (cols * 3)) + 1,
      );
      x = startX;
      y = 30;
    }

    const col = index % cols;
    const row = Math.floor((index % (cols * 3)) / cols);
    x = startX + col * (cardW + 6);
    y = 28 + row * (cardH + 6);

    // Card background
    doc.setFillColor(...cardBg);
    doc.roundedRect(x, y, cardW, cardH, 3, 3, "F");
    doc.setDrawColor(...primary.map((c) => Math.min(c + 30, 255)));
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, cardW, cardH, 3, 3, "S");

    // Top accent line
    doc.setFillColor(...primary);
    doc.rect(x, y, cardW, 2, "F");

    // Product name
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...textColor);
    const nameLines = doc.splitTextToSize(product.name || "—", cardW - 6);
    doc.text(nameLines.slice(0, 2), x + 3, y + 10);

    // Brand
    doc.setFontSize(6);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...secondary);
    doc.text(product.brand?.substring(0, 18) || "Unknown", x + 3, y + 22);

    // Price
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primary);
    doc.text(
      `₹${product.price?.toLocaleString() || 0}`,
      x + cardW - 3,
      y + 10,
      { align: "right" },
    );

    // Description
    if (product.description) {
      doc.setFontSize(6);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...textColor.map((c) => Math.max(c - 40, 0)));
      const descLines = doc.splitTextToSize(product.description, cardW - 6);
      doc.text(descLines.slice(0, 4), x + 3, y + 30);
    } else {
      doc.setFontSize(6);
      doc.setTextColor(...primary.map((c) => Math.max(c - 20, 0)));
      doc.text("No AI description yet", x + 3, y + 30);
    }
  });
}

// ── LIST LAYOUT (1 product per row, compact) ──────────
function renderList(
  doc,
  products,
  primary,
  secondary,
  bg,
  cardBg,
  textColor,
  pageWidth,
  templateName,
) {
  doc.addPage();
  doc.setFillColor(...bg);
  doc.rect(0, 0, pageWidth, 297, "F");
  addPageHeader(doc, primary, textColor, pageWidth, templateName, 2);

  autoTable(doc, {
    startY: 28,
    head: [
      ["#", "Product Name", "Brand", "Category", "Price", "AI Description"],
    ],
    body: products.map((p, i) => [
      i + 1,
      p.name?.substring(0, 40) || "—",
      p.brand?.substring(0, 15) || "Unknown",
      p.category
        ?.split(">>")[0]
        ?.replace(/[\[\]"]/g, "")
        .trim()
        ?.substring(0, 18) || "—",
      `₹${p.price?.toLocaleString() || 0}`,
      p.description?.substring(0, 50) || "Not generated",
    ]),
    styles: {
      fontSize: 7,
      cellPadding: 3,
      textColor: [...textColor],
      fillColor: [...cardBg],
      lineColor: [...primary.map((c) => Math.max(c - 60, 0))],
      lineWidth: 0.2,
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [...primary],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
    },
    alternateRowStyles: {
      fillColor: [...bg.map((c) => Math.min(c + 8, 255))],
    },
    columnStyles: {
      0: { cellWidth: 8, halign: "center" },
      4: { halign: "right", cellWidth: 20 },
      5: { cellWidth: 55 },
    },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      doc.setFillColor(...bg);
      doc.rect(0, 0, pageWidth, data.settings.startY - 1, "F");
    },
  });
}

// ── DETAILED LAYOUT (1 product per page) ──────────────
function renderDetailed(
  doc,
  products,
  primary,
  secondary,
  bg,
  cardBg,
  textColor,
  pageWidth,
  templateName,
) {
  products.forEach((product, index) => {
    doc.addPage();

    doc.setFillColor(...bg);
    doc.rect(0, 0, pageWidth, 297, "F");

    addPageHeader(doc, primary, textColor, pageWidth, templateName, index + 2);

    // Big product card
    doc.setFillColor(...cardBg);
    doc.roundedRect(14, 26, pageWidth - 28, 100, 5, 5, "F");
    doc.setDrawColor(...primary);
    doc.setLineWidth(0.4);
    doc.roundedRect(14, 26, pageWidth - 28, 100, 5, 5, "S");

    // Left accent
    doc.setFillColor(...primary);
    doc.rect(14, 26, 5, 100, "F");

    // Product name
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...textColor);
    const nameLines = doc.splitTextToSize(
      product.name || "Unknown",
      pageWidth - 60,
    );
    doc.text(nameLines.slice(0, 2), 26, 44);

    // Brand chip
    doc.setFillColor(...primary.map((c) => Math.floor(c * 0.3)));
    doc.roundedRect(26, 54, 55, 9, 2, 2, "F");
    doc.setFontSize(8);
    doc.setTextColor(...secondary);
    doc.text(`Brand: ${(product.brand || "Unknown").substring(0, 14)}`, 30, 61);

    // Category chip
    const shortCat =
      product.category
        ?.split(">>")[0]
        ?.replace(/[\[\]"]/g, "")
        .trim()
        ?.substring(0, 18) || "General";
    doc.setFillColor(...secondary.map((c) => Math.floor(c * 0.2)));
    doc.roundedRect(86, 54, 65, 9, 2, 2, "F");
    doc.setFontSize(8);
    doc.setTextColor(...primary);
    doc.text(`Category: ${shortCat}`, 90, 61);

    // Price
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...secondary);
    doc.text(`₹${product.price?.toLocaleString() || 0}`, pageWidth - 20, 44, {
      align: "right",
    });

    // Specs
    if (product.spec) {
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...textColor.map((c) => Math.max(c - 60, 0)));
      const specLines = doc.splitTextToSize(
        `Specs: ${product.spec}`,
        pageWidth - 55,
      );
      doc.text(specLines.slice(0, 3), 26, 75);
    }

    // AI Description box
    doc.setFillColor(...primary.map((c) => Math.floor(c * 0.15)));
    doc.roundedRect(14, 136, pageWidth - 28, 65, 4, 4, "F");
    doc.setDrawColor(...primary);
    doc.setLineWidth(0.3);
    doc.roundedRect(14, 136, pageWidth - 28, 65, 4, 4, "S");

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...primary);
    doc.text("🤖 AI GENERATED DESCRIPTION", 20, 147);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...textColor);
    const descText = product.description || "No AI description generated yet.";
    const descLines = doc.splitTextToSize(descText, pageWidth - 44);
    doc.text(descLines.slice(0, 5), 20, 157);

    // Product number badge
    doc.setFillColor(...primary);
    doc.circle(pageWidth - 22, 32, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text(`${index + 1}`, pageWidth - 22, 35, { align: "center" });

    // Footer
    doc.setFontSize(7);
    doc.setTextColor(...textColor.map((c) => Math.max(c - 100, 0)));
    doc.text(
      "AI Catalog Generator  •  Powered by Groq LLaMA 3.1",
      pageWidth / 2,
      285,
      { align: "center" },
    );
  });
}

// ── SHARED PAGE HEADER ────────────────────────────────
function addPageHeader(
  doc,
  primary,
  textColor,
  pageWidth,
  templateName,
  pageNum,
) {
  doc.setFillColor(...primary);
  doc.rect(0, 0, pageWidth, 18, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("AI CATALOG GENERATOR", 14, 12);
  doc.setFont("helvetica", "normal");
  doc.text(`${templateName}  •  Page ${pageNum}`, pageWidth - 14, 12, {
    align: "right",
  });
}
