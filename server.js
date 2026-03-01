const express = require("express");
const axios = require("axios");
const xml2js = require("xml2js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get("/api/tygia", async (req, res) => {
  try {
    const response = await axios.get(
      "https://portal.vietcombank.com.vn/UserControls/TVPortal.TyGia/vcb_tygia.xml",
      {
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      }
    );

    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(response.data);

    const exrates = result["ExrateList"]["Exrate"];

    let usdRate = null;

    if (Array.isArray(exrates)) {
      usdRate = exrates.find(item => item.$.CurrencyCode === "USD");
    } else {
      if (exrates.$.CurrencyCode === "USD") {
        usdRate = exrates;
      }
    }

    if (!usdRate) {
      return res.status(404).json({ error: "Không tìm thấy USD" });
    }

    res.json({
      buy_cash: usdRate.$.Buy,
      buy_transfer: usdRate.$.Transfer,
      sell: usdRate.$.Sell
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Không lấy được dữ liệu" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
