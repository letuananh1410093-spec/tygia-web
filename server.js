const express = require("express");
const path = require("path");
const getTyGiaUSD = require("./scraper");

const app = express();
const PORT = process.env.PORT || 3000;

// Route trang chủ
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// API lấy dữ liệu
app.get("/api/tygia", async (req, res) => {
  try {
    const data = await getTyGiaUSD();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Lỗi lấy dữ liệu" });
  }
});

app.listen(PORT, () => {
  console.log("Server chạy ở port " + PORT);
});
