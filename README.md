# streetwear-scraper
Data Scraper de loja de roupas usando Puppeteer para disciplina de Tópicos Especiais em Gerência de Dados (INE5454 UFSC). O scraper extrai dados da categoria camisetas de 4 sites distintos. A biblioteca Puppeteer foi escolhida pela facilidade para instanciar um "headless browser", que permite o carregamento de todos os dados da página antes de fazer a raspagem. 

Foram adotadas duas estratégias para lidar com a paginação de dados. Os sites dust e bolovo possuem rolamento infinito, então foi criada uma função para fazer o rolamento até o final da página para carregar todos os produtos. Já nos sites baw e fuss, as primeiras 3 páginas de cada site foram varridas.

## Para executar o scraper
1. Instale Node.js
2. Baixe este repositório ```git clone https://github.com/gabenasci/streetwear-scraper.git```
3. Na pasta raíz do projeto, execute ```node ./index.js```
4. Veja o dataset criado em ```scraping_dataset.json``` na pasta raíz
