# SmartStudio Pro - Guia Completo de Instalação e Deploy

## 📊 Análise do Sistema

### Arquitetura
O SmartStudio Pro é uma aplicação full-stack composta por:

- **Backend**: Node.js + Express + SQLite
- **Frontend**: React + Vite + Tailwind CSS
- **Banco de Dados**: SQLite (arquivo local)
- **Comunicação**: REST API via Axios

### Estrutura do Projeto
```
smartstudio-pro/
├── backend/          # API REST (Node.js/Express)
│   ├── src/
│   │   ├── config/   # Configurações (DB, env)
│   │   ├── models/   # Modelos de dados
│   │   ├── controllers/ # Lógica de negócio
│   │   ├── routes/   # Rotas da API
│   │   └── middlewares/ # Middlewares
│   └── server.js     # Ponto de entrada
│
└── frontend/         # Interface React
    ├── src/
    │   ├── components/ # Componentes React
    │   ├── pages/      # Páginas da aplicação
    │   ├── services/   # Serviços de API
    │   └── utils/      # Utilitários
    └── vite.config.js  # Configuração Vite
```

### Tecnologias Utilizadas

**Backend:**
- Express.js 4.18.2
- SQLite3 5.1.6
- CORS 2.8.5
- dotenv 16.3.1
- date-fns 2.30.0

**Frontend:**
- React 18.2.0
- Vite 5.0.8
- Tailwind CSS 3.3.6
- React Router 6.20.0
- Recharts 2.10.3
- Axios 1.6.2

---

## 🚀 Passo a Passo Completo

### FASE 1: Pré-requisitos

#### 1.1 Instalar Node.js
- **Download**: https://nodejs.org/
- **Versão recomendada**: Node.js 18.x ou superior
- **Verificar instalação**:
```bash
node --version
npm --version
```

#### 1.2 Instalar Git (opcional, mas recomendado)
- **Download**: https://git-scm.com/
- **Verificar instalação**:
```bash
git --version
```

---

### FASE 2: Configuração Local (Desenvolvimento)

#### 2.1 Clonar/Baixar o Projeto
```bash
# Se você já tem o projeto localmente, pule esta etapa
cd C:\Users\david\OneDrive\Desktop\smartstudio-pro
```

#### 2.2 Configurar o Backend

**Passo 1: Navegar para a pasta do backend**
```bash
cd backend
```

**Passo 2: Instalar dependências**
```bash
npm install
```

**Passo 3: Criar arquivo .env**
```bash
# Windows PowerShell
Copy-Item .env.example .env

# Windows CMD
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

**Passo 4: Verificar/Editar .env**
O arquivo `.env` deve conter:
```env
PORT=3001
NODE_ENV=development
DB_PATH=./smartstudio.sqlite
```

**Passo 5: Verificar estrutura**
```bash
# Verificar se todos os arquivos estão presentes
dir src\config
dir src\models
dir src\controllers
dir src\routes
```

#### 2.3 Configurar o Frontend

**Passo 1: Navegar para a pasta do frontend**
```bash
cd ..\frontend
```

**Passo 2: Instalar dependências**
```bash
npm install
```

**Passo 3: Verificar configuração do Vite**
O arquivo `vite.config.js` já está configurado com proxy para o backend:
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:3001',
    changeOrigin: true
  }
}
```

---

### FASE 3: Executar em Desenvolvimento

#### 3.1 Iniciar o Backend

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Saída esperada:**
```
✅ Conectado ao banco de dados SQLite
🚀 SmartStudio Pro Backend rodando na porta 3001
📊 Ambiente: development
```

**Verificar funcionamento:**
- Abra o navegador em: http://localhost:3001/api/clients
- Deve retornar um array JSON (pode estar vazio inicialmente)

#### 3.2 Iniciar o Frontend

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Saída esperada:**
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

**Acessar aplicação:**
- Abra o navegador em: http://localhost:3000
- Você deve ver a tela de login/dashboard

#### 3.3 Testar Funcionalidades Básicas

1. **Dashboard**: Deve carregar estatísticas e gráficos
2. **Clientes**: Criar um cliente de teste
3. **Serviços**: Adicionar um serviço
4. **Agendamentos**: Criar um agendamento

---

### FASE 4: Build para Produção

#### 4.1 Build do Frontend

```bash
cd frontend
npm run build
```

