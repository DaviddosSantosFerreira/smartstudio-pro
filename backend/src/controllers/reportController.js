const db = require('../config/dbAdapter');

exports.getServiceReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    const report = await db.all(
      `SELECT s.name, 
              COUNT(*) as total_appointments,
              SUM(s.price) as total_revenue,
              AVG(s.price) as avg_price
       FROM appointments a
       JOIN services s ON a.service_id = s.id
       WHERE a.date BETWEEN $1 AND $2 AND a.status = 'completed'
       GROUP BY s.id, s.name
       ORDER BY total_revenue DESC`,
      [startDate, endDate]
    );

    res.json(report || []);
  } catch (error) {
    next(error);
  }
};

exports.getProfessionalReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    const report = await db.all(
      `SELECT p.name, 
              p.commission_percentage,
              COUNT(*) as total_appointments,
              SUM(s.price) as total_revenue,
              SUM(s.price * p.commission_percentage / 100) as total_commission
       FROM appointments a
       JOIN professionals p ON a.professional_id = p.id
       JOIN services s ON a.service_id = s.id
       WHERE a.date BETWEEN $1 AND $2 AND a.status = 'completed'
       GROUP BY p.id, p.name, p.commission_percentage
       ORDER BY total_revenue DESC`,
      [startDate, endDate]
    );

    res.json(report || []);
  } catch (error) {
    next(error);
  }
};

exports.getFinancialReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    
    const summary = await db.get(
      `SELECT 
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expense,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) as balance
       FROM financial_transactions 
       WHERE date BETWEEN $1 AND $2`,
      [startDate, endDate]
    );

    const byCategory = await db.all(
      `SELECT category, type, SUM(amount) as total
       FROM financial_transactions
       WHERE date BETWEEN $1 AND $2
       GROUP BY category, type
       ORDER BY total DESC`,
      [startDate, endDate]
    );

    res.json({
      summary: summary || { total_income: 0, total_expense: 0, balance: 0 },
      byCategory: byCategory || []
    });
  } catch (error) {
    next(error);
  }
};
