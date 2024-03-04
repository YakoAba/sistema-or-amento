const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const { log } = require("console");
const sqlite3 = require("sqlite3").verbose();
const sqliteWeb = require('sqlite-web');

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Inicializar o middleware do SQLite Web
app.use('/sqlite', sqliteWeb(db));

// Antes da rota que está recebendo a requisição
app.use((req, res, next) => {
  console.log(`Recebida requisição ${req.method} em ${req.url}`);
  next(); // Certifique-se de chamar next() para passar a requisição para a próxima middleware ou rota
});

app.use((req, res, next) => {
  if (req.path.endsWith(".html")) {
    const newPath = req.path.slice(0, -5);
    return res.redirect(301, newPath);
  }
  next();
});

app.get("/imprimir", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/imprimir.html"));
});

app.get("/layout", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/layout.html"));
});

app.post("/imprimir", async (req, res) => {
  try {
    // Extrair os dados recebidos no corpo da requisição
    const dados = req.body;
    console.log("Dados recebidos no servidor:", dados);
    let logs = {
      status: "sucesso",
      dadosRecebidos: dados,
      mensagens: [],
      id: null,
    };

    const db = new sqlite3.Database(
      "./preorcamento.db",
      sqlite3.OPEN_READWRITE,
      async (err) => {
        if (err) {
          console.error("Erro ao conectar ao banco de dados:", err);
          logs.mensagens.push({
            mensagem: "Falha ao conectar ao banco de dados",
            erro: err.message,
          });
          // Envie a resposta aqui dentro se a conexão falhar
          res.status(500).json(logs);
        } else {
          console.log("Conectado ao banco de dados SQLite com sucesso.");
          logs.mensagens.push({
            mensagem: "Conectado ao banco de dados SQLite com sucesso",
          });

          // Implemente a lógica de manipulação do banco de dados aqui
          const dadosSerializados = {
            ...dados,
            dataorcamento: dados.dataoorcamento || null,
            validadeorcamento: dados.validadeorcamento || null,
            numerorcamento: dados.numeroorcamento || null,
            dadosorcamento: JSON.stringify(dados.dadosorcamento || []),
            nomedoproduto:  dados.nomedoproduto || null,
            brand: JSON.stringify(dados.brand || []),
            quantidade: JSON.stringify(dados.quantidade || []),
            valorunitario: JSON.stringify(dados.valorunitario || []),
            valorestotais: JSON.stringify(dados.valorestotais || []),
            dadosCliente: JSON.stringify(dados.dadosCliente || {}),
            detalhesPagamento: JSON.stringify(dados.detalhesPagamento || {}),
            filepdf: JSON.stringify(dados.filepdf || {}), // Assumindo que você deseja armazenar isso como JSON também
          };

          // Definir a consulta SQL para inserir os dados
          const sql = `INSERT INTO orcamentos (data_orcamento, validade_orcamento, numero_orcamento, tipo_cliente, dados_cliente, nome_produto, marca_produto, quantidade, valor_unitario, valor_total_produto, ficha_tecnica, ficha_tecnica_arquivo, prazo_fabricacao, prazo_entrega, forma_envio, cep_envio, uf_envio, valor_frete, forma_pagamento, detalhes_pagamento, ultimonumero_orcamento) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
          db.run(
            sql,
            [
              dadosSerializados.dataoorcamento, // Correspondente a `data_orcamento`
              dadosSerializados.validadeorcamento, // Correspondente a `validade_orcamento`
              dadosSerializados.numerorcamento,
              dadosSerializados.dadosCliente, // Correspondente a `dados_cliente`
              dadosSerializados.nomedoproduto, // Correspondente a `nomedoproduto`
              dadosSerializados.brand, // Correspondente a `brand`
              dadosSerializados.quantidade, // Correspondente a `quantidade`
              dadosSerializados.valorunitario, // Correspondente a `valor_unitario`
              dadosSerializados.valorestotais, // Correspondente a `valor_total`
              dadosSerializados.fichatecnica, // Correspondente a `ficha_tecnica`
              dadosSerializados.filepdf, // Correspondente a `filepdf`
              dadosSerializados.prazofabricar, // Correspondente a `prazo_fabricacao`
              dadosSerializados.prazoentrega, // Correspondente a `prazo_entrega`
              dadosSerializados.observacaoprazo, // Correspondente a `observacao_prazo`
              dadosSerializados.formadeenvio, // Correspondente a `forma_envio`
              dadosSerializados.cep, // Correspondente a `cep`
              dadosSerializados.unidadefederativa, // Correspondente a `uf_envio`
              dadosSerializados.valorfrete, // Correspondente a `valor_frete`
              dadosSerializados.formapagamento, // Correspondente a `forma_pagamento`
              dadosSerializados.detalhesPagamento, // Correspondente a `detalhes_pagamento`
              // Certifique-se de incluir os valores para quaisquer outros campos que você tenha na sua tabela
            ],
            async function (err) {
              if (err) {
                console.error("Erro ao executar consulta SQL:", err.message);
                // Aqui, você deve tratar o erro, talvez enviando uma resposta HTTP indicando falha
                res.status(500).json({ error: "Erro interno do servidor" });
              } else {
                console.log("Inserção bem-sucedida");
                // Aqui, você pode enviar uma resposta HTTP de sucesso, se necessário
                logs.id = this.lastID;
                res.status(200).json(logs);
              }
            }
          );
        }
      }
    );
    db.close();
  } catch (error) {
    console.error("Erro durante o processamento da requisição:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Rota para consultar um orçamento pelo ID
app.get("/orcamento/:id", async (req, res) => {
  // Extrair o ID do parâmetro da URL
  const id = req.params.id;
  console.log("Dados recebidos no servidor:", id);
  let logs = {
    status: "sucesso",
    mensagens: [],
    id: id,
  };
  //  res.status(200).json(logs);
  const db = new sqlite3.Database(
    "./preorcamento.db",
    sqlite3.OPEN_READWRITE,
    async (err) => {
      if (err) {
        console.error("Erro ao conectar ao banco de dados:", err);
        logs.mensagens.push({
          mensagem: "Falha ao conectar ao banco de dados",
          erro: err.message,
        });
        // Envie a resposta aqui dentro se a conexão falhar
        res.status(500).json(logs);
      } else {
        console.log("Conectado ao banco de dados SQLite com sucesso.");
        logs.mensagens.push({
          mensagem: "Conectado ao banco de dados SQLite com sucesso",
        });
        // Definir a consulta SQL para inserir os dados
        const sql = `SELECT * FROM orcamentos WHERE rowid = ?`;

        // Executar a consulta SQL para selecionar o orçamento pelo ID
        db.all(sql, [id], (err, rows) => {
          if (err) {
            console.log("consulta ao banco de dados SQLite com erro.");
            logs.mensagens.push({
              mensagem: err,
            });
            res.status(200).json(logs);
          } else {
            console.log("consulta ao banco de dados SQLite com sucesso.");
            logs.mensagens.push({
              mensagem: "consulta ao banco de dados SQLite com sucesso.",
            });
            logs.dados = rows;
          //  console.log(logs.dados)
          res.status(200).json(logs);
          }
        });       
      }
    }
  );
  db.close();
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public/assets")));

app.get("/component_client", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/models/component_client.js"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor Node.js rodando na porta ${PORT}`);
});
