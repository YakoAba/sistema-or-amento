# Use uma imagem Node.js como base
FROM node:latest

# Crie e defina o diretório de trabalho no container
WORKDIR /usr/src/app

# Copie o package.json e o package-lock.json (se existir) para o diretório de trabalho
COPY package*.json ./

RUN npm install -g npm
# Instale as dependências do projeto
RUN npm install

# Instale o SQLite (você pode precisar adicionar outras dependências dependendo do seu projeto)
RUN apt-get update && apt-get install -y sqlite3

# Copie o restante dos arquivos do projeto para o diretório de trabalho
COPY . .

# Exponha a porta 3000 do container
EXPOSE 3000

# Comando para iniciar o servidor quando o contêiner for iniciado
CMD ["npm", "run", "start"]
