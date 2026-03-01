const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get("/api/tygia", async (req, res) => {
  try {
    const { data } = await axios.get("https://tygiausd.org/ngoaite/usd", {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const $ = cheerio.load(data);

    const results = [];

    $("table tbody tr").each((i, row) => {
      const cols = $(row).find("td");

      const bank = $(cols[0]).text().trim();
      const buy = $(cols[1]).text().trim();
      const sell = $(cols[2]).text().trim();

      if (bank && buy && sell) {
        results.push({
          bank,
          buy,
          sell
        });
      }
    });

    res.json(results);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Không lấy được dữ liệu" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
