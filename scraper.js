const axios = require("axios");
const cheerio = require("cheerio");

async function getRates() {
  const { data } = await axios.get("https://tygiausd.org/ngoaite/usd");
  const $ = cheerio.load(data);

  let banks = [];
  let blackBuy = "";
  let blackSell = "";

  // ===== LẤY GIÁ CHỢ ĐEN =====
  $("h2:contains('Giá đô la chợ đen')")
    .next("table")
    .find("tbody tr")
    .each((i, el) => {
      const tds = $(el).find("td");
      blackBuy = $(tds[1]).text().trim().replace(/,/g, "");
      blackSell = $(tds[2]).text().trim().replace(/,/g, "");
    });

  // ===== LẤY TẤT CẢ NGÂN HÀNG =====
  $("table tbody tr").each((i, el) => {
    const cols = $(el).find("td");

    if (cols.length >= 5) {
      const name = $(cols[1]).text().trim();
      const buy = $(cols[2]).text().trim().replace(/,/g, "");
      const sell = $(cols[4]).text().trim().replace(/,/g, "");

      if (name && sell !== "-") {
        banks.push({
          name,
          buy: Number(buy),
          sell: Number(sell)
        });
      }
    }
  });

  // Sắp xếp từ cao → thấp theo giá bán
  banks.sort((a, b) => b.sell - a.sell);

  return {
    blackBuy: Number(blackBuy),
    blackSell: Number(blackSell),
    banks
  };
}

module.exports = getRates;
