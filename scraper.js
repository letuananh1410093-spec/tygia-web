const axios = require("axios");
const cheerio = require("cheerio");

async function getTyGiaUSD() {
  try {
    const { data } = await axios.get("https://tygiausd.org/");
    const $ = cheerio.load(data);

    const banks = [];

    $("table tbody tr").each((i, el) => {
      const tds = $(el).find("td");

      if (tds.length >= 3) {
        banks.push({
          name: $(tds[0]).text().trim(),
          buy: $(tds[1]).text().trim(),
          sell: $(tds[2]).text().trim(),
        });
      }
    });

    // Giá chợ đen (bạn có thể chỉnh selector nếu cần)
    const blackMarketBuy = $(".black-market .buy").text().trim() || "Đang cập nhật";
    const blackMarketSell = $(".black-market .sell").text().trim() || "Đang cập nhật";

    return {
      banks,
      blackMarket: {
        buy: blackMarketBuy,
        sell: blackMarketSell,
      },
    };
  } catch (error) {
    console.log(error.message);
    return { error: "Không lấy được dữ liệu" };
  }
}

module.exports = getTyGiaUSD;
