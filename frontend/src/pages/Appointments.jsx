import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import { appointmentService } from '../services/appointmentService';
import { clientService } from '../services/clientService';
import { professionalService } from '../services/professionalService';
import { serviceService } from '../services/serviceService';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Table from '../components/common/Table';
import { formatDate, formatTime } from '../utils/formatters';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ client_id: '', professional_id: '', service_id: '', date: '', time: '', status: 'scheduled', notes: '' });

  useEffect(() => {
    loadAppointments();
    loadClients();
    loadProfessionals();
    loadServices();
  }, []);

  const loadAppointments = async () => {
    const data = await appointmentService.getAll();
    setAppointments(data);
  };

  const loadClients = async () => {
    const data = await clientService.getAll();
    setClients(data);
  };

  const loadProfessionals = async () => {
    const data = await professionalService.getActive();
    setProfessionals(data);
  };

  const loadServices = async () => {
    const data = await serviceService.getActive();
    setServices(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await appointmentService.update(editing.id, formData);
      } else {
        await appointmentService.create(formData);
      }
      setIsModalOpen(false);
      resetForm();
      loadAppointments();
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja excluir este agendamento?')) {
      await appointmentService.delete(id);
      loadAppointments();
    }
  };

  const resetForm = () => {
    setFormData({ client_id: '', professional_id: '', service_id: '', date: '', time: '', status: 'scheduled', notes: '' });
    setEditing(null);
  };

  const columns = [
    { label: 'Cliente', field: 'client_name' },
    { label: 'Profissional', field: 'professional_name' },
    { label: 'Serviço', field: 'service_name' },
    { label: 'Data', render: (row) => formatDate(row.date) },
    { label: 'Hora', field: 'time' },
    { label: 'Status', render: (row) => {
      const statusMap = { scheduled: 'Agendado', confirmed: 'Confirmado', completed: 'Concluído', cancelled: 'Cancelado' };
      return <span className={`badge ${row.status === 'completed' ? 'badge-success' : row.status === 'cancelled' ? 'badge-danger' : 'badge-primary'}`}>{statusMap[row.status]}</span>;
    }},
    { label: 'Ações', className: 'text-right', render: (row) => (
      <div className="flex justify-end space-x-2">
        <button onClick={() => { setEditing(row); setFormData({ ...row, client_id: row.client_id.toString(), professional_id: row.professional_id.toString(), service_id: row.service_id.toString() }); setIsModalOpen(true); }} className="p-2 hover:bg-gray-100 rounded-lg"><Edit2 size={16} /></button>
        <button onClick={() => handleDelete(row.id)} className="p-2 hover:bg-red-100 text-red-600 rounded-lg"><Trash2 size={16} /></button>
      </div>
    )}
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agendamentos</h1>
          <p className="text-gray-600 mt-1">Gerencie sua agenda</p>
        </div>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }}><Plus size={20} className="mr-2" />Novo Agendamento</Button>
      </div>

      <div className="card">
        <Table columns={columns} data={appointments} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editing ? 'Editar Agendamento' : 'Novo Agendamento'}>
        <form onSubmit={handleSubmit}>
          <Select label="Cliente" value={formData.client_id} onChange={(e) => setFormData({ ...formData, client_id: e.target.value })} options={clients.map(c => ({ value: c.id, label: c.name }))} required />
          <Select label="Profissional" value={formData.professional_id} onChange={(e) => setFormData({ ...formData, professional_id: e.target.value })} options={professionals.map(p => ({ value: p.id, label: p.name }))} required />
          <Select label="Serviço" value={formData.service_id} onChange={(e) => setFormData({ ...formData, service_id: e.target.value })} options={services.map(s => ({ value: s.id, label: s.name }))} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Data" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
            <Input label="Hora" type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} required />
          </div>
          <Select label="Status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} options={[
            { value: 'scheduled', label: 'Agendado' },
            { value: 'confirmed', label: 'Confirmado' },
            { value: 'completed', label: 'Concluído' },
            { value: 'cancelled', label: 'Cancelado' }
          ]} />
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Observações</label>
            <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} className="input-field" />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="secondary" onClick={() => { setIsModalOpen(false); resetForm(); }}>Cancelar</Button>
            <Button type="submit">{editing ? 'Atualizar' : 'Criar'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

