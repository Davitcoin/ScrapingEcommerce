const puppeteer = require('puppeteer');

(async () => {
  // Launch the browser
  const browser = await puppeteer.launch();

  // Create a page
  const page = await browser.newPage();

  // Go to your site
  await page.goto('Insert.web.site_here');

  // Esperar a que se carguen completamente los productos
  await page.waitForSelector('.c-recommended-strip__products-container');

  // Extraer la información de los productos
  const products = await page.$$eval('.c-recommended-strip__products-container .c-product-card-simple', tiles => {
    return tiles.map(tile => {
      const title = tile.querySelector('.cpx-truncated').textContent.trim();
      const price = tile.querySelector('.cpx-text--price-to').textContent.trim();
      const image = tile.querySelector('.c-product-pic-simple__img').src;
      const link = tile.querySelector('.c-product-card-simple__product-block a').href;
      return { title, price, image, link };
    });
  });

  // Imprimir la información de los productos
  console.log('Información de los productos:');
  console.log(products);

  // Close browser.
  await browser.close();
})();
