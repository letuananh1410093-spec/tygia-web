const express = require("express");
const axios = require("axios");
const xml2js = require("xml2js");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get("/api/tygia", async (req, res) => {
  try {
    const response = await axios.get(
      "https://portal.vietcombank.com.vn/UserControls/TVPortal.TyGia/vcb_tygia.xml"
    );

    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(response.data);

    const rates = result.ExrateList.Exrate;
    const usd = rates.find(r => r.$.CurrencyCode === "USD");

    res.json({
      buy_cash: usd.$.Buy,
      buy_transfer: usd.$.Transfer,
      sell: usd.$.Sell
    });

  } catch (error) {
    res.status(500).json({ error: "Không lấy được dữ liệu" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
