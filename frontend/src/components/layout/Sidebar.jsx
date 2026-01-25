import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Scissors, 
  Package, 
  UserCheck, 
  DollarSign, 
  Calculator, 
  FileText,
  Settings
} from 'lucide-react';

export default function Sidebar({ isOpen }) {
  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/appointments', icon: Calendar, label: 'Agenda' },
    { path: '/clients', icon: Users, label: 'Clientes' },
    { path: '/services', icon: Scissors, label: 'Serviços' },
    { path: '/products', icon: Package, label: 'Produtos' },
    { path: '/professionals', icon: UserCheck, label: 'Profissionais' },
    { path: '/financial', icon: DollarSign, label: 'Financeiro' },
    { path: '/orientation', icon: Calculator, label: 'Orientação Financeira' },
    { path: '/reports', icon: FileText, label: 'Relatórios' },
    { path: '/settings', icon: Settings, label: 'Configurações' }
  ];

  return (
    <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 ${isOpen ? 'w-64' : 'w-0'} overflow-hidden shadow-sm`}>
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 font-semibold shadow-sm'
                  : 'text-gray-700 hover:bg-gray-50'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

