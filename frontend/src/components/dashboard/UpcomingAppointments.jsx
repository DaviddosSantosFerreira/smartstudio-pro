import React from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import { formatDate, formatTime } from '../../utils/formatters';

export default function UpcomingAppointments({ appointments }) {
  return (
    <div className="card">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Próximos Agendamentos</h3>
      <div className="space-y-3">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div 
                className="w-1 h-16 rounded-full"
                style={{ backgroundColor: appointment.professional_color }}
              />
              <div>
                <p className="font-semibold text-gray-900">{appointment.client_name}</p>
                <p className="text-sm text-gray-600">{appointment.service_name}</p>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="flex items-center text-sm text-gray-500">
                    <User size={14} className="mr-1" />
                    {appointment.professional_name}
                  </span>
                  <span className="flex items-center text-sm text-gray-500">
                    <Calendar size={14} className="mr-1" />
                    {formatDate(appointment.date)}
                  </span>
                  <span className="flex items-center text-sm text-gray-500">
                    <Clock size={14} className="mr-1" />
                    {formatTime(appointment.time)}
                  </span>
                </div>
              </div>
            </div>
            <span className="badge badge-primary">
              {appointment.status === 'scheduled' ? 'Agendado' : 'Confirmado'}
            </span>
          </div>
        ))}
        {appointments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calendar size={48} className="mx-auto mb-2 opacity-50" />
            <p>Nenhum agendamento próximo</p>
          </div>
        )}
      </div>
    </div>
  );
}

