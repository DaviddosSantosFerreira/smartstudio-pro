const Appointment = require('../models/Appointment');

exports.getAll = async (req, res, next) => {
  try {
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      professionalId: req.query.professionalId,
      status: req.query.status
    };
    
    const appointments = await Appointment.getAll(filters);
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

exports.getByDate = async (req, res, next) => {
  try {
    const { date } = req.params;
    const appointments = await Appointment.getByDate(date);
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const appointment = await Appointment.getById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Agendamento não encontrado' });
    }
    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const appointment = await Appointment.create(req.body);
    res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const appointment = await Appointment.update(req.params.id, req.body);
    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    await Appointment.updateStatus(req.params.id, status);
    res.json({ message: 'Status atualizado com sucesso' });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await Appointment.delete(req.params.id);
    res.json({ message: 'Agendamento deletado com sucesso' });
  } catch (error) {
    next(error);
  }
};

exports.getUpcoming = async (req, res, next) => {
  try {
    const appointments = await Appointment.getUpcoming();
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

