import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { serviceService } from '../services/serviceService';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Table from '../components/common/Table';
import { formatCurrency } from '../utils/formatters';

export default function Services() {
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', duration: '', price: '', active: 1 });

  useEffect(() => { loadServices(); }, []);

  const loadServices = async () => {
    const data = await serviceService.getAll();
    setServices(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await serviceService.update(editing.id, formData);
      } else {
        await serviceService.create(formData);
      }
      setIsModalOpen(false);
      resetForm();
      loadServices();
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja excluir este serviço?')) {
      await serviceService.delete(id);
      loadServices();
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', duration: '', price: '', active: 1 });
    setEditing(null);
  };

  const columns = [
    { label: 'Serviço', field: 'name' },
    { label: 'Descrição', field: 'description' },
    { label: 'Duração (min)', field: 'duration' },
    { label: 'Preço', render: (row) => formatCurrency(row.price) },
    { label: 'Status', render: (row) => <span className={`badge ${row.active ? 'badge-success' : 'badge-danger'}`}>{row.active ? 'Ativo' : 'Inativo'}</span> },
    { label: 'Ações', className: 'text-right', render: (row) => (
      <div className="flex justify-end space-x-2">
        <button onClick={() => { setEditing(row); setFormData(row); setIsModalOpen(true); }} className="p-2 hover:bg-gray-100 rounded-lg"><Edit2 size={16} /></button>
        <button onClick={() => handleDelete(row.id)} className="p-2 hover:bg-red-100 text-red-600 rounded-lg"><Trash2 size={16} /></button>
      </div>
    )}
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Serviços</h1>
          <p className="text-gray-600 mt-1">Gerencie os serviços oferecidos</p>
        </div>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }}><Plus size={20} className="mr-2" />Novo Serviço</Button>
      </div>

      <div className="card">
        <Table columns={columns} data={services} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editing ? 'Editar Serviço' : 'Novo Serviço'}>
        <form onSubmit={handleSubmit}>
          <Input label="Nome do Serviço" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <Input label="Descrição" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Duração (minutos)" type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} required />
            <Input label="Preço (R$)" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
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