**Saída esperada:**
- Pasta `dist/` será criada com os arquivos otimizados
- Verificar se `dist/index.html` existe

#### 4.2 Preparar Backend para Produção

**Criar arquivo .env de produção:**
```bash
cd backend
```

Editar `.env`:
```env
PORT=3001
NODE_ENV=production
DB_PATH=./smartstudio.sqlite
```

**Testar build do backend:**
```bash
npm start
```

---

### FASE 5: Deploy - Opções Disponíveis

## 🚢 OPÇÃO 1: Deploy Completo no Railway (Recomendado)

Railway suporta Node.js e pode hospedar backend e frontend juntos.

### 5.1.1 Preparar para Railway

**Backend - Criar railway.json (opcional):**
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Frontend - Ajustar vite.config.js para produção:**
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
});
```

### 5.1.2 Deploy no Railway

1. **Criar conta**: https://railway.app/
2. **Criar novo projeto**
3. **Conectar repositório Git** (ou fazer upload manual)
4. **Configurar variáveis de ambiente**:
   - `PORT` (Railway define automaticamente)
   - `NODE_ENV=production`
   - `DB_PATH=./smartstudio.sqlite`

5. **Deploy do Backend**:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

6. **Deploy do Frontend**:
   - Criar novo serviço
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npx serve -s dist -p $PORT`

**Atualizar frontend para usar URL do backend:**
Editar `frontend/src/services/api.js`:
```javascript
const api = axios.create({
  baseURL: process.env.VITE_API_URL || '/api',
  // ou baseURL: 'https://seu-backend.railway.app/api'
});
```

---

## 🌐 OPÇÃO 2: Deploy Separado (Vercel + Railway)

### 5.2.1 Backend no Railway

Seguir passos da Opção 1 para backend.

### 5.2.2 Frontend no Vercel

1. **Instalar Vercel CLI**:
```bash
npm install -g vercel
```

2. **Login na Vercel**:
```bash
vercel login
```

3. **Configurar variáveis de ambiente**:
Criar arquivo `.env.production`:
```env
VITE_API_URL=https://seu-backend.railway.app/api
```

4. **Deploy**:
```bash
cd frontend
vercel --prod
```

5. **Configurar no painel Vercel**:
   - Adicionar variável: `VITE_API_URL`
   - Valor: URL do seu backend Railway

---

## 🐳 OPÇÃO 3: Deploy com Docker

### 5.3.1 Criar Dockerfile para Backend

**backend/Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD ["node", "server.js"]
```

### 5.3.2 Criar Dockerfile para Frontend

**frontend/Dockerfile:**
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**frontend/nginx.conf:**
```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**docker-compose.yml (raiz do projeto):**
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - PORT=3001
      - DB_PATH=./smartstudio.sqlite
    volumes:
      - ./backend/smartstudio.sqlite:/app/smartstudio.sqlite

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
```

**Deploy:**
```bash
docker-compose up -d
```

---

## 🔧 OPÇÃO 4: Deploy Manual (VPS/Servidor)

### 5.4.1 Preparar Servidor

**Instalar Node.js no servidor:**
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar
node --version
npm --version
```

**Instalar PM2 (gerenciador de processos):**
```bash
sudo npm install -g pm2
```

### 5.4.2 Deploy do Backend

```bash
# 1. Fazer upload dos arquivos (via SCP, FTP, ou Git)
scp -r backend/ user@seu-servidor.com:/var/www/smartstudio/

# 2. Conectar ao servidor
ssh user@seu-servidor.com

# 3. Instalar dependências
cd /var/www/smartstudio/backend
npm install --production

# 4. Configurar .env
nano .env
# Adicionar:
# PORT=3001
# NODE_ENV=production
# DB_PATH=./smartstudio.sqlite

# 5. Iniciar com PM2
pm2 start server.js --name smartstudio-backend
pm2 save
pm2 startup
```

### 5.4.3 Deploy do Frontend

```bash
# 1. Build local
cd frontend
npm run build

# 2. Fazer upload da pasta dist
scp -r dist/ user@seu-servidor.com:/var/www/smartstudio/frontend/

# 3. Instalar Nginx
sudo apt-get install nginx

# 4. Configurar Nginx
sudo nano /etc/nginx/sites-available/smartstudio
```

