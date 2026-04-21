const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ✅ AI-powered recommendations — works for ANY product
const getAIRecommendations = async (product) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: `You are a product recommendation expert. Based on this product, suggest 5 similar products a customer might want.

Product:
- Name: ${product.name}
- Category: ${product.category}
- Brand: ${product.brand}
- Specs: ${product.spec}
- Price: ₹${product.price}

Return ONLY a JSON array with exactly 5 items. Each item must have:
- name: product name
- brand: brand name  
- reason: one sentence why it's similar
- estimatedPrice: realistic price in rupees (number only)
- matchScore: similarity percentage (number only, 60-95)

Return raw JSON only, no markdown, no explanation.`,
        },
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const text = completion.choices[0].message.content.trim();
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return parsed;
  } catch (error) {
    console.error("AI Recommendation Error:", error.message);
    return [];
  }
};

// Cosine similarity math
const buildFeatureVector = (product, allCategories, allBrands) => {
  const vector = [];
  allCategories.forEach((cat) => {
    vector.push(product.category === cat ? 1 : 0);
  });
  allBrands.forEach((brand) => {
    vector.push(product.brand === brand ? 1 : 0);
  });
  const maxPrice = 100000;
  vector.push(product.price / maxPrice);
  return vector;
};

const cosineSimilarity = (a, b) => {
  if (a.length !== b.length) return 0;
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
};

// Dataset cosine similarity recommendations
const getDatasetRecommendations = async (targetProduct, allProducts) => {
  const allCategories = [...new Set(allProducts.map((p) => p.category))];
  const allBrands = [...new Set(allProducts.map((p) => p.brand))];
  const targetVector = buildFeatureVector(
    targetProduct,
    allCategories,
    allBrands,
  );

  const similarities = allProducts
    .filter((p) => p._id.toString() !== targetProduct._id.toString())
    .map((p) => ({
      product: p,
      score: cosineSimilarity(
        targetVector,
        buildFeatureVector(p, allCategories, allBrands),
      ),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return similarities.map((s) => ({
    _id: s.product._id,
    name: s.product.name,
    category: s.product.category,
    brand: s.product.brand,
    price: s.product.price,
    description: s.product.description,
    similarityScore: Math.round(s.score * 100) + "%",
  }));
};

module.exports = { getAIRecommendations, getDatasetRecommendations };
