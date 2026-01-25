# SmartStudio Pro - Backend

Backend completo para o sistema SmartStudio Pro - Sistema de Gestão Profissional.

## 🚀 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

3. Execute o servidor:
```bash
# Modo desenvolvimento (com nodemon)
npm run dev

# Modo produção
npm start
```

O backend estará rodando em `http://localhost:3001`

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── config/          # Configurações (banco de dados, env)
│   ├── controllers/     # Lógica de negócio
│   ├── models/          # Modelos de dados
│   ├── routes/          # Definição de rotas
│   ├── middlewares/    # Middlewares (error handler, etc)
│   ├── utils/          # Funções auxiliares
│   └── app.js          # Configuração do Express
├── .env.example        # Exemplo de variáveis de ambiente
├── package.json        # Dependências do projeto
└── server.js          # Ponto de entrada do servidor
```

## 📊 Banco de Dados

O projeto utiliza SQLite. O banco de dados será criado automaticamente na primeira execução em `./smartstudio.sqlite`.

### Tabelas criadas automaticamente:
- `clients` - Clientes
- `professionals` - Profissionais
- `services` - Serviços
- `products` - Produtos
- `appointments` - Agendamentos
- `financial_transactions` - Transações financeiras
- `orientation_settings` - Configurações de orientação financeira

## 🔌 Endpoints da API

### Clientes
- `GET /api/clients` - Listar todos os clientes
- `GET /api/clients/search?term=nome` - Buscar clientes
- `GET /api/clients/:id` - Buscar cliente por ID
- `POST /api/clients` - Criar cliente
- `PUT /api/clients/:id` - Atualizar cliente
- `DELETE /api/clients/:id` - Deletar cliente

### Profissionais
- `GET /api/professionals` - Listar todos os profissionais
- `GET /api/professionals/active` - Listar profissionais ativos
- `GET /api/professionals/:id` - Buscar profissional por ID
- `POST /api/professionals` - Criar profissional
- `PUT /api/professionals/:id` - Atualizar profissional
- `DELETE /api/professionals/:id` - Deletar profissional

### Serviços
- `GET /api/services` - Listar todos os serviços
- `GET /api/services/active` - Listar serviços ativos
- `GET /api/services/:id` - Buscar serviço por ID
- `POST /api/services` - Criar serviço
- `PUT /api/services/:id` - Atualizar serviço
- `DELETE /api/services/:id` - Deletar serviço

### Produtos
- `GET /api/products` - Listar todos os produtos
- `GET /api/products/low-stock` - Produtos com estoque baixo
- `GET /api/products/:id` - Buscar produto por ID
- `POST /api/products` - Criar produto
- `PUT /api/products/:id` - Atualizar produto
- `PATCH /api/products/:id/stock` - Atualizar estoque
- `DELETE /api/products/:id` - Deletar produto

### Agendamentos
- `GET /api/appointments` - Listar agendamentos (com filtros opcionais)
- `GET /api/appointments/upcoming` - Próximos agendamentos
- `GET /api/appointments/date/:date` - Agendamentos por data
- `GET /api/appointments/:id` - Buscar agendamento por ID
- `POST /api/appointments` - Criar agendamento
- `PUT /api/appointments/:id` - Atualizar agendamento
- `PATCH /api/appointments/:id/status` - Atualizar status
- `DELETE /api/appointments/:id` - Deletar agendamento

### Financeiro
- `GET /api/financial` - Listar transações (com filtros opcionais)
- `GET /api/financial/summary?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Resumo financeiro
- `POST /api/financial` - Criar transação
- `DELETE /api/financial/:id` - Deletar transação

### Orientação Financeira
- `GET /api/orientation/settings` - Obter configurações
- `PUT /api/orientation/settings` - Atualizar configurações
- `POST /api/orientation/calculate` - Calcular distribuição financeira

### Relatórios
- `GET /api/reports/services?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Relatório de serviços
- `GET /api/reports/professionals?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Relatório de profissionais
- `GET /api/reports/financial?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` - Relatório financeiro

### Dashboard
- `GET /api/dashboard/overview` - Visão geral completa do dashboard

## 🛠️ Tecnologias Utilizadas

- **Express.js** - Framework web
- **SQLite3** - Banco de dados
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Gerenciamento de variáveis de ambiente
- **date-fns** - Manipulação de datas
- **nodemon** - Auto-reload em desenvolvimento

## 📝 Notas

- O banco de dados é criado automaticamente na primeira execução
- Dados de exemplo são inseridos automaticamente (profissionais, serviços, produtos e clientes)
- Todas as rotas retornam JSON
- O servidor utiliza CORS para permitir requisições do frontend

