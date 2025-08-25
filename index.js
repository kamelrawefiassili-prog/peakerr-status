import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ صفحة للتأكد أن السيرفر شغال
app.get("/", (req, res) => {
  res.send("✅ Peakerr Status API is running!");
});

// ✅ جلب حالة طلب واحد
app.get("/status/:id", async (req, res) => {
  try {
    const response = await fetch("https://peakerr.com/api/v2", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        key: process.env.PEAKERR_API_KEY, // نحط المفتاح من Render
        action: "status",
        order: req.params.id
      })
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ جلب جميع الطلبات
app.get("/orders", async (req, res) => {
  try {
    const response = await fetch("https://peakerr.com/api/v2", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        key: process.env.PEAKERR_API_KEY,
        action: "orders"
      })
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Status API running on port ${PORT}`));
