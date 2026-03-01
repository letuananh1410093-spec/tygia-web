const express = require("express");
const getDataFromTygiaUSD = require("./scraper");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/api/rates", async (req, res) => {
  try {
    const data = await getDataFromTygiaUSD();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch rates" });
  }
});

app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
