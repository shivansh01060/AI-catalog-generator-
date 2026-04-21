const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDb = require("./config/db");
const path = require("path");

dotenv.config();
connectDb();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/generate-description", require("./routes/descriptionRoutes"));
app.use("/api/recommend", require("./routes/recommendRoutes"));
app.use("/api/templates", require("./routes/templateRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));

app.use("/api/products", require("./routes/ProRoutes"));
app.use("/api/catalog", require("./routes/catRoute"));
app.get("/", (req, res) => {
  res.send("Api for this catalog is running properly");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`the server is running at ${PORT}`);
});
