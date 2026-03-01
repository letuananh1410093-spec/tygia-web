const express = require("express");
const path = require("path");
const getTyGiaUSD = require("./scraper");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/tygia", async (req, res) => {
  const data = await getTyGiaUSD();
  res.json(data);
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
