


// Função para adicionar máscara ao campo de CEP
function formatarCEP(cep) {
    // Remove qualquer caractere que não seja dígito
    cep = cep.replace(/\D/g, '');
    
    // Adiciona a máscara XXXXX-XXX ao CEP
    cep = cep.replace(/^(\d{5})(\d{3})/, "$1-$2");

    return cep;
}

// Seleciona o elemento do campo de entrada do CEP
const inputCEP = document.getElementById('cepEnvio');

// Adiciona um ouvinte de evento de entrada ao campo de entrada do CEP
inputCEP.addEventListener('input', function() {
    // Obtém o valor atual do campo de entrada do CEP
    let valorCEP = this.value;
    
    // Aplica a máscara ao valor do CEP
    valorCEP = formatarCEP(valorCEP);
    
    // Define o valor formatado de volta ao campo de entrada do CEP
    this.value = valorCEP;
});

// Automatizar UF 
document.getElementById('cepEnvio').addEventListener('input', function() {
    // Recupera o valor do CEP
    let cep = this.value;
    
    // Mapeamento de faixas de CEP para cada UF
    const faixasCEP = {
        "AC": ["69900", "69999"],
        "AL": ["57000", "57999"],
        "AP": ["68900", "68999"],
        "AM": ["69000", "69299"],
        "BA": ["40000", "48999"],
        "CE": ["60000", "63999"],
        "DF": ["70000", "73699"],
        "ES": ["29000", "29999"],
        "GO": ["72800", "76799"],
        "MA": ["65000", "65999"],
        "MT": ["78000", "78899"],
        "MS": ["79000", "79999"],
        "MG": ["30000", "39999"],
        "PA": ["66000", "68899"],
        "PB": ["58000", "58999"],
        "PR": ["80000", "87999"],
        "PE": ["50000", "56999"],
        "PI": ["64000", "64999"],
        "RJ": ["20000", "28999"],
        "RN": ["59000", "59999"],
        "RS": ["90000", "99999"],
        "RO": ["76800", "76999"],
        "RR": ["69300", "69399"],
        "SC": ["88000", "89999"],
        "SP": ["01000", "19999"],
        "SE": ["49000", "49999"],
        "TO": ["77000", "77999"]
    };

    // Verifica em qual UF o CEP se encaixa
    let uf = Object.keys(faixasCEP).find(uf => {
        let faixa = faixasCEP[uf];
        return cep >= faixa[0] && cep <= faixa[1];
    });

    // Se encontrou a UF, seleciona no dropdown
    if (uf) {
        document.getElementById('ufEnvio').value = uf;
    } else {
        document.getElementById('ufEnvio').value = ''; // Caso não esteja em nenhuma faixa, seleciona "Selecione..."
    }
});

// Função para adicionar um novo campo de produto
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('adicionarProduto').addEventListener('click', adicionarProduto);
});

function adicionarProduto() {
    const containerProdutos = document.getElementById('produtos');
    const numeroProduto = containerProdutos.children.length + 1;
    const divProduto = document.createElement('div');
    divProduto.classList.add('produto', 'g-4', 'pb-3', 'pt-3');
    divProduto.setAttribute('id', `produto${numeroProduto}`);
    divProduto.innerHTML = `
    <div class="d-flex d-flex-column gap-2 align-items-center">
        <input type="text" class="form-control bg-secondary text-white border-secondary" name="nomedoproduto" placeholder="Nome do Produto">
        <input type="text" class="form-control bg-secondary text-white border-secondary" name="brand" placeholder="Marca">
        <input type="number" class="form-control bg-secondary text-white border-secondary" name="quantidade" placeholder="Quantidade">
        <input type="number" class="form-control bg-secondary text-white border-secondary" name="valorunitario" placeholder="Valor Unitário">
        <span class="totalProduto invisible" style="display:none" id="vTotal">0</span>
        <span type="button" onclick="removerProduto('produto${numeroProduto}')"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff" class="bi bi-trash3" viewBox="0 0 16 16">
        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
      </svg></span>
        </div>
    `;
    containerProdutos.appendChild(divProduto);
        // Adicionando event listeners para calcular o total do produto automaticamente
        const inputs = divProduto.querySelectorAll('input[placeholder="Quantidade"], input[placeholder="Valor Unitário"]');
        inputs.forEach(input => {
            input.addEventListener('input', calcularTotalProduto);
        });
}

function removerProduto(idProduto) {
    const produto = document.getElementById(idProduto);
    produto.parentNode.removeChild(produto);
}


// Função para calcular o total de cada produto e atualizar o subtotal geral
function calcularTotalProduto() {
    const produtos = document.querySelectorAll('.produto');
    let subtotal = 0;
    produtos.forEach(produto => {
        const quantidade = produto.querySelector('input[placeholder="Quantidade"]').value || 0;
        const valorUnitario = produto.querySelector('input[placeholder="Valor Unitário"]').value || 0;
        const total = quantidade * valorUnitario;
        produto.querySelector('.totalProduto').textContent = total.toFixed(2);
        subtotal += total;
    });
    document.getElementById('subtotal').textContent = `Subtotal: ${subtotal.toFixed(2)}`;
}

// Adiciona um botão e evento para adicionar produtos
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('adicionarProduto').addEventListener('click', adicionarProduto);
});

