import React, { useState, useEffect } from 'react';
import { FileText, Calendar } from 'lucide-react';
import api from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { formatCurrency } from '../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Reports() {
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [serviceReport, setServiceReport] = useState([]);
  const [professionalReport, setProfessionalReport] = useState([]);
  const [financialReport, setFinancialReport] = useState(null);

  useEffect(() => {
    loadReports();
  }, [startDate, endDate]);

  const loadReports = async () => {
    try {
      const [services, professionals, financial] = await Promise.all([
        api.get('/reports/services', { params: { startDate, endDate } }),
        api.get('/reports/professionals', { params: { startDate, endDate } }),
        api.get('/reports/financial', { params: { startDate, endDate } })
      ]);
      setServiceReport(services.data);
      setProfessionalReport(professionals.data);
      setFinancialReport(financial.data);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600 mt-1">Análise detalhada do seu negócio</p>
        </div>
        <div className="flex space-x-3">
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      </div>

      {financialReport && (
        <Card title="Resumo Financeiro">
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <p className="text-gray-600 text-sm">Total de Receitas</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(financialReport.summary.total_income)}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total de Despesas</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(financialReport.summary.total_expense)}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Saldo</p>
              <p className="text-2xl font-bold text-primary-600">{formatCurrency(financialReport.summary.balance)}</p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Relatório de Serviços">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={serviceReport}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="total_revenue" fill="#3b82f6" name="Receita Total" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Relatório de Profissionais">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={professionalReport}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="total_revenue" fill="#10b981" name="Receita Total" />
              <Bar dataKey="total_commission" fill="#f59e0b" name="Comissão" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

