const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // Defina 'headless: true' para não abrir o navegador graficamente
  const page = await browser.newPage();

  // Acesse a página da sua aplicação
  await page.goto('http://localhost:3000');

  // Preenche os campos do formulário (ajuste os seletores conforme necessário)
  await page.waitForSelector('#dataOrcamento', { visible: true });
  await page.type('#dataOrcamento', '2024-02-27');
  await page.waitForSelector('#validadeOrcamento', { visible: true });
  await page.type('#validadeOrcamento', '2024-02-29');
  await page.waitForSelector('#validadeOrcamento', { visible: true });
  await page.type('#nomeCliente', 'Lucas de Matos Vieira');
  await page.waitForSelector('#validadeOrcamento', { visible: true });
  await page.type('#cpfCliente', '70754266133');
  await page.waitForSelector('#adicionarProduto', { visible: true });
  await page.click('#adicionarProduto');
  await page.waitForSelector('input[placeholder="Nome do Produto"]', { visible: true });
  await page.type('input[placeholder="Nome do Produto"]', 'D100');
  await page.waitForSelector('input[placeholder="Marca"]', { visible: true });
  await page.type('input[placeholder="Marca"]', 'Dellamed');
  await page.waitForSelector('input[placeholder="Quantidade"]', { visible: true });
  await page.type('input[placeholder="Quantidade"]', '30');
  await page.waitForSelector('input[placeholder="Valor Unitário"]', { visible: true });
  await page.type('input[placeholder="Quantidade"]', '400');

  // Repita para os outros campos...
  // Capturar a requisição POST e a resposta
  page.on('request', request => {
    if (request.method() === 'POST') {
      console.log('Dados enviados:', request.postData());
    }
  });

  page.on('response', async response => {
    if (response.request().method() === 'POST') {
      console.log('Status da Resposta:', response.status());
      const responseBody = await response.json().catch(e => 'Response is not JSON');
      console.log('Resposta recebida:', responseBody);
    }
  });

  // Clicar no botão que dispara a requisição POST
  await page.click('#botaoImprimir'); // Substitua pelo seletor correto do seu botão

  // Criar um atraso usando JavaScript puro
  await new Promise(resolve => setTimeout(resolve, 10000)); // Ajuste o tempo de espera conforme necessário

  // Fechar o navegador
  await browser.close();
})();