# 📋 SmartStudio Pro - Documentação Técnica Completa

**Data:** 28 de Janeiro de 2026  
**Versão:** 1.0.0  
**Autor:** Documentação gerada durante sessão de desenvolvimento

---

## 📑 ÍNDICE

1. [Visão Geral do Sistema](#1-visão-geral-do-sistema)
2. [Arquitetura Técnica](#2-arquitetura-técnica)
3. [Stack Tecnológico](#3-stack-tecnológico)
4. [Estrutura de Arquivos](#4-estrutura-de-arquivos)
5. [Banco de Dados](#5-banco-de-dados)
6. [API Endpoints](#6-api-endpoints)
7. [Funcionalidades Implementadas](#7-funcionalidades-implementadas)
8. [Funcionalidades Pendentes](#8-funcionalidades-pendentes)
9. [Configurações de Deploy](#9-configurações-de-deploy)
10. [Problemas Conhecidos](#10-problemas-conhecidos)
11. [Melhorias Futuras](#11-melhorias-futuras)
12. [Credenciais e URLs](#12-credenciais-e-urls)

---

## 1. VISÃO GERAL DO SISTEMA

### 1.1 Descrição
**SmartStudio Pro** é um sistema de gerenciamento completo para salões de beleza e estúdios, oferecendo:
- Gestão de agendamentos
- Cadastro de clientes
- Controle financeiro
- Gestão de profissionais e serviços
- Controle de estoque de produtos
- Relatórios gerenciais
- Página pública de agendamento online

### 1.2 Público-Alvo
- Salões de beleza
- Barbearias
- Estúdios de estética
- Clínicas de beleza
- Profissionais autônomos da área de beleza

---

## 2. ARQUITETURA TÉCNICA

### 2.1 Arquitetura Geral
\\\
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│                    (React + Vite)                                │
│              smartstudio-pro-frontend.onrender.com               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS (API Calls)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
│                    (Node.js + Express)                           │
│                smartstudio-pro.onrender.com                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ PostgreSQL Protocol
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       DATABASE                                   │
│                    (PostgreSQL 15)                               │
│                   Render Managed DB                              │
│           dpg-d5rc1q9r0fns73e2mn10-a.oregon-postgres.render.com │
└─────────────────────────────────────────────────────────────────┘
\\\

### 2.2 Comunicação
- Frontend → Backend: REST API via HTTPS
- Backend → Database: PostgreSQL via SSL
- Autenticação: Não implementada (planejada para v2)

---

## 3. STACK TECNOLÓGICO

### 3.1 Frontend
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| React | 18.x | Framework UI |
| Vite | 5.x | Build tool |
| React Router DOM | 6.x | Roteamento |
| Axios | 1.x | HTTP Client |
| Tailwind CSS | 3.x | Estilização |
| Lucide React | 0.x | Ícones |
| date-fns | 2.x | Manipulação de datas |
| Recharts | 2.x | Gráficos |

### 3.2 Backend
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Node.js | 18.x | Runtime |
| Express | 4.x | Framework HTTP |
| pg (node-postgres) | 8.x | Driver PostgreSQL |
| Multer | 1.x | Upload de arquivos |
| CORS | 2.x | Cross-Origin |
| dotenv | 16.x | Variáveis de ambiente |
| date-fns | 2.x | Manipulação de datas |

### 3.3 Banco de Dados
| Tecnologia | Versão | Uso |
|------------|--------|-----|
| PostgreSQL | 15.x | Banco de dados principal |

### 3.4 Infraestrutura
| Serviço | Uso |
|---------|-----|
| Render (Web Service) | Hospedagem Backend |
| Render (Static Site) | Hospedagem Frontend |
| Render (PostgreSQL) | Banco de Dados |
| GitHub | Repositório de código |

---

## 4. ESTRUTURA DE ARQUIVOS

### 4.1 Estrutura do Projeto
\\\
smartstudio-pro/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js       # Configuração PostgreSQL
│   │   │   └── dbAdapter.js      # Adaptador Promise-based
│   │   ├── controllers/
│   │   │   ├── appointmentController.js
│   │   │   ├── clientController.js
│   │   │   ├── dashboardController.js
│   │   │   ├── financialController.js
│   │   │   ├── orientationController.js
│   │   │   ├── productController.js
│   │   │   ├── professionalController.js
│   │   │   ├── reportController.js
│   │   │   ├── serviceController.js
│   │   │   ├── statsController.js
│   │   │   └── studioController.js    # NOVO
│   │   ├── middlewares/
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── Appointment.js
│   │   │   ├── Client.js
│   │   │   ├── Financial.js
│   │   │   ├── Product.js
│   │   │   ├── Professional.js
│   │   │   ├── Service.js
│   │   │   ├── Settings.js
│   │   │   └── StudioSettings.js      # NOVO
│   │   ├── routes/
│   │   │   ├── appointmentRoutes.js
│   │   │   ├── clientRoutes.js
│   │   │   ├── dashboardRoutes.js
│   │   │   ├── financialRoutes.js
│   │   │   ├── orientationRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── professionalRoutes.js
│   │   │   ├── reportRoutes.js
│   │   │   ├── serviceRoutes.js
│   │   │   ├── statsRoutes.js
│   │   │   └── studioRoutes.js        # NOVO
│   │   ├── app.js
│   │   └── server.js
│   ├── uploads/                        # Pasta para uploads (efêmera no Render)
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── layout/
│   │   │       ├── Layout.jsx
│   │   │       ├── Sidebar.jsx
│   │   │       └── Header.jsx
│   │   ├── pages/
│   │   │   ├── Appointments.jsx
│   │   │   ├── Clients.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Financial.jsx
│   │   │   ├── Orientation.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Professionals.jsx
│   │   │   ├── PublicBooking.jsx      # NOVO
│   │   │   ├── Reports.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── StudioSettings.jsx     # NOVO
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.production
│   ├── vite.config.js
│   └── package.json
│
└── README.md
\\\

---

## 5. BANCO DE DADOS

### 5.1 Diagrama ER (Entidade-Relacionamento)
\\\
┌─────────────┐       ┌─────────────────┐       ┌─────────────┐
│   clients   │       │  appointments   │       │  services   │
├─────────────┤       ├─────────────────┤       ├─────────────┤
│ id (PK)     │◄──────│ client_id (FK)  │       │ id (PK)     │
│ name        │       │ professional_id │──────►│ name        │
│ phone       │       │ service_id (FK) │───────│ description │
│ email       │       │ date            │       │ price       │
│ cpf         │       │ time            │       │ duration    │
│ birth_date  │       │ status          │       │ active      │
│ address     │       │ notes           │       │ created_at  │
│ notes       │       │ created_at      │       └─────────────┘
│ created_at  │       └─────────────────┘
└─────────────┘               │
                              │
┌─────────────────┐           │           ┌─────────────────────┐
│  professionals  │◄──────────┘           │ financial_transactions│
├─────────────────┤                       ├─────────────────────┤
│ id (PK)         │◄──────────────────────│ professional_id (FK)│
│ name            │                       │ appointment_id (FK) │
│ phone           │                       │ id (PK)             │
│ email           │                       │ type                │
│ specialty       │                       │ category            │
│ commission_%    │                       │ description         │
│ color           │                       │ amount              │
│ active          │                       │ date                │
│ created_at      │                       │ payment_method      │
└─────────────────┘                       │ notes               │
                                          │ created_at          │
┌─────────────┐                           └─────────────────────┘
│  products   │
├─────────────┤       ┌─────────────────────┐
│ id (PK)     │       │ orientation_settings│
│ name        │       ├─────────────────────┤
│ description │       │ id (PK)             │
│ price       │       │ prolabore_%         │
│ stock       │       │ reinvestment_%      │
│ min_stock   │       │ reserve_%           │
│ active      │       │ tax_%               │
│ created_at  │       │ updated_at          │
└─────────────┘       └─────────────────────┘

┌───────────────────┐
│  studio_settings  │  # NOVA TABELA
├───────────────────┤
│ id (PK)           │
│ name              │
│ slug (UNIQUE)     │
│ logo_url          │
│ phone             │
│ whatsapp          │
│ instagram         │
│ address           │
│ description       │
│ primary_color     │
│ secondary_color   │
│ monday_open/close │
│ tuesday_open/close│
│ ... (outros dias) │
│ created_at        │
│ updated_at        │
└───────────────────┘
\\\

### 5.2 Scripts de Criação das Tabelas

#### clients
\\\sql
CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  cpf VARCHAR(14),
  birth_date DATE,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\\\

#### professionals
\\\sql
CREATE TABLE IF NOT EXISTS professionals (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  specialty VARCHAR(255),
  commission_percentage DECIMAL(5,2) DEFAULT 0,
  color VARCHAR(20) DEFAULT '#3b82f6',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\\\

#### services
\\\sql
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  duration_minutes INTEGER,
  duration INTEGER DEFAULT 30,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\\\

#### products
\\\sql
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\\\

#### appointments
\\\sql
CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  client_id INTEGER NOT NULL REFERENCES clients(id),
  professional_id INTEGER NOT NULL REFERENCES professionals(id),
  service_id INTEGER NOT NULL REFERENCES services(id),
  date DATE NOT NULL,
  time VARCHAR(10) NOT NULL,
  status VARCHAR(20) DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT appointments_status_check 
    CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled'))
);
\\\

#### financial_transactions
\\\sql
CREATE TABLE IF NOT EXISTS financial_transactions (
  id SERIAL PRIMARY KEY,
  type VARCHAR(10) NOT NULL,
  category VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  date DATE NOT NULL,
  payment_method VARCHAR(50),
  appointment_id INTEGER REFERENCES appointments(id),
  professional_id INTEGER REFERENCES professionals(id),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT financial_transactions_type_check 
    CHECK (type IN ('income', 'expense'))
);
\\\

#### orientation_settings
\\\sql
CREATE TABLE IF NOT EXISTS orientation_settings (
  id SERIAL PRIMARY KEY,
  prolabore_percentage DECIMAL(5,2) DEFAULT 25,
  reinvestment_percentage DECIMAL(5,2) DEFAULT 15,
  reserve_percentage DECIMAL(5,2) DEFAULT 10,
  tax_percentage DECIMAL(5,2) DEFAULT 20,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\\\

#### studio_settings (NOVA)
\\\sql
CREATE TABLE IF NOT EXISTS studio_settings (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  logo_url TEXT,
  phone VARCHAR(20),
  whatsapp VARCHAR(20),
  instagram VARCHAR(255),
  address TEXT,
  description TEXT,
  primary_color VARCHAR(20) DEFAULT '#ec4899',
  secondary_color VARCHAR(20) DEFAULT '#f9a8d4',
  monday_open VARCHAR(10) DEFAULT '09:00',
  monday_close VARCHAR(10) DEFAULT '18:00',
  tuesday_open VARCHAR(10) DEFAULT '09:00',
  tuesday_close VARCHAR(10) DEFAULT '18:00',
  wednesday_open VARCHAR(10) DEFAULT '09:00',
  wednesday_close VARCHAR(10) DEFAULT '18:00',
  thursday_open VARCHAR(10) DEFAULT '09:00',
  thursday_close VARCHAR(10) DEFAULT '18:00',
  friday_open VARCHAR(10) DEFAULT '09:00',
  friday_close VARCHAR(10) DEFAULT '18:00',
  saturday_open VARCHAR(10) DEFAULT '09:00',
  saturday_close VARCHAR(10) DEFAULT '15:00',
  sunday_open VARCHAR(10),
  sunday_close VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\\\

---

## 6. API ENDPOINTS

### 6.1 Clientes (\/api/clients\)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | \/api/clients\ | Lista todos os clientes |
| GET | \/api/clients/:id\ | Obtém um cliente específico |
| POST | \/api/clients\ | Cria um novo cliente |
| PUT | \/api/clients/:id\ | Atualiza um cliente |
| DELETE | \/api/clients/:id\ | Remove um cliente |

### 6.2 Profissionais (\/api/professionals\)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | \/api/professionals\ | Lista todos os profissionais |
| GET | \/api/professionals/active\ | Lista profissionais ativos |
| GET | \/api/professionals/:id\ | Obtém um profissional específico |
| POST | \/api/professionals\ | Cria um novo profissional |
| PUT | \/api/professionals/:id\ | Atualiza um profissional |
| DELETE | \/api/professionals/:id\ | Remove um profissional |

### 6.3 Serviços (\/api/services\)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | \/api/services\ | Lista todos os serviços |
| GET | \/api/services/active\ | Lista serviços ativos |
| GET | \/api/services/:id\ | Obtém um serviço específico |
| POST | \/api/services\ | Cria um novo serviço |
| PUT | \/api/services/:id\ | Atualiza um serviço |
| DELETE | \/api/services/:id\ | Remove um serviço |

### 6.4 Produtos (\/api/products\)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | \/api/products\ | Lista todos os produtos |
| GET | \/api/products/:id\ | Obtém um produto específico |
| POST | \/api/products\ | Cria um novo produto |
| PUT | \/api/products/:id\ | Atualiza um produto |
| DELETE | \/api/products/:id\ | Remove um produto |

### 6.5 Agendamentos (\/api/appointments\)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | \/api/appointments\ | Lista todos os agendamentos |
| GET | \/api/appointments/:id\ | Obtém um agendamento específico |
| POST | \/api/appointments\ | Cria um novo agendamento |
| PUT | \/api/appointments/:id\ | Atualiza um agendamento |
| PATCH | \/api/appointments/:id/status\ | Atualiza status do agendamento |
| DELETE | \/api/appointments/:id\ | Remove um agendamento |

### 6.6 Financeiro (\/api/financial\)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | \/api/financial\ | Lista transações (com filtros) |
| GET | \/api/financial/summary\ | Resumo financeiro |
| POST | \/api/financial\ | Cria nova transação |
| DELETE | \/api/financial/:id\ | Remove uma transação |

### 6.7 Dashboard (\/api/dashboard\)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | \/api/dashboard/overview\ | Dados gerais do dashboard |

### 6.8 Relatórios (\/api/reports\)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | \/api/reports/services\ | Relatório de serviços |
| GET | \/api/reports/professionals\ | Relatório de profissionais |
| GET | \/api/reports/financial\ | Relatório financeiro |

### 6.9 Orientação Financeira (\/api/orientation\)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | \/api/orientation/settings\ | Obtém configurações |
| PUT | \/api/orientation/settings\ | Atualiza configurações |
| POST | \/api/orientation/calculate\ | Calcula distribuição |

### 6.10 Estatísticas (\/api/stats\)
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | \/api/stats\ | Estatísticas gerais |

### 6.11 Configurações do Estúdio (\/api/studio\) - NOVO
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | \/api/studio/settings\ | Obtém configurações do estúdio |
| PUT | \/api/studio/settings\ | Atualiza configurações |
| POST | \/api/studio/upload-logo\ | Upload de logo |
| GET | \/api/studio/public/:slug\ | Dados públicos (para booking) |

---

## 7. FUNCIONALIDADES IMPLEMENTADAS

### 7.1 ✅ Módulos Completos

#### Dashboard
- [x] Resumo financeiro do mês (receita, despesas, saldo)
- [x] Total de clientes
- [x] Agendamentos do dia
- [x] Próximos agendamentos
- [x] Serviços mais vendidos
- [x] Produtos com estoque baixo
- [x] Gráfico de evolução financeira (6 meses)

#### Clientes
- [x] Listagem com busca
- [x] Cadastro completo (nome, telefone, email, CPF, data nascimento, endereço)
- [x] Edição
- [x] Exclusão

#### Profissionais
- [x] Listagem com filtro de ativos
- [x] Cadastro (nome, telefone, email, especialidade, comissão, cor)
- [x] Edição
- [x] Exclusão
- [x] Status ativo/inativo

#### Serviços
- [x] Listagem com filtro de ativos
- [x] Cadastro (nome, descrição, preço, duração)
- [x] Edição
- [x] Exclusão
- [x] Status ativo/inativo

#### Produtos
- [x] Listagem com filtro de ativos
- [x] Cadastro (nome, descrição, preço, estoque, estoque mínimo)
- [x] Edição
- [x] Exclusão
- [x] Alerta de estoque baixo

#### Agendamentos
- [x] Listagem com filtros (data, profissional, status)
- [x] Cadastro (cliente, profissional, serviço, data, hora)
- [x] Edição
- [x] Exclusão
- [x] Alteração de status (agendado, confirmado, concluído, cancelado)

#### Financeiro
- [x] Listagem de transações com filtros
- [x] Cadastro de receitas e despesas
- [x] Exclusão de transações
- [x] Resumo financeiro

#### Orientação Financeira
- [x] Configuração de percentuais (pró-labore, reinvestimento, reserva, impostos)
- [x] Cálculo de distribuição financeira
- [x] Visualização de distribuição

#### Relatórios
- [x] Relatório de serviços (por período)
- [x] Relatório de profissionais (por período)
- [x] Relatório financeiro (por período)

#### Configurações do Estúdio (NOVO - Parcial)
- [x] Interface de configuração
- [x] Campos: nome, slug, telefone, WhatsApp, Instagram, endereço, descrição
- [x] Seleção de cores (primária e secundária)
- [ ] Upload de logo (pendente - Cloudinary)

#### Página Pública de Booking (NOVO - Parcial)
- [x] Interface responsiva
- [x] Seleção de serviço
- [x] Seleção de profissional
- [x] Seleção de data e horário
- [x] Formulário de dados do cliente
- [x] Confirmação de agendamento
- [x] Integração com WhatsApp
- [ ] Verificação de horários disponíveis (pendente)

---

## 8. FUNCIONALIDADES PENDENTES

### 8.1 🔴 Alta Prioridade

#### Upload de Imagens com Cloudinary
- [ ] Criar conta no Cloudinary
- [ ] Configurar credenciais
- [ ] Implementar upload de logo no backend
- [ ] Salvar URL no banco de dados
- [ ] Exibir logo na página pública

#### Verificação de Horários Disponíveis
- [ ] Consultar agendamentos existentes
- [ ] Bloquear horários já ocupados
- [ ] Respeitar horário de funcionamento
- [ ] Considerar duração do serviço

### 8.2 🟡 Média Prioridade

#### Autenticação e Autorização
- [ ] Login/Logout
- [ ] Registro de usuários
- [ ] Níveis de acesso (admin, profissional)
- [ ] Proteção de rotas

#### Notificações
- [ ] Notificações por email
- [ ] Notificações por WhatsApp
- [ ] Lembretes de agendamento

#### Agenda Visual
- [ ] Visualização em calendário
- [ ] Drag and drop de agendamentos
- [ ] Visualização por profissional

### 8.3 🟢 Baixa Prioridade

#### Backup do Banco de Dados
- [ ] Configurar backup automático
- [ ] Exportação de dados
- [ ] Importação de dados

#### Multi-tenancy
- [ ] Suporte a múltiplos estúdios
- [ ] Subdomínios personalizados
- [ ] Planos de assinatura

#### Integrações
- [ ] Google Calendar
- [ ] WhatsApp Business API
- [ ] Gateway de pagamento

---

## 9. CONFIGURAÇÕES DE DEPLOY

### 9.1 Render - Backend (Web Service)

**Nome:** smartstudio-pro  
**URL:** https://smartstudio-pro.onrender.com  
**Branch:** main  
**Build Command:** \cd backend && npm install\  
**Start Command:** \cd backend && npm start\  
**Plano:** Free

**Variáveis de Ambiente:**
\\\
NODE_ENV=production
DATABASE_URL=postgresql://smartstudio_db_user:xxx@dpg-xxx.oregon-postgres.render.com/smartstudio_db
PORT=10000
\\\

### 9.2 Render - Frontend (Static Site)

**Nome:** smartstudio-pro-frontend  
**URL:** https://smartstudio-pro-frontend.onrender.com  
**Branch:** main  
**Build Command:** \cd frontend && npm install && npm run build\  
**Publish Directory:** \rontend/dist\  
**Plano:** Free

### 9.3 Render - Database (PostgreSQL)

**Nome:** smartstudio-db  
**ID:** dpg-d5rc1q9r0fns73e2mn10-a  
**Região:** Oregon (US West)  
**Plano:** Free (90 dias, depois precisa atualizar)

**Internal URL:**
\\\
postgresql://smartstudio_db_user:xxx@dpg-d5rc1q9r0fns73e2mn10-a/smartstudio_db
\\\

**External URL:**
\\\
postgresql://smartstudio_db_user:xxx@dpg-d5rc1q9r0fns73e2mn10-a.oregon-postgres.render.com/smartstudio_db
\\\

### 9.4 Configuração Local

**Backend (.env):**
\\\env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://smartstudio_db_user:xxx@dpg-xxx/smartstudio_db
SENHA_LOCAL=postgres8297
\\\

**Frontend (.env.production):**
\\\env
VITE_API_URL=https://smartstudio-pro.onrender.com
\\\

**Frontend (vite.config.js):**
\\\javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
});
\\\

---

## 10. PROBLEMAS CONHECIDOS

### 10.1 🔴 Críticos

| Problema | Impacto | Solução Proposta |
|----------|---------|------------------|
| Upload de imagens não funciona no Render | Logo não pode ser enviado | Implementar Cloudinary |
| Sistema de arquivos efêmero no Render | Arquivos são perdidos a cada deploy | Usar armazenamento em nuvem |

### 10.2 🟡 Moderados

| Problema | Impacto | Solução Proposta |
|----------|---------|------------------|
| Sem verificação de horários no booking | Pode haver conflito de agendamentos | Implementar validação |
| Sem autenticação | Sistema aberto | Implementar auth |
| DECIMAL retorna como string | Precisa de parseFloat | Converter no backend |

### 10.3 🟢 Menores

| Problema | Impacto | Solução Proposta |
|----------|---------|------------------|
| Console warnings do React | Apenas desenvolvimento | Corrigir avisos |
| Fuso horário | Datas podem variar | Usar UTC ou configurar timezone |

---

## 11. MELHORIAS FUTURAS

### 11.1 Versão 1.1 (Próxima)
1. ✅ Cloudinary para upload de imagens
2. Verificação de disponibilidade de horários
3. Confirmação de agendamento por WhatsApp

### 11.2 Versão 1.2
1. Sistema de autenticação (JWT)
2. Múltiplos níveis de usuário
3. Agenda visual (calendário)

### 11.3 Versão 2.0
1. Multi-tenancy (múltiplos estúdios)
2. App mobile (React Native)
3. Dashboard avançado com BI
4. Integração com meios de pagamento

---

## 12. CREDENCIAIS E URLs

### 12.1 URLs de Produção
| Serviço | URL |
|---------|-----|
| Frontend | https://smartstudio-pro-frontend.onrender.com |
| Backend API | https://smartstudio-pro.onrender.com |
| Página de Booking | https://smartstudio-pro-frontend.onrender.com/booking/{slug} |

### 12.2 URLs de Desenvolvimento
| Serviço | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001 |

### 12.3 Banco de Dados (Render)
\\\
Host: dpg-d5rc1q9r0fns73e2mn10-a.oregon-postgres.render.com
Database: smartstudio_db
User: smartstudio_db_user
Password: cQn0BwG90vrYMuNsBxmDsSIY5OKhKinj
\\\

### 12.4 PostgreSQL Local
\\\
Host: localhost
Port: 5432
Database: smartstudio_local
User: postgres
Password: postgres8297
\\\

---

## 📝 NOTAS FINAIS

### Comandos Úteis

**Iniciar Backend (desenvolvimento):**
\\\ash
cd backend
npm run dev
\\\

**Iniciar Frontend (desenvolvimento):**
\\\ash
cd frontend
npm run dev
\\\

**Deploy (via Git):**
\\\ash
git add .
git commit -m "descrição"
git push
\\\

**Conectar ao banco de produção:**
\\\ash
psql "postgresql://smartstudio_db_user:cQn0BwG90vrYMuNsBxmDsSIY5OKhKinj@dpg-d5rc1q9r0fns73e2mn10-a.oregon-postgres.render.com/smartstudio_db"
\\\

---

**Documento gerado em:** 28/01/2026  
**Última atualização:** 28/01/2026  
**Versão do documento:** 1.0.0
