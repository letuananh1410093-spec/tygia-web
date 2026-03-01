const express = require("express");
const path = require("path");
const getRates = require("./scraper");

const app = express();
const PORT = process.env.PORT || 3000;

// Cho phép đọc file tĩnh (index.html)
app.use(express.static(__dirname));

// Trang chủ
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// API lấy tỷ giá
app.get("/api/rates", async (req, res) => {
  try {
    const data = await getRates();
    res.json(data);
  } catch (error) {
    console.error("Lỗi lấy tỷ giá:", error.message);
    res.status(500).json({ error: "Không lấy được dữ liệu" });
  }
});

// Chạy server
app.listen(PORT, () => {
  console.log("Server đang chạy ở port " + PORT);
});
