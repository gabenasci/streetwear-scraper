const fs = require('fs').promises

const puppeteer = require('puppeteer');

async function sleep(ms) {
  return await new Promise(resolve => setTimeout(resolve, ms))
}

function formatPrice(price) {
  const match = price.match(/R\$ (\d+,\d+)/);
  if (match && match[1]) {
    const formattedPrice = `R$ ${match[1]}`;
    return formattedPrice;
  }

}

const clothingStoreUrls = {
  bolovo: 'https://www.bolovo.com.br/camisetas',
  baw: 'https://www.bawclothing.com.br/baw/vestuario/partes-de-cima/camisetas?page=',
  dust: 'https://www.thedustcompany.com.br/categoria/camisetas/',             
  fuss: 'https://fusscompany.com.br/collections/camisetas?page='
}

async function scrapeBaw(url) {
  try {
    const browser = await puppeteer.launch({headless: "new"});
    console.log("Criando uma nova página");
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000);
    let bawProducts = [];
    
    for (let pageNumber = 1; pageNumber <= 34; pageNumber++) {
      console.log("Navegando para url: " + url+pageNumber);
      await sleep(3000);
      await page.goto(url+pageNumber);
      console.log("Carregando página...")
      await sleep(10000);

      const productCardElements = await page.$$('a.bawclothing-product-0-x-customProductSummaryClearLink');
      console.log("Extraindo dados...");
      for (const productCardElement of productCardElements) {
        const productUrl = await productCardElement.evaluate(a => a.href);

        const productImageElement = await productCardElement.$('.vtex-product-summary-2-x-image');
        const productImage = await productImageElement.evaluate(img => img.src)  
        
        const productTitleElement = await productCardElement.$('h3 > span');
        const productTitle = await productTitleElement.evaluate(node => node.textContent);
        
        const productPriceElement = await productCardElement.$('.vtex-product-price-1-x-sellingPrice');
        const productPrice = await productPriceElement.evaluate(node => node.textContent);
        
        const productInstallmentsElement = await productCardElement.$('.vtex-product-price-1-x-installments');
        let productInstallments = null;
        if (productInstallmentsElement) {
          productInstallments = await productInstallmentsElement.evaluate(node => node.textContent);
          productInstallments = productInstallments.slice(0, -2);
          console.log(productInstallments);
        } else { productInstallments = '1x de '+ productPrice}
        
        const product = {
          title: productTitle,
          image: productImage,
          price: productPrice,
          installments: productInstallments,
          url: productUrl
        };
        bawProducts.push(product);
      }
    }
    
    console.log(bawProducts);
    return bawProducts;
    
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

async function scrapeDust(url) {
  try {
    const browser = await puppeteer.launch({headless: "new"});
    console.log("Criando uma nova página")
    const page = await browser.newPage();

    console.log("Navegando para url: " + url)
    await page.goto(url);

    console.log("Carregando todos os produtos...")

    await page.evaluate(async () => {
      let scrollPosition = 0
      let documentHeight = document.body.scrollHeight
      let page = 0
      while (documentHeight > scrollPosition) {
        
        window.scrollBy(0, documentHeight)
        await new Promise(resolve => {
          setTimeout(resolve, 3000)
          console.log("Página "+page+++" carregada")
        })
        scrollPosition = documentHeight
        documentHeight = document.body.scrollHeight
      }
    })
    
    let dustProducts = []
    const productCardElements = await page.$$('div.product-item-body');
    console.log("Extraindo dados...");
    let productCount = 0;
    for (const productCardElement of productCardElements) {
      productCount++
      await sleep(1000);
      const productUrlElement = await productCardElement.$('figure > a');
      const productUrl = await productUrlElement.evaluate(a => a.href);
      console.log(productUrl)

      const productImageElement = await productUrlElement.$('img.second');
      const productImage = await productImageElement.evaluate(img => img.src);
      console.log(productImage);

      const productTitleElement = await productCardElement.$('figcaption > div > a > h2');
      const productTitle = await productTitleElement.evaluate(node => node.textContent);
      // console.log(productTitle)

      const productPriceElement = await productCardElement.$('figcaption > div.section > div > div.container_general > span > span');
      const productPrice = await productPriceElement.evaluate(node => node.textContent);
      // const formattedPrice = formatPrice(productPrice)
      console.log(productPrice)

      const productInstallmentsElement = await productCardElement.$('figcaption > div.section > div > div.container_general > span.card');
      let productInstallments = await productInstallmentsElement.evaluate(node => node.textContent);
      productInstallments = productInstallments.slice(3);

      const product = {
        title: productTitle,
        image: productImage,
        price: productPrice,
        installments: productInstallments,
        url: productUrl
      }
      dustProducts.push(product);
      if (productCount == 47) {
        break;
      }
    }

    console.log(dustProducts)
    return dustProducts

  } catch (error) {
      console.error('Error:', error)
      return []
  }
}

async function scrapeFuss(url) {
  try {
    const browser = await puppeteer.launch({headless: "new"});
    console.log("Criando uma nova página")
    const page = await browser.newPage();
    let fussProducts = []

    for (let pageNumber = 1; pageNumber <= 2; pageNumber++) {

      console.log("Navegando para url: " + url + pageNumber)
      await page.goto(url+pageNumber);
  
      console.log("Carregando todos os produtos...")
  
      const productCardElements = await page.$$('div.product');
  
      for (const productCardElement of productCardElements) {
        const productUrlElement = await productCardElement.$('div > a.product__image-wrapper')
        const productUrl = await productUrlElement.evaluate(a => a.href);
        // console.log(productUrl)

        const productImageElement = await productCardElement.$('div > img.product__image');
        const productImage = await productImageElement.evaluate(img => img.src)
        // console.log(productImage)
  
        const productTitleElement = await productCardElement.$('div.product__title > a');
        const productTitle = await productTitleElement.evaluate(node => node.textContent);
        // console.log(productTitle)
  
        const productPriceElement = await productCardElement.$('div.product__prices > span.product__price');
        const productPrice = await productPriceElement.evaluate(node => node.textContent);
        const formattedPrice = formatPrice(productPrice)

        let productInstallments = await productPriceElement.evaluate(node => node.textContent);
        productInstallments = formatPrice(productInstallments) + ' em 1x'

        const product = {
          title: productTitle,
          image: productImage,
          price: formattedPrice,
          installments: productInstallments,
          url: productUrl
        }
        fussProducts.push(product);
      }
      
    }
    console.log(fussProducts)
    return fussProducts

  } catch (error) {
      console.error('Error:', error)
      return []
  }  
}

async function scrapeBolovo(url) {
  try {
    const browser = await puppeteer.launch({headless: "new"});
    console.log("Criando uma nova página")
    const page = await browser.newPage();

    console.log("Navegando para url: " + url)
    await page.goto(url);

    console.log("Carregando a página...")
    await page.evaluate(async () => {
      let scrollPosition = 0
      let documentHeight = document.body.scrollHeight
      while (documentHeight > scrollPosition) {
        window.scrollBy(0, documentHeight)
        await new Promise(resolve => {
          setTimeout(resolve, 3000)
        })
        scrollPosition = documentHeight
        documentHeight = document.body.scrollHeight
      }
    })

    const productCardElements = await page.$$('div.product-block');
    let bolovoProducts = [];
    console.log("Extraindo dados...");
    for (const productCardElement of productCardElements) {
      const productUrlElement = await productCardElement.$('div.images > a');
      const productUrl = await productUrlElement.evaluate(a => a.href);
      console.log(productUrl)

      const productImageElement = await productUrlElement.$('figure > img');
      const productImage = await productImageElement.evaluate(img => img.src || img.srcset)
      // console.log(productImage)

      const productTitleElement = await productCardElement.$('div.text > p.title');
      const productTitle = await productTitleElement.evaluate(node => node.textContent);
      // console.log(productTitle)

      const productPriceElement = await productCardElement.$('.price-pt-br');
      const productPrice = await productPriceElement.evaluate(node => node.textContent);
      const formattedPrice = productPrice.trim();

      let productInstallments = await productPriceElement.evaluate(node => node.textContent);
      productInstallments = formattedPrice + ' em 1x'


      const product = {
        title: productTitle,
        image: productImage,
        price: formattedPrice,
        installments: productInstallments,
        url: productUrl
      }
      bolovoProducts.push(product);
    }

    console.log(bolovoProducts)
    return bolovoProducts

  } catch (error) {
      console.error('Error:', error)
      return []
  }
}
(async () => {
  console.log("Scraping site [1/4]")
  const dustProducts = await scrapeDust(clothingStoreUrls.dust)
  
  console.log("Scraping site [2/4]")
  const bawProducts = await scrapeBaw(clothingStoreUrls.baw)
  
  console.log("Scraping site [3/4]")
  const fussProducts = await scrapeFuss(clothingStoreUrls.fuss)

  console.log("Scraping site [4/4]")
  const bolovoProducts = await scrapeBolovo(clothingStoreUrls.bolovo)
  

  const scrapingReport = {
    dust: dustProducts,
    baw: bawProducts,
    fuss: fussProducts,
    bolovo: bolovoProducts,
  };

  // console.log(scrapingReport);

  try {
    await fs.writeFile('scraping_dataset.json', JSON.stringify(scrapingReport, null, 2));
    console.log('Dataset salvo em scraping_dataset.json');
  } catch (error) {
    console.error('Erro ao salvar o arquivo.', error);
  }


})()