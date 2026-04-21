const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const dotenv = require("dotenv");

// Load env variables
dotenv.config({ path: path.join(__dirname, "../.env") });

const Product = require("../models/Product");

const results = [];

const cleanPrice = (priceStr) => {
  if (!priceStr) return 0;
  // Remove currency symbols, commas, spaces
  const cleaned = priceStr.replace(/[^0-9.]/g, "");
  return parseFloat(cleaned) || 0;
};

const cleanText = (text) => {
  if (!text) return "";
  return text.toString().trim().substring(0, 500); // limit length
};

const seedDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected...");

    // Clear existing products
    await Product.deleteMany();
    console.log("Existing products cleared...");

    const csvPath = path.join(__dirname, "FlipkartDataSet.csv");

    // Read and parse CSV
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on("data", (row) => {
          // Map CSV columns to our Product schema
          const product = {
            name: cleanText(row["product_name"]) || "Unknown Product",
            category: cleanText(row["product_category_tree"]) || "General",
            brand: cleanText(row["brand"]) || "Unknown",
            spec: cleanText(row["product_specifications"]) || "",
            price: cleanPrice(row["retail_price"]) || 0,
            description: cleanText(row["description"]) || "",
          };

          // Skip rows with no name or price
          if (product.name !== "Unknown Product" && product.price > 0) {
            results.push(product);
          }
        })
        .on("end", resolve)
        .on("error", reject);
    });

    console.log(`Parsed ${results.length} valid products from CSV...`);

    // Insert in batches of 500 to avoid memory issues
    const batchSize = 500;
    let inserted = 0;

    for (let i = 0; i < results.length; i += batchSize) {
      const batch = results.slice(i, i + batchSize);
      await Product.insertMany(batch, { ordered: false });
      inserted += batch.length;
      console.log(`Inserted ${inserted}/${results.length} products...`);
    }

    console.log("✅ Database seeded successfully!");
    console.log(`Total products in DB: ${await Product.countDocuments()}`);
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
