import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'; // ADICIONAR ESTA IMPORTAÇÃO
import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout() { // REMOVER children da prop
  console.log('🏠 Layout - Renderizando');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  console.log('🏠 Layout - Retornando JSX');
  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} />
        <main className={`flex-1 p-6 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'} mt-16`}>
          <div className="max-w-7xl mx-auto">
            <Outlet /> {/* TROCAR children POR <Outlet /> */}
          </div>
        </main>
      </div>
    </div>
  );
}