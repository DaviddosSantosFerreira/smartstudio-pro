const Service = require('../models/Service');

exports.getAll = async (req, res, next) => {
  try {
    const services = await Service.getAll();
    res.json(services);
  } catch (error) {
    next(error);
  }
};

exports.getActive = async (req, res, next) => {
  try {
    const services = await Service.getActive();
    res.json(services);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const service = await Service.getById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Serviço não encontrado' });
    }
    res.json(service);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const service = await Service.update(req.params.id, req.body);
    res.json(service);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await Service.delete(req.params.id);
    res.json({ message: 'Serviço deletado com sucesso' });
  } catch (error) {
    next(error);
  }
};

