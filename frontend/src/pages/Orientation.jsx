import React, { useState, useEffect } from 'react';
import { Calculator, Settings as SettingsIcon, PieChart as PieChartIcon } from 'lucide-react';
import { orientationService } from '../services/orientationService';
import { formatCurrency, formatPercent } from '../utils/formatters';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function Orientation() {
  const [settings, setSettings] = useState({ prolabore_percentage: 25, reinvestment_percentage: 15, reserve_percentage: 10, tax_percentage: 20 });
  const [monthlyRevenue, setMonthlyRevenue] = useState('');
  const [distribution, setDistribution] = useState(null);

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    const data = await orientationService.getSettings();
    setSettings(data);
  };

  const handleCalculate = async () => {
    const data = await orientationService.calculateDistribution(parseFloat(monthlyRevenue));
    setDistribution(data);
  };

  const handleSaveSettings = async () => {
    await orientationService.updateSettings(settings);
    alert('Configurações salvas!');
  };

  const chartData = distribution ? [
    { name: 'Pró-labore', value: distribution.prolabore, color: '#3b82f6' },
    { name: 'Reinvestimento', value: distribution.reinvestment, color: '#10b981' },
    { name: 'Reserva', value: distribution.reserve, color: '#f59e0b' },
    { name: 'Impostos', value: distribution.taxes, color: '#ef4444' },
    { name: 'Operacional', value: distribution.operational, color: '#8b5cf6' }
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orientação Financeira</h1>
        <p className="text-gray-600 mt-1">Planeje a distribuição do seu faturamento</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <Calculator className="text-primary-600" size={28} />
            <h2 className="text-2xl font-bold text-gray-900">Calculadora</h2>
          </div>
          <Input label="Faturamento Mensal (R$)" type="number" step="0.01" value={monthlyRevenue} onChange={(e) => setMonthlyRevenue(e.target.value)} placeholder="Ex: 50000.00" />
          <Button onClick={handleCalculate} className="w-full">Calcular Distribuição</Button>
          {distribution && (
            <div className="mt-6 space-y-4 border-t border-gray-200 pt-4">
              <div className="flex justify-between"><span className="text-gray-600">Pró-labore ({formatPercent(settings.prolabore_percentage)})</span><span className="text-xl font-bold text-primary-600">{formatCurrency(distribution.prolabore)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Reinvestimento ({formatPercent(settings.reinvestment_percentage)})</span><span className="text-xl font-bold text-green-600">{formatCurrency(distribution.reinvestment)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Reserva ({formatPercent(settings.reserve_percentage)})</span><span className="text-xl font-bold text-yellow-600">{formatCurrency(distribution.reserve)}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Impostos ({formatPercent(settings.tax_percentage)})</span><span className="text-xl font-bold text-red-600">{formatCurrency(distribution.taxes)}</span></div>
              <div className="flex justify-between pt-2 border-t border-gray-200"><span className="text-gray-600">Operacional</span><span className="text-xl font-bold text-purple-600">{formatCurrency(distribution.operational)}</span></div>
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <PieChartIcon className="text-primary-600" size={28} />
            <h2 className="text-2xl font-bold text-gray-900">Visualização</h2>
          </div>
          {distribution ? (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie data={chartData} cx="50%" cy="50%" labelLine={false} label={(entry) => entry.name} outerRadius={100} fill="#8884d8" dataKey="value">
                  {chartData.map((entry, i) => <Cell key={`cell-${i}`} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center"><Calculator size={48} className="mx-auto mb-4 opacity-50" /><p>Insira o faturamento e clique em calcular</p></div>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <SettingsIcon className="text-primary-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-900">Configurações de Percentuais</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Input label="Pró-labore (%)" type="number" step="0.1" value={settings.prolabore_percentage} onChange={(e) => setSettings({ ...settings, prolabore_percentage: parseFloat(e.target.value) })} />
          <Input label="Reinvestimento (%)" type="number" step="0.1" value={settings.reinvestment_percentage} onChange={(e) => setSettings({ ...settings, reinvestment_percentage: parseFloat(e.target.value) })} />
          <Input label="Reserva (%)" type="number" step="0.1" value={settings.reserve_percentage} onChange={(e) => setSettings({ ...settings, reserve_percentage: parseFloat(e.target.value) })} />
          <Input label="Impostos (%)" type="number" step="0.1" value={settings.tax_percentage} onChange={(e) => setSettings({ ...settings, tax_percentage: parseFloat(e.target.value) })} />
        </div>
        <div className="mt-6"><Button onClick={handleSaveSettings}>Salvar Configurações</Button></div>
      </div>
    </div>
  );
}

