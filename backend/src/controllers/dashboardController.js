const db = require('../config/database');
const { startOfMonth, endOfMonth, subMonths, format } = require('date-fns');

exports.getOverview = async (req, res, next) => {
  try {
    const now = new Date();
    const currentMonthStart = format(startOfMonth(now), 'yyyy-MM-dd');
    const currentMonthEnd = format(endOfMonth(now), 'yyyy-MM-dd');

    // Resumo financeiro do mês
    const financialSummary = await new Promise((resolve, reject) => {
      db.get(
        `SELECT 
          COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income,
          COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expense,
          COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) as balance
         FROM financial_transactions 
         WHERE date BETWEEN ? AND ?`,
        [currentMonthStart, currentMonthEnd],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    // Total de clientes
    const totalClients = await new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as total FROM clients', (err, row) => {
        if (err) reject(err);
        else resolve(row.total);
      });
    });

    // Agendamentos do dia
    const today = format(now, 'yyyy-MM-dd');
    const todayAppointments = await new Promise((resolve, reject) => {
      db.get(
        'SELECT COUNT(*) as total FROM appointments WHERE date = ? AND status != "cancelled"',
        [today],
        (err, row) => {
          if (err) reject(err);
          else resolve(row.total);
        }
      );
    });

    // Próximos agendamentos
    const upcomingAppointments = await new Promise((resolve, reject) => {
      db.all(
        `SELECT a.*, 
                c.name as client_name,
                p.name as professional_name, p.color as professional_color,
                s.name as service_name
         FROM appointments a
         LEFT JOIN clients c ON a.client_id = c.id
         LEFT JOIN professionals p ON a.professional_id = p.id
         LEFT JOIN services s ON a.service_id = s.id
         WHERE a.date >= ? AND a.status IN ('scheduled', 'confirmed')
         ORDER BY a.date, a.time
         LIMIT 5`,
        [today],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    // Serviços mais vendidos
    const topServices = await new Promise((resolve, reject) => {
      db.all(
        `SELECT s.name, COUNT(*) as count, SUM(s.price) as revenue
         FROM appointments a
         JOIN services s ON a.service_id = s.id
         WHERE a.date BETWEEN ? AND ? AND a.status = 'completed'
         GROUP BY s.id
         ORDER BY count DESC
         LIMIT 5`,
        [currentMonthStart, currentMonthEnd],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    // Produtos com estoque baixo
    const lowStockProducts = await new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM products WHERE stock <= min_stock AND active = 1 ORDER BY stock LIMIT 5',
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    // Evolução dos últimos 6 meses
    const monthlyRevenue = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(now, i);
      const monthStart = format(startOfMonth(monthDate), 'yyyy-MM-dd');
      const monthEnd = format(endOfMonth(monthDate), 'yyyy-MM-dd');

      const monthData = await new Promise((resolve, reject) => {
        db.get(
          `SELECT 
            COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as income,
            COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as expense
           FROM financial_transactions 
           WHERE date BETWEEN ? AND ?`,
          [monthStart, monthEnd],
          (err, row) => {
            if (err) reject(err);
            else resolve({
              month: format(monthDate, 'MMM/yy'),
              ...row
            });
          }
        );
      });

      monthlyRevenue.push(monthData);
    }

    res.json({
      financial: financialSummary,
      stats: {
        totalClients,
        todayAppointments
      },
      upcomingAppointments,
      topServices,
      lowStockProducts,
      monthlyRevenue
    });
  } catch (error) {
    next(error);
  }
};

