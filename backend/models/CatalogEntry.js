const mongoose = require("mongoose");
const EntrySchema = new mongoose.Schema(
  {
    productEntry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    generatedDes: {
      type: String,
      default: "",
    },
    recommendation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    BleuScore: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Entry", EntrySchema);
