const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const clientRoutes = require('./routes/clientRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const productRoutes = require('./routes/productRoutes');
const professionalRoutes = require('./routes/professionalRoutes');
const financialRoutes = require('./routes/financialRoutes');
const orientationRoutes = require('./routes/orientationRoutes');
const reportRoutes = require('./routes/reportRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const statsRoutes = require('./routes/statsRoutes');
const studioRoutes = require('./routes/studioRoutes');
const User = require('./models/User');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Middleware de logging para todas as requisições (DEPOIS do express.json para capturar body)
app.use((req, res, next) => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📥 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (Object.keys(req.body).length > 0) {
    console.log(`📥 Body:`, JSON.stringify(req.body, null, 2));
  }
  if (Object.keys(req.query).length > 0) {
    console.log(`📥 Query:`, JSON.stringify(req.query, null, 2));
  }
  console.log(`${'='.repeat(60)}\n`);
  next();
});

// Rotas de autenticação
app.use('/api/auth', authRoutes);

// Rotas
app.use('/api/appointments', appointmentRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/products', productRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/financial', financialRoutes);
app.use('/api/orientation', orientationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api', statsRoutes);
app.use('/api/studio', studioRoutes);

app.use(errorHandler);

// Criar tabela de usuários se não existir
User.createTable().catch(err => console.error('Erro ao criar tabela users:', err));

module.exports = app;

