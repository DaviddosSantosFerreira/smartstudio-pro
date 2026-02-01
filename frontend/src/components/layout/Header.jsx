import React from 'react';
import { Menu, Bell, Settings as SettingsIcon, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header({ onMenuClick }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Pegar nome do usuário logado
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={24} className="text-gray-700" />
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            SmartStudio Pro
          </h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="p-2 hover:bg-gray-100 rounded-lg relative transition-colors">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button 
            onClick={() => navigate('/settings')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <SettingsIcon size={20} className="text-gray-600" />
          </button>
          <div className="relative">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-700 hover:text-pink-500 transition"
            >
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <User size={18} className="text-white" />
              </div>
              <span className="text-sm font-medium">{user.name || 'Admin'}</span>
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

