import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

export default function TopServices({ services }) {
  const servicesList = Array.isArray(services) ? services : [];
  
  return (
    <div className="card">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Serviços Mais Vendidos</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={servicesList}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip formatter={(value) => `${value} vendas`} />
          <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

