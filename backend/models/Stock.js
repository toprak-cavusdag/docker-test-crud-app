// models/Stock.js
const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Ürün adı zorunludur"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Adet zorunludur"],
      min: [0, "Adet 0'dan küçük olamaz"],
    },
  },
  { timestamps: true },
); // createdAt ve updatedAt alanlarını otomatik ekler

module.exports = mongoose.model("Stock", stockSchema);
