const db = require('../config/dbAdapter');

exports.getSettings = async (req, res, next) => {
  try {
    const settings = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM orientation_settings WHERE id = 1', (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

exports.updateSettings = async (req, res, next) => {
  try {
    const { prolabore_percentage, reinvestment_percentage, reserve_percentage, tax_percentage } = req.body;
    
    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE orientation_settings 
         SET prolabore_percentage = ?, reinvestment_percentage = ?, reserve_percentage = ?, tax_percentage = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = 1`,
        [prolabore_percentage, reinvestment_percentage, reserve_percentage, tax_percentage],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    res.json({ message: 'Configurações atualizadas com sucesso' });
  } catch (error) {
    next(error);
  }
};

exports.calculateDistribution = async (req, res, next) => {
  try {
    const { monthlyRevenue } = req.body;

    const settings = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM orientation_settings WHERE id = 1', (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    const distribution = {
      revenue: monthlyRevenue,
      prolabore: (monthlyRevenue * settings.prolabore_percentage) / 100,
      reinvestment: (monthlyRevenue * settings.reinvestment_percentage) / 100,
      reserve: (monthlyRevenue * settings.reserve_percentage) / 100,
      taxes: (monthlyRevenue * settings.tax_percentage) / 100
    };

    distribution.operational = monthlyRevenue - 
      (distribution.prolabore + distribution.reinvestment + distribution.reserve + distribution.taxes);

    res.json(distribution);
  } catch (error) {
    next(error);
  }
};

