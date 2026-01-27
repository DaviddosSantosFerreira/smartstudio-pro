const db = require('../config/dbAdapter');

const getStats = async (req, res) => {
  try {
    // Receita Total (agendamentos completos com preço do serviço)
    const incomeResult = await db.get(
      `SELECT COALESCE(SUM(s.price), 0) as total 
       FROM appointments a
       JOIN services s ON a.service_id = s.id
       WHERE a.status = 'completed'`
    );
    const income = incomeResult ? incomeResult.total : 0;

    // Total de clientes
    const clientsResult = await db.get('SELECT COUNT(*) as total FROM clients');
    const clients = clientsResult ? clientsResult.total : 0;

    // Total de agendamentos
    const appointmentsResult = await db.get('SELECT COUNT(*) as total FROM appointments');
    const appointments = appointmentsResult ? appointmentsResult.total : 0;

    res.json({
      income: parseFloat(income) || 0,
      clients: parseInt(clients) || 0,
      appointments: parseInt(appointments) || 0
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ message: 'Erro ao buscar estatísticas' });
  }
};

module.exports = { getStats };