**Configuração Nginx:**
```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    root /var/www/smartstudio/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 5. Ativar site
sudo ln -s /etc/nginx/sites-available/smartstudio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔍 Troubleshooting

### Problema 1: Backend não inicia

**Sintomas:**
- Erro ao conectar ao banco de dados
- Porta 3001 já em uso

**Soluções:**
```bash
# Verificar se porta está em uso
netstat -ano | findstr :3001  # Windows
lsof -i :3001                 # Linux/Mac

# Matar processo (Windows)
taskkill /PID <PID> /F

# Matar processo (Linux/Mac)
kill -9 <PID>

# Verificar arquivo .env existe
cd backend
dir .env  # Windows
ls -la .env  # Linux/Mac
```

### Problema 2: Frontend não conecta ao backend

**Sintomas:**
- Erro 404 nas requisições API
- CORS errors

**Soluções:**
1. Verificar se backend está rodando na porta 3001
2. Verificar proxy no `vite.config.js`
3. Verificar CORS no backend (`src/app.js`)
4. Testar API diretamente: http://localhost:3001/api/clients

### Problema 3: Banco de dados não cria

**Sintomas:**
- Erro ao criar tabelas
- Arquivo .sqlite não aparece

**Soluções:**
```bash
# Verificar permissões de escrita
cd backend
# Criar arquivo manualmente para testar
echo "" > smartstudio.sqlite

# Verificar se SQLite3 está instalado
npm list sqlite3
```

### Problema 4: Build do frontend falha

**Sintomas:**
- Erros de compilação
- Dependências faltando

**Soluções:**
```bash
# Limpar cache e reinstalar
cd frontend
rm -rf node_modules package-lock.json
npm install

# Verificar versão do Node
node --version  # Deve ser 18+

# Build com verbose
npm run build -- --debug
```

### Problema 5: Erro de módulos não encontrados

**Sintomas:**
- `Cannot find module`
- `Module not found`

**Soluções:**
```bash
# Backend
cd backend
rm -rf node_modules
npm install

# Frontend
cd frontend
rm -rf node_modules
npm install
```

---

## 📋 Checklist de Deploy

### Antes do Deploy

- [ ] Todas as dependências instaladas (`npm install`)
- [ ] Arquivo `.env` configurado
- [ ] Backend testado localmente
- [ ] Frontend testado localmente
- [ ] Build do frontend funciona (`npm run build`)
- [ ] Banco de dados criado e populado (se necessário)
- [ ] Variáveis de ambiente configuradas
- [ ] CORS configurado corretamente
- [ ] URLs da API atualizadas no frontend

### Durante o Deploy

- [ ] Backend deployado e rodando
- [ ] Frontend deployado e acessível
- [ ] Banco de dados acessível
- [ ] Logs verificados (sem erros críticos)
- [ ] Testes de funcionalidades básicas

### Após o Deploy

- [ ] Dashboard carrega corretamente
- [ ] CRUD de clientes funciona
- [ ] Agendamentos funcionam
- [ ] Relatórios funcionam
- [ ] Performance aceitável
- [ ] SSL/HTTPS configurado (se aplicável)

---

## 🔐 Segurança em Produção

### Recomendações

1. **Variáveis de Ambiente**:
   - Nunca commitar `.env` no Git
   - Usar variáveis de ambiente do provedor

2. **CORS**:
   - Restringir origens permitidas
   - Não usar `*` em produção

3. **Banco de Dados**:
   - Fazer backup regular do `.sqlite`
   - Considerar migrar para PostgreSQL em produção

4. **HTTPS**:
   - Sempre usar HTTPS em produção
   - Configurar certificado SSL

5. **Rate Limiting**:
   - Implementar rate limiting no backend
   - Proteger contra DDoS

---

## 📞 Suporte

Em caso de problemas:
1. Verificar logs do backend e frontend
2. Verificar console do navegador (F12)
3. Verificar Network tab para requisições falhando
4. Consultar documentação das tecnologias utilizadas

---

## 🎯 Próximos Passos Após Deploy

1. **Monitoramento**: Configurar logs e alertas
2. **Backup**: Automatizar backup do banco de dados
3. **Performance**: Otimizar queries e assets
4. **Segurança**: Implementar autenticação/autorização
5. **Escalabilidade**: Considerar migração para PostgreSQL
6. **CI/CD**: Automatizar deploy com GitHub Actions

---

**Última atualização**: Janeiro 2026
**Versão do Sistema**: 1.0.0