// Função para tratar o upload de arquivo PDF
function tratarUploadFichaTecnica() {
    const inputArquivo = document.getElementById('fichaTecnicaArquivo');
    inputArquivo.addEventListener('change', function(event) {
        const arquivo = event.target.files[0];
        if (!arquivo) {
            console.log('Nenhum arquivo selecionado');
            return;
        }
        // Aqui você pode implementar o que fazer com o arquivo, como lê-lo ou enviá-lo a um servidor
        console.log('Arquivo selecionado:', arquivo.name);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    tratarUploadFichaTecnica();
});
// Função Prazos
function exibirCamposPrazos() {
    document.getElementById('prazoFabricacaoCheck').addEventListener('change', function() {
        document.getElementById('prazoFabricacao').style.display = this.checked ? 'block' : 'none';
    });

    document.getElementById('prazoEntregaCheck').addEventListener('change', function() {
        document.getElementById('prazoEntrega').style.display = this.checked ? 'block' : 'none';
    });

    document.getElementById('observacaoCheck').addEventListener('change', function() {
        document.getElementById('observacao').style.display = this.checked ? 'block' : 'none';
    });
}

document.addEventListener('DOMContentLoaded', exibirCamposPrazos);


document.addEventListener('DOMContentLoaded', function() {
    // Event listener para o botão de imprimir
    document.getElementById('botaoImprimir').addEventListener('click', function(event) {
        event.preventDefault(); 
        console.log('Botão imprimir clicado');
        coletarDadosDoFormulario();
    });

function coletarDadosDoFormulario() {
    // Criar um novo FormData
    
        // Certifique-se de que 'formularioOrcamento' seja uma string que corresponde ao ID do seu formulário
        const formData = new FormData(document.getElementById('formularioOrcamento'));
        const objeto = {};
        formData.forEach((value, key) => {
            // Se o objeto já contém a chave, transforma o valor dessa chave em um array
            if (objeto.hasOwnProperty(key)) {
                // Se já é um array, adiciona o valor a ele
                if (Array.isArray(objeto[key])) {
                    objeto[key].push(value);
                } else {
                    // Se não é um array, transforma em um e adiciona o novo valor
                    objeto[key] = [objeto[key], value];
                }
            } else {
                // Se a chave ainda não existe no objeto, simplesmente adiciona o valor
                objeto[key] = value;
            }
        });

        // Inclui dados baseados no tipo de cliente
        if (objeto.tipocliente === 'pf') {
            objeto.dadosCliente = {
                cpfcliente: objeto.cpfcliente,
                nomecliente: objeto.nomecliente
            };
        } else if (objeto.tipocliente === 'pj') {
            objeto.dadosCliente = {
                cnpjcliente: objeto.cnpjcliente,
                razaosocial: objeto.razaosocial
            };
        }

        ['cpfcliente', 'nomecliente', 'cnpjcliente', 'razaosocial'].forEach(key => delete objeto[key]);

    function extrairValoresTotais() {
        const TotalPriceElements = document.querySelectorAll('.totalProduto');
        const valoresTotais = [];
    
        TotalPriceElements.forEach(element => {
            // Verifica se o texto do elemento não está vazio
            if (element.textContent.trim() !== '') {
                // Converte o texto para número e adiciona à lista de valores totais
                valoresTotais.push(parseFloat(element.textContent.trim()));
            }
        });
    
        return valoresTotais;
    }

    // Coleta de Dados do Pagamento
    document.addEventListener('DOMContentLoaded', function() {
        const selectFormaPagamento = document.getElementById('formaPagamento');
        if (selectFormaPagamento) {
            selectFormaPagamento.addEventListener('change', extrairDetalhesPagamento);
        }
    });
    function extrairDetalhesPagamento() {
        const formaPagamento = document.getElementById('formaPagamento').value;
        let detalhesPagamentoJSON = {}; // Objeto para armazenar os detalhes de pagamento em JSON
        if (formaPagamento === 'deposito') {
            detalhesPagamentoJSON = {
                agencia: '3756',
                conta: '0422239-3',
                banco: 'Bradesco',
                chave: 'financeiro@espacocadeiraderodas.com.br'
            };
        } else if (formaPagamento === 'pix') {
            detalhesPagamentoJSON = {
                pix: 'financeiro@espacocadeiraderodas.com.br'
            };
        } else if (formaPagamento === 'cartao') {
            detalhesPagamentoJSON = {
                cartao: 'Cartão de Crédito'
            };
        }
    
        return detalhesPagamentoJSON;
    }

   objeto.detalhesPagamentoJSON = extrairDetalhesPagamento(); // Chama a função no momento de preparar o objeto
// console.log("Pagamento:", objeto); // Para debugar

   objeto.valorestotais = extrairValoresTotais();
    
   const json = JSON.stringify(objeto);
   console.log("JSON a ser enviado:", json); // Para debugar
   // 3. Abrir uma nova janela para exibir o modelo e imprimir
    
enviarDadosParaNodeJS(json);
}

function enviarDadosParaNodeJS(json) {
    console.log('Enviando dados para o Node.js:', json);
    fetch('/imprimir', {
        method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept-Encoding': 'gzip, compress, br'
  },
  body: json,
})
.then(response => {
  if (!response.ok) {
    throw new Error('Falha na requisição: ' + response.statusText);
  }
  return response.json(); // Converte a resposta para JSON
})
.then(data => {
    console.log('Resposta do servidor:', data);
    if (data.mensagens && data.mensagens.length > 0) {
      data.mensagens.forEach(msg => {
        console.log(msg.mensagem);
        if (msg.erro) console.error(msg.erro);
      });
    }
  })
.catch(error => console.error('Erro na requisição:', error));
}
});



  



