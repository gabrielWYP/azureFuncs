const { chromium } = require("playwright-chromium");

module.exports = async function (context, req) {
  context.log("HTTP trigger function processed a request.");

  let titles = [];
  let browser;

  try {
    browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] }); // args extra para Azure/Linux
    const page = await browser.newPage();

    await page.goto("https://listado.mercadolibre.com.pe/bicicletas#D[A:bicicletas]", {
      waitUntil: "domcontentloaded",
      timeout: 20000
    });

    // espera a que carguen los ítems
    await page.waitForSelector("li.ui-search-layout__item", { timeout: 10000 });

    // extraer títulos de los productos
    const items = await page.$$("li.ui-search-layout__item");
    for (const item of items) {
      const titleEl = await item.$("h3");
      if (titleEl) {
        const text = await titleEl.innerText();
        titles.push(text);
      }
    }

    context.res = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: {
        total: titles.length,
        productos: titles
      }
    };

  } catch (err) {
    context.log.error("Error en la función:", err);

    context.res = {
      status: 500,
      headers: { "Content-Type": "application/json" },
      body: {
        error: "Ocurrió un error al procesar la solicitud",
        details: err.message
      }
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
