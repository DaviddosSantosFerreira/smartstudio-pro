import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

export default function RevenueChart({ data }) {
  return (
    <div className="card">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Evolução Financeira</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" stroke="#6b7280" />
          <YAxis tickFormatter={(value) => formatCurrency(value)} stroke="#6b7280" />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="income" 
            stroke="#10b981" 
            name="Receitas" 
            strokeWidth={3}
            dot={{ fill: '#10b981', r: 5 }}
          />
          <Line 
            type="monotone" 
            dataKey="expense" 
            stroke="#ef4444" 
            name="Despesas" 
            strokeWidth={3}
            dot={{ fill: '#ef4444', r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

