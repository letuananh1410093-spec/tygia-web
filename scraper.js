const puppeteer = require("puppeteer");

async function getDataFromTygiaUSD() {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.goto("https://tygiausd.org/", {
    waitUntil: "networkidle2",
  });

  const result = await page.evaluate(() => {
    const data = {};

    // === Vietcombank ===
    const vcbRow = document.querySelector(
      "table#exchange-table tbody tr:nth-child(1)" // chỉnh selector nếu cần
    );
    if (vcbRow) {
      const tds = vcbRow.querySelectorAll("td");
      data.vietcombankBuy = tds[1]?.innerText.trim();
      data.vietcombankSell = tds[3]?.innerText.trim(); // tùy cấu trúc
    }

    // === Chợ đen ===
    const blackRow = document.querySelector(
      "table#black-market tbody tr"
    );
    if (blackRow) {
      const tds2 = blackRow.querySelectorAll("td");
      data.blackBuy = tds2[1]?.innerText.trim();
      data.blackSell = tds2[2]?.innerText.trim();
    }

    return data;
  });

  await browser.close();
  return result;
}

module.exports = getDataFromTygiaUSD;
