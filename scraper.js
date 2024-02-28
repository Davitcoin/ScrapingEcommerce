const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

(async () => {
  // Launch the browser
  const browser = await puppeteer.launch();

  // Create a page
  const page = await browser.newPage();

  // Go to your site
  await page.goto('https://www.abasteo.mx/');

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

  // Crear un directorio para las imágenes
  const imageDir = path.join(__dirname, 'product_images');
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir);
  }

  // Descargar las imágenes de los productos
  for (const product of products) {
    const imageName = `${product.title.replace(/\s+/g, '_').toLowerCase()}.jpg`;
    const imagePath = path.join(imageDir, imageName);
    const imageResponse = await axios.get(product.image, { responseType: 'stream' });
    imageResponse.data.pipe(fs.createWriteStream(imagePath));

  //Json File

  // Crear un directorio para el archivo JSON
    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
    }

    // Ruta del archivo JSON de salida
    const jsonFilePath = path.join(outputDir, 'products.json');

    // Escribir la información de los productos en el archivo JSON
    fs.writeFileSync(jsonFilePath, JSON.stringify(products, null, 2));

console.log(`Información de los productos guardada en: ${jsonFilePath}`);

    console.log(`Imagen descargada: ${imageName}`);
  }

  // Close browser.
  await browser.close();
})();
