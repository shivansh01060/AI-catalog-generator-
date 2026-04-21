const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateDescription = async (product) => {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // ✅ updated model name
      messages: [
        {
          role: "user",
          content: `Generate a professional e-commerce product description for:
          Name: ${product.name}
          Category: ${product.category}
          Brand: ${product.brand}
          Specs: ${product.spec}
          Price: ₹${product.price}
          
          Rules:
          - Keep it under 100 words
          - Focus on benefits, not just features
          - Use simple, convincing language
          - Do NOT include price in the description
          - Return plain text only, no bullet points or markdown`,
        },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const description = completion.choices[0].message.content.trim();
    return description;
  } catch (error) {
    console.error("Groq API Error:", error.message);
    throw new Error("Failed to generate description");
  }
};

module.exports = generateDescription;
