const Financial = require('../models/Financial');

exports.getAll = async (req, res, next) => {
  try {
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      type: req.query.type
    };
    
    const transactions = await Financial.getAll(filters);
    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const transaction = await Financial.create(req.body);
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

exports.getSummary = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const summary = await Financial.getSummary(startDate, endDate);
    res.json(summary);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await Financial.delete(req.params.id);
    res.json({ message: 'Transação deletada com sucesso' });
  } catch (error) {
    next(error);
  }
};

