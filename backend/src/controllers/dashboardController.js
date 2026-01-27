const db = require('../config/dbAdapter');
const { startOfMonth, endOfMonth, subMonths, format } = require('date-fns');

exports.getOverview = async (req, res, next) => {
  try {
    const now = new Date();
    const currentMonthStart = format(startOfMonth(now), 'yyyy-MM-dd');
    const currentMonthEnd = format(endOfMonth(now), 'yyyy-MM-dd');

    // Resumo financeiro do mês
    const financialSummary = await db.get(
      `SELECT 
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expense,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) as balance
       FROM financial_transactions 
       WHERE date BETWEEN $1 AND $2`,
      [currentMonthStart, currentMonthEnd]
    );

    // Total de clientes
    const clientsResult = await db.get('SELECT COUNT(*) as total FROM clients');
    const totalClients = clientsResult ? clientsResult.total : 0;

    // Agendamentos do dia
    const today = format(now, 'yyyy-MM-dd');
    const todayResult = await db.get(
      "SELECT COUNT(*) as total FROM appointments WHERE date = $1 AND status != 'cancelled'",
      [today]
    );
    const todayAppointments = todayResult ? todayResult.total : 0;

    // Próximos agendamentos
    const upcomingAppointments = await db.all(
      `SELECT a.*, 
              c.name as client_name,
              p.name as professional_name, p.color as professional_color,
              s.name as service_name
       FROM appointments a
       LEFT JOIN clients c ON a.client_id = c.id
       LEFT JOIN professionals p ON a.professional_id = p.id
       LEFT JOIN services s ON a.service_id = s.id
       WHERE a.date >= $1 AND a.status IN ('scheduled', 'confirmed')
       ORDER BY a.date, a.time
       LIMIT 5`,
      [today]
    );

    // Serviços mais vendidos
    const topServices = await db.all(
      `SELECT s.name, COUNT(*) as count, SUM(s.price) as revenue
       FROM appointments a
       JOIN services s ON a.service_id = s.id
       WHERE a.date BETWEEN $1 AND $2 AND a.status = 'completed'
       GROUP BY s.id, s.name
       ORDER BY count DESC
       LIMIT 5`,
      [currentMonthStart, currentMonthEnd]
    );

    // Produtos com estoque baixo
    const lowStockProducts = await db.all(
      'SELECT * FROM products WHERE stock <= min_stock AND active = true ORDER BY stock LIMIT 5'
    );

    // Evolução dos últimos 6 meses
    const monthlyRevenue = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthStart = format(startOfMonth(monthDate), 'yyyy-MM-dd');
      const monthEnd = format(endOfMonth(monthDate), 'yyyy-MM-dd');

      const monthData = await db.get(
        `SELECT 
          COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income,
          COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expense
         FROM financial_transactions 
         WHERE date BETWEEN $1 AND $2`,
        [monthStart, monthEnd]
      );

      monthlyRevenue.push({
        month: format(monthDate, 'MMM/yy'),
        income: monthData ? monthData.income : 0,
        expense: monthData ? monthData.expense : 0
      });
    }

    res.json({
      financial: financialSummary || { income: 0, expense: 0, balance: 0 },
      stats: {
        totalClients,
        todayAppointments
      },
      upcomingAppointments: upcomingAppointments || [],
      topServices: topServices || [],
      lowStockProducts: lowStockProducts || [],
      monthlyRevenue
    });
  } catch (error) {
    next(error);
  }
};
