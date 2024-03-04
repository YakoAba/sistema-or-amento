
// Função para obter parâmetros de consulta da URL
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// // Obtém o valor do parâmetro 'json' da URL
// var jsonValue = getParameterByName("id");
// const json = JSON.parse(jsonValue);
// // Verifica se o valor do parâmetro 'json' foi encontrado
// if (jsonValue !== null) {
//   // Se sim, faça o que você precisa com o valor do parâmetro 'json'
//   console.log("Valor do parâmetro json:", jsonValue);
//   document.getElementById('orcamento_numero').innerHTML = "Orçamento Nº " + jsonValue;
//   await buscarOrcamentoPorId(jsonValue);
// } else {
//   console.log("Parâmetro json não encontrado na URL");
// }

// Define uma função assíncrona para envolver a chamada para buscarOrcamentoPorId
async function iniciarBuscaOrcamento() {
  try {
    const jsonValue = getParameterByName("id");
    if (jsonValue !== null) {
      console.log("Valor do parâmetro json:", jsonValue);
      const json = await buscarOrcamentoPorId(jsonValue);
      console.log(json)
      document.getElementById('orcamento_numero').innerHTML = "Orçamento Nº " + jsonValue;
      document.getElementById('Validade').innerHTML = new Date(json.dados[0].validade_orcamento).toLocaleDateString();
      document.getElementById('data').innerHTML = 'Aparecida de Goiânia, '+ new Date(json.dados[0].data_orcamento).toLocaleDateString();
      document.getElementById('frete').innerHTML = json.dados[0].valor_frete.toLocaleString(undefined, { style: 'currency', currency: 'BRL' });
      document.getElementById('envio').innerHTML = json.dados[0].forma_envio;
      document.getElementById('cep').innerHTML = json.dados[0].cep_envio;
      document.getElementById('uf_envio').innerHTML = json.dados[0].uf_envio;
      
    } else {
      console.log("Parâmetro json não encontrado na URL");
    }
  } catch (error) {
    console.error('Erro ao iniciar busca do orçamento:', error);
  }
}

async function buscarOrcamentoPorId(orcamentoId) {
  try {
    const response = await fetch(`/orcamento/${orcamentoId}`);
    if (response.ok) {
      // document.getElementById('Validade').innerHTML = response.validade_orcamento;
      return response.json();
    } else {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
  } catch (error) {
    throw new Error(`Erro na requisição: ${error.message}`);
  }
}

iniciarBuscaOrcamento();






