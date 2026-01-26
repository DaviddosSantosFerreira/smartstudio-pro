module.exports = (err, req, res, next) => {
  console.error('\n' + '='.repeat(60));
  console.error('❌ ERROR HANDLER - Erro capturado:');
  console.error('❌ Mensagem:', err.message);
  console.error('❌ Stack:', err.stack);
  console.error('❌ Erro completo:', err);
  console.error('='.repeat(60) + '\n');

  const status = err.status || 500;
  const message = err.message || 'Erro interno do servidor';

  res.status(status).json({
    error: {
      message,
      status,
      ...(process.env.NODE_ENV !== 'production' && {
        stack: err.stack,
        details: err.toString()
      })
    }
  });
};

