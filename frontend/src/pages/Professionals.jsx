import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { professionalService } from '../services/professionalService';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Table from '../components/common/Table';

export default function Professionals() {
  const [professionals, setProfessionals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', specialty: '', phone: '', email: '', commission_percentage: 50, color: '#3b82f6', active: 1 });

  useEffect(() => { loadProfessionals(); }, []);

  const loadProfessionals = async () => {
    const data = await professionalService.getAll();
    setProfessionals(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await professionalService.update(editing.id, formData);
      } else {
        await professionalService.create(formData);
      }
      setIsModalOpen(false);
      resetForm();
      loadProfessionals();
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', specialty: '', phone: '', email: '', commission_percentage: 50, color: '#3b82f6', active: 1 });
    setEditing(null);
  };

  const columns = [
    { label: 'Nome', field: 'name' },
    { label: 'Especialidade', field: 'specialty' },
    { label: 'Comissão (%)', render: (row) => `${row.commission_percentage}%` },
    { label: 'Status', render: (row) => <span className={`badge ${row.active ? 'badge-success' : 'badge-danger'}`}>{row.active ? 'Ativo' : 'Inativo'}</span> },
    { label: 'Ações', className: 'text-right', render: (row) => (
      <div className="flex justify-end space-x-2">
        <button onClick={() => { setEditing(row); setFormData(row); setIsModalOpen(true); }} className="p-2 hover:bg-gray-100 rounded-lg"><Edit2 size={16} /></button>
        <button onClick={() => professionalService.delete(row.id).then(loadProfessionals)} className="p-2 hover:bg-red-100 text-red-600 rounded-lg"><Trash2 size={16} /></button>
      </div>
    )}
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profissionais</h1>
          <p className="text-gray-600 mt-1">Gerencie sua equipe</p>
        </div>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }}><Plus size={20} className="mr-2" />Novo Profissional</Button>
      </div>

      <div className="card"><Table columns={columns} data={professionals} /></div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editing ? 'Editar Profissional' : 'Novo Profissional'}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Nome" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            <Input label="Especialidade" value={formData.specialty} onChange={(e) => setFormData({ ...formData, specialty: e.target.value })} />
            <Input label="Telefone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <Input label="Comissão (%)" type="number" value={formData.commission_percentage} onChange={(e) => setFormData({ ...formData, commission_percentage: e.target.value })} />
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cor</label>
              <input type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="h-10 w-full rounded-lg border border-gray-300 cursor-pointer" />
            </div>
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

