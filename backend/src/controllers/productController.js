const Product = require('../models/Product');

exports.getAll = async (req, res, next) => {
  try {
    const products = await Product.getAll();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

exports.getLowStock = async (req, res, next) => {
  try {
    const products = await Product.getLowStock();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const product = await Product.update(req.params.id, req.body);
    res.json(product);
  } catch (error) {
    next(error);
  }
};

exports.updateStock = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    await Product.updateStock(req.params.id, quantity);
    res.json({ message: 'Estoque atualizado com sucesso' });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await Product.delete(req.params.id);
    res.json({ message: 'Produto deletado com sucesso' });
  } catch (error) {
    next(error);
  }
};

