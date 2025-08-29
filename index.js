// جلب حالة طلب واحد
app.post("/status", async (req, res) => {
  try {
    const { order } = req.body;

    const response = await fetch("https://peakerr.com/api/v2", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        key: process.env.PEAKERR_API_KEY,
        action: "status",
        order
      })
    });

    const text = await response.text();
    try {
      const data = JSON.parse(text); // لو الرد JSON
      res.json(data);
    } catch (e) {
      res.json({ rawResponse: text }); // لو الرد نص عادي
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// جلب أكثر من طلب
app.post("/orders", async (req, res) => {
  try {
    const { orders } = req.body; // "123,124,125"

    const response = await fetch("https://peakerr.com/api/v2", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        key: process.env.PEAKERR_API_KEY,
        action: "status",
        orders
      })
    });

    const text = await response.text();
    try {
      const data = JSON.parse(text);
      res.json(data);
    } catch (e) {
      res.json({ rawResponse: text });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
