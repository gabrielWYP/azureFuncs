const { chromium } = require("playwright");

module.exports = async function (context, req) {
  context.log("HTTP trigger function processed a request.");

  let titles = [];
  let browser;

  try {
    browser = await chromium.launch({ headless: true }); // en serverless siempre headless
    const page = await browser.newPage();

    await page.goto("https://listado.mercadolibre.com.pe/bicicletas#D[A:bicicletas]");

    // espera a que carguen los ítems
    await page.waitForSelector("li.ui-search-layout__item", { timeout: 10000 });

    // extraer los títulos de los productos
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
      headers: { "Content-Type": "text/plain" },
      body: titles.length > 0 ? titles.join("\n") : "No se encontraron productos"
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
