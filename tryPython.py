from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)  # Usa headless=False para ver lo que hace
    page = browser.new_page()
    page.goto("https://listado.mercadolibre.com.pe/bicicletas#D[A:bicicletas]")

    # Esperamos a que cargue bien la lista de productos
    page.wait_for_selector("li.ui-search-layout__item")

    # Seleccionamos cada producto
    items = page.query_selector_all("li.ui-search-layout__item")
    
    for item in items:
        title_el = item.query_selector("h3")  # Puedes afinar más si es necesario
        if title_el:
            title = title_el.inner_text()
            print(title)

    browser.close()
