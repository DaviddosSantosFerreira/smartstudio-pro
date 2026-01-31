const Appointment = require('../models/Appointment');
const pool = require('../config/database');

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
    const { client_id, client_name, client_phone, professional_id, service_id, date, time, notes } = req.body;
    
    let finalClientId = client_id;
    
    // Se não tem client_id mas tem client_name e client_phone (booking público)
    if (!finalClientId && client_name && client_phone) {
      // Buscar cliente existente pelo telefone
      const existingClient = await pool.query(
        'SELECT id FROM clients WHERE phone = $1',
        [client_phone]
      );
      
      if (existingClient.rows.length > 0) {
        finalClientId = existingClient.rows[0].id;
      } else {
        // Criar novo cliente
        const newClient = await pool.query(
          'INSERT INTO clients (name, phone) VALUES ($1, $2) RETURNING id',
          [client_name, client_phone]
        );
        finalClientId = newClient.rows[0].id;
      }
    }
    
    if (!finalClientId) {
      return res.status(400).json({ error: 'Cliente é obrigatório' });
    }

    const appointment = await Appointment.create({
      client_id: finalClientId,
      professional_id,
      service_id,
      date,
      time,
      notes
    });
    
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

// Buscar horários disponíveis para uma data específica
const getAvailableTimes = async (req, res) => {
  try {
    const { date, professional_id, service_id } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Data é obrigatória' });
    }

    // Buscar configurações do estúdio para horários de funcionamento
    const studioQuery = await pool.query('SELECT * FROM studio_settings WHERE id = 1');
    const studio = studioQuery.rows[0];

    // Buscar duração do serviço (se informado)
    let serviceDuration = 30; // padrão 30 minutos
    if (service_id) {
      const serviceQuery = await pool.query('SELECT duration FROM services WHERE id = $1', [service_id]);
      if (serviceQuery.rows[0]) {
        serviceDuration = serviceQuery.rows[0].duration || 30;
      }
    }

    // Determinar dia da semana (0 = domingo, 1 = segunda, etc)
    const dateObj = new Date(date + 'T12:00:00');
    const dayOfWeek = dateObj.getDay();
    
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[dayOfWeek];

    // Buscar horário de funcionamento do dia
    const openTime = studio ? studio[`${dayName}_open`] : '09:00';
    const closeTime = studio ? studio[`${dayName}_close`] : '18:00';

    // Se não há horário de funcionamento (estúdio fechado)
    if (!openTime || !closeTime) {
      return res.json({ availableTimes: [], message: 'Estúdio fechado neste dia' });
    }

    // Buscar agendamentos existentes para a data (e profissional se informado)
    let appointmentsQuery = `
      SELECT a.time, s.duration 
      FROM appointments a
      LEFT JOIN services s ON a.service_id = s.id
      WHERE a.date = $1 
      AND a.status != 'cancelled'
    `;
    const queryParams = [date];

    if (professional_id) {
      appointmentsQuery += ' AND a.professional_id = $2';
      queryParams.push(professional_id);
    }

    const appointmentsResult = await pool.query(appointmentsQuery, queryParams);
    const existingAppointments = appointmentsResult.rows;

    // Gerar todos os slots de horário do dia
    const allSlots = [];
    const [openHour, openMin] = openTime.split(':').map(Number);
    const [closeHour, closeMin] = closeTime.split(':').map(Number);
    
    let currentHour = openHour;
    let currentMin = openMin;

    while (currentHour < closeHour || (currentHour === closeHour && currentMin < closeMin)) {
      const timeStr = `${String(currentHour).padStart(2, '0')}:${String(currentMin).padStart(2, '0')}`;
      
      // Verificar se o serviço cabe antes do fechamento
      const slotEndMinutes = currentHour * 60 + currentMin + serviceDuration;
      const closeMinutes = closeHour * 60 + closeMin;
      
      if (slotEndMinutes <= closeMinutes) {
        allSlots.push(timeStr);
      }
      
      // Avançar 30 minutos
      currentMin += 30;
      if (currentMin >= 60) {
        currentMin = 0;
        currentHour++;
      }
    }

    // Filtrar slots ocupados
    const availableTimes = allSlots.filter(slot => {
      const [slotHour, slotMin] = slot.split(':').map(Number);
      const slotStartMinutes = slotHour * 60 + slotMin;
      const slotEndMinutes = slotStartMinutes + serviceDuration;

      // Verificar conflito com cada agendamento existente
      for (const appt of existingAppointments) {
        const [apptHour, apptMin] = appt.time.split(':').map(Number);
        const apptDuration = appt.duration || 30;
        const apptStartMinutes = apptHour * 60 + apptMin;
        const apptEndMinutes = apptStartMinutes + apptDuration;

        // Há conflito se os intervalos se sobrepõem
        if (slotStartMinutes < apptEndMinutes && slotEndMinutes > apptStartMinutes) {
          return false;
        }
      }
      return true;
    });

    res.json({ 
      availableTimes,
      openTime,
      closeTime,
      serviceDuration
    });

  } catch (error) {
    console.error('Erro ao buscar horários disponíveis:', error);
    res.status(500).json({ error: 'Erro ao buscar horários disponíveis' });
  }
};

exports.getAvailableTimes = getAvailableTimes;

