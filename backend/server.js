require('dotenv').config();
const app = require('./src/app');

// Inicializar Banco de Dados se estiver no Render e for solicitado
if (process.env.INIT_DB === 'true' && process.env.NODE_ENV === 'production') {
  const initPostgres = require('./initPostgres');
  console.log('Iniciando script de criação de tabelas...');
  initPostgres().then(() => {
    console.log('Banco de dados inicializado com sucesso.');
    process.exit(0); // Sai após inicializar para o render não reiniciar em loop
  }).catch(err => {
    console.error('Erro ao inicializar banco:', err);
    process.exit(1);
  });
}

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 SmartStudio Pro Backend rodando na porta ${PORT}`);
  console.log(`📊 Ambiente: ${process.env.NODE_ENV}`);
});

