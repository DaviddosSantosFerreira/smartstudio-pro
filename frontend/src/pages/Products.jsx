import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';
import { productService } from '../services/productService';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Table from '../components/common/Table';
import { formatCurrency } from '../utils/formatters';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', stock: 0, min_stock: 0, active: 1 });

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    const data = await productService.getAll();
    setProducts(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await productService.update(editing.id, formData);
      } else {
        await productService.create(formData);
      }
      setIsModalOpen(false);
      resetForm();
      loadProducts();
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja excluir este produto?')) {
      await productService.delete(id);
      loadProducts();
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', stock: 0, min_stock: 0, active: 1 });
    setEditing(null);
  };

  const columns = [
    { label: 'Produto', field: 'name' },
    { label: 'Descrição', field: 'description' },
    { label: 'Preço', render: (row) => formatCurrency(row.price) },
    { label: 'Estoque', field: 'stock' },
    { label: 'Estoque Mín.', field: 'min_stock' },
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
          <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
          <p className="text-gray-600 mt-1">Gerencie seu estoque</p>
        </div>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }}><Plus size={20} className="mr-2" />Novo Produto</Button>
      </div>

      <div className="card">
        <Table columns={columns} data={products} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editing ? 'Editar Produto' : 'Novo Produto'}>
        <form onSubmit={handleSubmit}>
          <Input label="Nome do Produto" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <Input label="Descrição" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          <div className="grid grid-cols-3 gap-4">
            <Input label="Preço (R$)" type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
            <Input label="Estoque" type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} />
            <Input label="Estoque Mínimo" type="number" value={formData.min_stock} onChange={(e) => setFormData({ ...formData, min_stock: e.target.value })} />
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

