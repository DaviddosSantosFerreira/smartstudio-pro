const db = require('../config/dbAdapter');

exports.getSettings = async (req, res, next) => {
  try {
    const settings = await db.get('SELECT * FROM orientation_settings WHERE id = 1');
    
    // Converter strings para números (PostgreSQL retorna DECIMAL como string)
    if (settings) {
      settings.prolabore_percentage = parseFloat(settings.prolabore_percentage) || 0;
      settings.reinvestment_percentage = parseFloat(settings.reinvestment_percentage) || 0;
      settings.reserve_percentage = parseFloat(settings.reserve_percentage) || 0;
      settings.tax_percentage = parseFloat(settings.tax_percentage) || 0;
    }
    
    res.json(settings || {});
  } catch (error) {
    next(error);
  }
};

exports.updateSettings = async (req, res, next) => {
  try {
    const { prolabore_percentage, reinvestment_percentage, reserve_percentage, tax_percentage } = req.body;
    
    await db.run(
      `UPDATE orientation_settings 
       SET prolabore_percentage = $1, reinvestment_percentage = $2, reserve_percentage = $3, tax_percentage = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = 1`,
      [prolabore_percentage, reinvestment_percentage, reserve_percentage, tax_percentage]
    );

    res.json({ message: 'Configurações atualizadas com sucesso' });
  } catch (error) {
    next(error);
  }
};

exports.calculateDistribution = async (req, res, next) => {
  try {
    const { monthlyRevenue } = req.body;

    const settings = await db.get('SELECT * FROM orientation_settings WHERE id = 1');

    if (!settings) {
      return res.status(404).json({ error: 'Configurações não encontradas' });
    }

    // Converter strings para números
    const prolabore = parseFloat(settings.prolabore_percentage) || 0;
    const reinvestment = parseFloat(settings.reinvestment_percentage) || 0;
    const reserve = parseFloat(settings.reserve_percentage) || 0;
    const taxes = parseFloat(settings.tax_percentage) || 0;

    const distribution = {
      revenue: monthlyRevenue,
      prolabore: (monthlyRevenue * prolabore) / 100,
      reinvestment: (monthlyRevenue * reinvestment) / 100,
      reserve: (monthlyRevenue * reserve) / 100,
      taxes: (monthlyRevenue * taxes) / 100
    };

    distribution.operational = monthlyRevenue - 
      (distribution.prolabore + distribution.reinvestment + distribution.reserve + distribution.taxes);

    res.json(distribution);
  } catch (error) {
    next(error);
  }
};
