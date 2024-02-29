// Adiciona as máscaras aos campos de CPF e CNPJ
document.addEventListener('DOMContentLoaded', function() {
    const tipoClienteElement = document.getElementById('tipoCliente');
    const dadosClienteContainer = document.getElementById('dadosCliente');

    function atualizarCamposCliente() {
        dadosClienteContainer.innerHTML = '';
        if (tipoClienteElement.value === 'pf') {
            dadosClienteContainer.innerHTML = `
                <div class="form-group mt-3 mb-3">
                    <label for="cpfCliente" class="text-white mb-2">CPF</label>
                    <input type="text" class="form-control bg-secondary border border-secondary text-white" id="cpfCliente" name="cpfcliente" placeholder="Digite o CPF">
                </div>
                <div class="form-group mt-3 mb-3">
                    <label for="nomeCliente" class="text-white mb-2">Nome Completo</label>
                    <input type="text" class="form-control bg-secondary border border-secondary text-white" id="nomeCliente" name="nomecliente" placeholder="Nome completo">
                </div>`;
        } else if (tipoClienteElement.value === 'pj') {
            dadosClienteContainer.innerHTML = `
                <div class="form-group">
                    <label for="cnpjCliente">CNPJ:</label>
                    <input type="text" class="form-control mb-2 bg-secondary border border-secondary text-white" name="cnpjcliente" id="cnpjCliente" placeholder="CNPJ">
                </div>
                <div class="form-group">
                    <label for="razaoSocialCliente">Razão Social:</label>
                    <input type="text" class="form-control mb-2 bg-secondary border border-secondary text-white" name="razaosocial" id="razaoSocialCliente" placeholder="Razão Social">
                </div>`;
        }
    }

    tipoClienteElement.addEventListener('change', atualizarCamposCliente);
    atualizarCamposCliente();

    // Delegação de eventos para captura de dados
    dadosClienteContainer.addEventListener('input', function(event) {
        const id = event.target.id;
        if (id === 'cpfCliente' || id === 'nomeCliente' || id === 'cnpjCliente' || id === 'razaoSocialCliente') {
            // Aqui você pode atualizar o localStorage ou variáveis conforme necessário
            console.log(`${id}: ${event.target.value}`);
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    var inputCPF = document.getElementById('cpfCliente');

    // Adiciona um ouvinte de evento para cada tecla pressionada
    inputCPF.addEventListener('keydown', function(event) {
        var tecla = event.key;

        // Se a tecla for um número e o campo não estiver completo
        if (/^\d$/.test(tecla) && inputCPF.value.length < 14) {
            // Atualiza o valor do campo substituindo os sublinhados pelos números
            inputCPF.value += tecla;

            // Aplica a máscara de CPF ao valor atual do campo
            inputCPF.value = inputCPF.value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

            // Previne a ação padrão da tecla pressionada
            event.preventDefault();
        }
    });
});


