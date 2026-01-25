# SmartStudio Pro - README Principal

Bem-vindo ao **SmartStudio Pro** - Sistema completo de gestão profissional para salões e estúdios.

## 📚 Documentação

Este projeto inclui documentação completa em vários arquivos:

### 🚀 Guias de Início

- **[QUICK_START.md](./QUICK_START.md)** - Início rápido em 5 minutos
- **[GUIA_COMPLETO.md](./GUIA_COMPLETO.md)** - Guia completo passo a passo até o deploy

### 📊 Análises e Documentação Técnica

- **[ANALISE_TECNICA.md](./ANALISE_TECNICA.md)** - Análise técnica detalhada do sistema
- **[DEPLOY_SCRIPTS.md](./DEPLOY_SCRIPTS.md)** - Documentação dos scripts de deploy

### 📖 Documentação por Módulo

- **[backend/README.md](./backend/README.md)** - Documentação do backend
- **[frontend/README.md](./frontend/README.md)** - Documentação do frontend

## ⚡ Início Rápido

```bash
# 1. Instalar dependências
cd backend && npm install
cd ../frontend && npm install

# 2. Configurar backend
cd ../backend
copy .env.example .env  # Windows
# ou: cp .env.example .env  # Linux/Mac

# 3. Executar
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd frontend && npm run dev
```

Acesse: http://localhost:3000

## 🎯 Scripts de Deploy Automatizados

### Windows
```bash
.\deploy.bat
```

### Linux/Mac
```bash
chmod +x deploy.sh
./deploy.sh
```

### PowerShell
```powershell
.\deploy.ps1
```

## 📋 Estrutura do Projeto

```
smartstudio-pro/
├── backend/          # API REST (Node.js/Express)
├── frontend/         # Interface React
├── deploy.bat        # Script de deploy (Windows)
├── deploy.sh         # Script de deploy (Linux/Mac)
├── deploy.ps1        # Script de deploy (PowerShell)
└── docs/            # Documentação adicional
```

## 🛠️ Tecnologias

- **Backend**: Node.js, Express, SQLite
- **Frontend**: React, Vite, Tailwind CSS
- **Gráficos**: Recharts
- **Ícones**: Lucide React

## 📞 Suporte

Para problemas ou dúvidas:
1. Consulte a documentação nos arquivos acima
2. Verifique a seção de Troubleshooting no GUIA_COMPLETO.md
3. Revise os logs de erro

## 🚀 Deploy

Para deploy em produção, consulte:
- **GUIA_COMPLETO.md** - Seção "FASE 5: Deploy"
- Opções: Railway, Vercel, Docker, VPS

## 📝 Licença

Este projeto é parte do SmartStudio Pro.

---

**Versão**: 1.0.0  
**Última atualização**: Janeiro 2026

