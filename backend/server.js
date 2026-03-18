// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Stock = require("./models/Stock"); // Modelimizi import ediyoruz

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Bağlantısı
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB bağlantısı başarılı"))
  .catch((err) => console.error("MongoDB bağlantı hatası:", err));

// READ - Tüm stokları getir
app.get("/api/stocks", async (req, res) => {
  try {
    const stocks = await Stock.find().sort({ createdAt: -1 }); // En yeniler üstte
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE - Yeni stok ekle
app.post("/api/stocks", async (req, res) => {
  try {
    const newStock = await Stock.create(req.body);
    res.status(201).json(newStock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE - Stok güncelle
app.put("/api/stocks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedStock = await Stock.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }, // Güncellenmiş dökümanı döndür ve validasyonları çalıştır
    );

    if (!updatedStock)
      return res.status(404).json({ message: "Stok bulunamadı" });
    res.json(updatedStock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Stok sil
app.delete("/api/stocks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStock = await Stock.findByIdAndDelete(id);

    if (!deletedStock)
      return res.status(404).json({ message: "Stok bulunamadı" });
    res.json({ message: "Stok başarıyla silindi" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
