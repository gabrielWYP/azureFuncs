const { chromium } = require("playwright");

module.exports = async function (context, req) {
  context.log("HTTP trigger function processed a request.");

  let titles = [];
  const browser = await chromium.launch({ headless: true }); // en serverless siempre headless
  const page = await browser.newPage();

  await page.goto("https://listado.mercadolibre.com.pe/bicicletas#D[A:bicicletas]");

  // espera a que carguen los ítems
  await page.waitForSelector("li.ui-search-layout__item");

  // extraer los títulos de los productos
  const items = await page.$$("li.ui-search-layout__item");
  for (const item of items) {
    const titleEl = await item.$("h3");
    if (titleEl) {
      const text = await titleEl.innerText();
      titles.push(text);
    }
  }

  await browser.close();

  context.res = {
    status: 200,
    headers: { "Content-Type": "text/plain" },
    body: titles.join("\n")
  };
};
