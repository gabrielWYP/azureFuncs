import logging
import azure.functions as func
from playwright.sync_api import sync_playwright

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info("Python HTTP trigger function processed a request.")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)  # headless=True en serverless
        #Comment to try
        page = browser.new_page()
        page.goto("https://listado.mercadolibre.com.pe/bicicletas#D[A:bicicletas]")

        page.wait_for_selector("li.ui-search-layout__item")
        items = page.query_selector_all("li.ui-search-layout__item")
        
        titles = []
        for item in items:
            title_el = item.query_selector("h3")
            if title_el:
                titles.append(title_el.inner_text())

        browser.close()

    return func.HttpResponse("\n".join(titles), mimetype="text/plain")