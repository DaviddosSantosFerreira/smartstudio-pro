import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { clientService } from '../services/clientService';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Table from '../components/common/Table';
import { formatPhone } from '../utils/formatters';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', cpf: '', birth_date: '', address: '', notes: ''
  });

  useEffect(() => {
    console.log('🔵 useEffect executado - carregando clientes...');
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      console.log('🔵 loadClients - Chamando API...');
      const data = await clientService.getAll();
      console.log('🔵 loadClients - Dados recebidos:', data);
      setClients(Array.isArray(data) ? data : []);
      console.log('🔵 loadClients - Clientes definidos:', data);
    } catch (error) {
      console.error('❌ loadClients - Erro:', error);
      setClients([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('📝 handleSubmit - Iniciando envio do formulário');
      console.log('📝 handleSubmit - formData:', formData);
      console.log('📝 handleSubmit - editing:', editing);
      
      if (editing) {
        console.log('📝 handleSubmit - Modo: EDITAR');
        await clientService.update(editing.id, formData);
        console.log('✅ handleSubmit - Cliente atualizado');
      } else {
        console.log('📝 handleSubmit - Modo: CRIAR');
        const result = await clientService.create(formData);
        console.log('✅ handleSubmit - Cliente criado:', result);
      }
      
      setIsModalOpen(false);
      resetForm();
      
      console.log('📝 handleSubmit - Recarregando lista de clientes...');
      await loadClients();
      console.log('✅ handleSubmit - Lista de clientes recarregada');
    } catch (error) {
      console.error('❌ handleSubmit - Erro completo:', error);
      console.error('❌ handleSubmit - Response:', error.response);
      console.error('❌ handleSubmit - Data:', error.response?.data);
      console.error('❌ handleSubmit - Message:', error.message);
      
      const errorMessage = error.response?.data?.error?.message 
        || error.response?.data?.message 
        || error.message 
        || 'Erro desconhecido ao salvar cliente';
      
      alert('Erro ao salvar cliente:\n\n' + errorMessage);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir este cliente?')) {
      try {
        await clientService.delete(id);
        loadClients();
      } catch (error) {
        console.error('Erro:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', phone: '', email: '', cpf: '', birth_date: '', address: '', notes: '' });
    setEditing(null);
  };

  const filteredClients = (Array.isArray(clients) ? clients : []).filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.phone && c.phone.includes(searchTerm)) ||
    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const columns = [
    { label: 'Nome', field: 'name' },
    { label: 'Telefone', render: (row) => formatPhone(row.phone) },
    { label: 'Email', field: 'email' },
    { 
      label: 'Ações', 
      className: 'text-right',
      render: (row) => (
        <div className="flex justify-end space-x-2">
          <button onClick={() => { setEditing(row); setFormData(row); setIsModalOpen(true); }} className="p-2 hover:bg-gray-100 rounded-lg">
            <Edit2 size={16} />
          </button>
          <button onClick={() => handleDelete(row.id)} className="p-2 hover:bg-red-100 text-red-600 rounded-lg">
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600 mt-1">Gerencie sua base de clientes</p>
        </div>
        <button type="button" onClick={() => { resetForm(); setIsModalOpen(true); }} className="inline-flex items-center justify-center px-4 py-2.5 bg-primary-600 text-white rounded-lg font-medium transition-all duration-200 hover:bg-primary-700 shadow-sm hover:shadow-md">
          <Plus size={20} className="mr-2" />
          Novo Cliente
        </button>
      </div>

      <div className="card">
        <div className="mb-4">
          <Input
            placeholder="Buscar por nome, telefone ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
        </div>
        <Table columns={columns} data={filteredClients} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editing ? 'Editar Cliente' : 'Novo Cliente'}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nome" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            <Input label="Telefone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <Input label="CPF" value={formData.cpf} onChange={(e) => setFormData({ ...formData, cpf: e.target.value })} />
            <Input label="Data de Nascimento" type="date" value={formData.birth_date} onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })} />
            <Input label="Endereço" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
          </div>
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

