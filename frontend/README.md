# SmartStudio Pro - Frontend

Frontend completo para o sistema SmartStudio Pro - Sistema de Gestão Profissional.

## 🚀 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

O frontend estará rodando em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
frontend/
├── public/
│   └── index.html          # HTML principal
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── layout/         # Layout (Header, Sidebar, Layout)
│   │   ├── common/         # Componentes comuns (Button, Modal, Input, etc)
│   │   └── dashboard/      # Componentes do dashboard
│   ├── pages/              # Páginas principais
│   ├── services/           # Serviços de API
│   ├── utils/              # Funções auxiliares
│   ├── App.jsx            # Componente principal
│   ├── index.js            # Ponto de entrada
│   └── index.css           # Estilos globais
├── package.json
├── vite.config.js          # Configuração do Vite
├── tailwind.config.js      # Configuração do Tailwind
└── postcss.config.js       # Configuração do PostCSS
```

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca JavaScript para interfaces
- **React Router** - Roteamento
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS utilitário
- **Recharts** - Biblioteca de gráficos
- **Lucide React** - Ícones
- **Axios** - Cliente HTTP
- **date-fns** - Manipulação de datas

## 📱 Funcionalidades

### Páginas Disponíveis

1. **Dashboard** - Visão geral com estatísticas e gráficos
2. **Agendamentos** - Gerenciamento de agendamentos
3. **Clientes** - CRUD de clientes
4. **Serviços** - CRUD de serviços oferecidos
5. **Produtos** - Gerenciamento de estoque
6. **Profissionais** - Gerenciamento da equipe
7. **Financeiro** - Controle de receitas e despesas
8. **Orientação Financeira** - Calculadora de distribuição financeira
9. **Relatórios** - Relatórios analíticos
10. **Configurações** - Configurações do sistema

## 🎨 Componentes Principais

### Layout
- `Header` - Cabeçalho com navegação e ações
- `Sidebar` - Menu lateral com navegação
- `Layout` - Container principal

### Comuns
- `Button` - Botões estilizados
- `Modal` - Modais reutilizáveis
- `Input` - Campos de entrada
- `Select` - Seletores dropdown
- `Card` - Cards de conteúdo
- `Table` - Tabelas de dados

### Dashboard
- `StatCard` - Cards de estatísticas
- `RevenueChart` - Gráfico de evolução financeira
- `UpcomingAppointments` - Lista de próximos agendamentos
- `TopServices` - Gráfico de serviços mais vendidos

## 🔌 Integração com Backend

O frontend está configurado para se comunicar com o backend através de um proxy no Vite:

```javascript
// vite.config.js
proxy: {
  '/api': {
    target: 'http://localhost:3001',
    changeOrigin: true
  }
}
```

Todas as requisições para `/api/*` são automaticamente redirecionadas para o backend.

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build de produção

## 🎯 Próximos Passos

1. Certifique-se de que o backend está rodando na porta 3001
2. Execute `npm install` para instalar as dependências
3. Execute `npm run dev` para iniciar o frontend
4. Acesse `http://localhost:3000` no navegador

## 📄 Licença

Este projeto faz parte do SmartStudio Pro.

