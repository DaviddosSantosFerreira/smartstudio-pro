import React, { useState, useEffect } from 'react';
import { DollarSign, Users, Calendar, TrendingUp, Package, AlertTriangle } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import RevenueChart from '../components/dashboard/RevenueChart';
import UpcomingAppointments from '../components/dashboard/UpcomingAppointments';
import TopServices from '../components/dashboard/TopServices';
import api from '../services/api';
import { formatCurrency } from '../utils/formatters';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    financial: { income: 0, expense: 0, balance: 0 },
    stats: { totalClients: 0, todayAppointments: 0 },
    upcomingAppointments: [],
    topServices: [],
    lowStockProducts: [],
    monthlyRevenue: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/overview');
      setDashboardData({
        financial: response.data.financial || { income: 0, expense: 0, balance: 0 },
        stats: response.data.stats || { totalClients: 0, todayAppointments: 0 },
        upcomingAppointments: response.data.upcomingAppointments || [],
        topServices: response.data.topServices || [],
        lowStockProducts: response.data.lowStockProducts || [],
        monthlyRevenue: response.data.monthlyRevenue || []
      });
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Visão geral do seu negócio</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Receita do Mês"
          value={formatCurrency(dashboardData.financial?.income || 0)}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Despesas do Mês"
          value={formatCurrency(dashboardData.financial?.expense || 0)}
          icon={TrendingUp}
          color="red"
        />
        <StatCard
          title="Saldo"
          value={formatCurrency(dashboardData.financial?.balance || 0)}
          icon={DollarSign}
          color="blue"
        />
        <StatCard
          title="Total de Clientes"
          value={dashboardData.stats?.totalClients || 0}
          icon={Users}
          color="purple"
        />
      </div>

      {/* Agendamentos de Hoje e Estoque Baixo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Hoje</h3>
            <span className="flex items-center space-x-2">
              <Calendar size={20} className="text-primary-600" />
              <span className="text-2xl font-bold text-primary-600">
                {dashboardData.stats?.todayAppointments || 0}
              </span>
              <span className="text-gray-600">agendamentos</span>
            </span>
          </div>
        </div>

        {dashboardData.lowStockProducts.length > 0 && (
          <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="text-yellow-600" size={24} />
              <h3 className="text-xl font-bold text-gray-900">Produtos com Estoque Baixo</h3>
            </div>
            <div className="space-y-2">
              {dashboardData.lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">{product.stock} un.</p>
                    <p className="text-xs text-gray-500">Mín: {product.min_stock}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Gráfico de Evolução */}
      <RevenueChart data={dashboardData.monthlyRevenue} />

      {/* Próximos Agendamentos e Serviços Mais Vendidos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingAppointments appointments={dashboardData.upcomingAppointments} />
        <TopServices services={dashboardData.topServices} />
      </div>
    </div>
  );
}

