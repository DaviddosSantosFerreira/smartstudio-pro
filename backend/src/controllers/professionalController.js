const Professional = require('../models/Professional');

exports.getAll = async (req, res, next) => {
  try {
    const professionals = await Professional.getAll();
    res.json(professionals);
  } catch (error) {
    next(error);
  }
};

exports.getActive = async (req, res, next) => {
  try {
    const professionals = await Professional.getActive();
    res.json(professionals);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const professional = await Professional.getById(req.params.id);
    if (!professional) {
      return res.status(404).json({ message: 'Profissional não encontrado' });
    }
    res.json(professional);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const professional = await Professional.create(req.body);
    res.status(201).json(professional);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const professional = await Professional.update(req.params.id, req.body);
    res.json(professional);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await Professional.delete(req.params.id);
    res.json({ message: 'Profissional deletado com sucesso' });
  } catch (error) {
    next(error);
  }
};

