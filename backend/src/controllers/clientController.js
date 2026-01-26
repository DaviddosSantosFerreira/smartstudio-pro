const Client = require('../models/Client');

exports.getAll = async (req, res, next) => {
  try {
    console.log('📋 Controller.getAll - Buscando todos os clientes...');
    const clients = await Client.getAll();
    console.log('📋 Controller.getAll - Clientes encontrados:', clients.length);
    console.log('📋 Controller.getAll - Dados:', JSON.stringify(clients, null, 2));
    res.json(clients);
  } catch (error) {
    console.error('❌ Controller.getAll - Erro:', error);
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
  console.log('='.repeat(50));
  console.log('📝 Controller.create - NOVA REQUISIÇÃO');
  console.log('📝 Controller.create - Body:', JSON.stringify(req.body, null, 2));
  console.log('📝 Controller.create - NODE_ENV:', process.env.NODE_ENV);
  
  try {
    if (!req.body) {
      console.error('❌ Controller.create - Body vazio!');
      return res.status(400).json({ error: 'Corpo da requisição está vazio' });
    }
    
    if (!req.body.name) {
      console.error('❌ Controller.create - Nome não fornecido!');
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }
    
    console.log('📝 Controller.create - Chamando Client.create...');
    const client = await Client.create(req.body);
    
    console.log('✅ Controller.create - Cliente retornado do modelo:', JSON.stringify(client, null, 2));
    
    if (!client || !client.id) {
      console.error('❌ Controller.create - Cliente sem ID!', client);
      return res.status(500).json({ error: 'Cliente criado mas sem ID retornado' });
    }
    
    console.log('✅ Controller.create - Enviando resposta 201 com cliente:', JSON.stringify(client, null, 2));
    res.status(201).json(client);
    console.log('✅ Controller.create - Resposta enviada com sucesso');
  } catch (error) {
    console.error('❌ Controller.create - ERRO CAPTURADO:', error);
    console.error('❌ Controller.create - Mensagem:', error.message);
    console.error('❌ Controller.create - Stack:', error.stack);
    
    // SEMPRE retornar erro, não usar next() para garantir que o erro seja enviado
    const status = error.status || 500;
    const message = error.message || 'Erro ao criar cliente';
    
    res.status(status).json({ 
      error: {
        message: message,
        ...(process.env.NODE_ENV !== 'production' && { stack: error.stack, details: error })
      }
    });
  }
  console.log('='.repeat(50));
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

