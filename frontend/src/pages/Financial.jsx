import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, DollarSign } from 'lucide-react';
import { financialService } from '../services/financialService';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Table from '../components/common/Table';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function Financial() {
  const [transactions, setTransactions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ type: 'income', category: '', description: '', amount: '', date: '', payment_method: '', notes: '' });

  useEffect(() => { loadTransactions(); }, []);

  const loadTransactions = async () => {
    try {
      const data = await financialService.getAll();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Erro:', error);
      setTransactions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await financialService.create(formData);
      setIsModalOpen(false);
      resetForm();
      loadTransactions();
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja excluir esta transação?')) {
      await financialService.delete(id);
      loadTransactions();
    }
  };

  const resetForm = () => {
    setFormData({ type: 'income', category: '', description: '', amount: '', date: '', payment_method: '', notes: '' });
    setEditing(null);
  };

  const columns = [
    { label: 'Tipo', render: (row) => <span className={`badge ${row.type === 'income' ? 'badge-success' : 'badge-danger'}`}>{row.type === 'income' ? 'Receita' : 'Despesa'}</span> },
    { label: 'Categoria', field: 'category' },
    { label: 'Descrição', field: 'description' },
    { label: 'Valor', render: (row) => formatCurrency(row.amount) },
    { label: 'Data', render: (row) => formatDate(row.date) },
    { label: 'Ações', className: 'text-right', render: (row) => (
      <div className="flex justify-end space-x-2">
        <button onClick={() => handleDelete(row.id)} className="p-2 hover:bg-red-100 text-red-600 rounded-lg"><Trash2 size={16} /></button>
      </div>
    )}
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financeiro</h1>
          <p className="text-gray-600 mt-1">Gerencie receitas e despesas</p>
        </div>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }}><Plus size={20} className="mr-2" />Nova Transação</Button>
      </div>

      <div className="card">
        <Table columns={columns} data={transactions} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title="Nova Transação">
        <form onSubmit={handleSubmit}>
          <Select label="Tipo" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} options={[
            { value: 'income', label: 'Receita' },
            { value: 'expense', label: 'Despesa' }
          ]} required />
          <Input label="Categoria" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
          <Input label="Descrição" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Valor (R$)" type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
            <Input label="Data" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
          </div>
          <Input label="Forma de Pagamento" value={formData.payment_method} onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })} />
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Observações</label>
            <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} className="input-field" />
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="secondary" onClick={() => { setIsModalOpen(false); resetForm(); }}>Cancelar</Button>
            <Button type="submit">Criar</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

