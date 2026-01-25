const Client = require('../models/Client');

exports.getAll = async (req, res, next) => {
  try {
    const clients = await Client.getAll();
    res.json(clients);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const client = await Client.getById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }
    res.json(client);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const client = await Client.update(req.params.id, req.body);
    res.json(client);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await Client.delete(req.params.id);
    res.json({ message: 'Cliente deletado com sucesso' });
  } catch (error) {
    next(error);
  }
};

exports.search = async (req, res, next) => {
  try {
    const { term } = req.query;
    const clients = await Client.search(term);
    res.json(clients);
  } catch (error) {
    next(error);
  }
};

