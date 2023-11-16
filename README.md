# streetwear-scraper
Data Scraper de loja de roupas usando Puppeteer para disciplina de Tópicos Especiais em Gerência de Dados (INE5454 UFSC). O scraper extrai dados da categoria camisetas de 4 sites distintos. A biblioteca Puppeteer foi escolhida pela facilidade para instanciar um "headless browser", que permite o carregamento de todos os dados da página antes de fazer a raspagem. 

Foram adotadas duas estratégias para lidar com a paginação de dados. Os sites dust e bolovo possuem rolamento infinito, então foi criada uma função para fazer o rolamento até o final da página para carregar todos os produtos. Já nos sites baw e fuss, as primeiras 3 páginas de cada site foram varridas.

## Para executar o scraper
1. Instale Node.js
2. Clone este repositório
3. Navegue para o diretório do projeto
3. Instale as dependências do projeto, execute ```npm i``` no diretório raiz do projeto
4. Execute ```node ./index.js``` no diretório raiz do projeto
5. Veja o dataset criado em ```scraping_dataset.json``` na pasta raiz

## Integrantes
1. Gabriel Andrade Borges Nascimento
2. Martina Klippel Brehm