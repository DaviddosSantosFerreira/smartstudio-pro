# SmartStudio Pro - Quick Start Guide

## ⚡ Início Rápido (5 minutos)

### 1. Instalar Dependências

**Backend:**
```bash
cd backend
npm install
copy .env.example .env  # Windows
# ou: cp .env.example .env  # Linux/Mac
```

**Frontend:**
```bash
cd ../frontend
npm install
```

### 2. Executar Aplicação

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 3. Acessar

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api/clients

---

## 📋 Requisitos

- Node.js 18+ 
- npm ou yarn
- Git (opcional)

---

## 🚀 Deploy Rápido

### Railway (Recomendado - Mais Fácil)

1. Criar conta em https://railway.app/
2. Novo Projeto → Deploy from GitHub
3. Selecionar repositório
4. Configurar:
   - Backend: Root = `backend`, Start = `npm start`
   - Frontend: Root = `frontend`, Build = `npm run build`, Start = `npx serve -s dist`

### Vercel (Frontend) + Railway (Backend)

**Backend no Railway:**
- Seguir passos acima para backend

**Frontend no Vercel:**
```bash
cd frontend
npm install -g vercel
vercel --prod
```

---

## 🔧 Problemas Comuns

**Porta em uso:**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3001
kill -9 <PID>
```

**Dependências:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Banco de dados:**
- Verificar se arquivo `.env` existe
- Verificar permissões de escrita na pasta backend

---

Para guia completo, veja `GUIA_COMPLETO.md`

