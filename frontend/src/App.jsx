import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import Clients from './pages/Clients';
import Services from './pages/Services';
import Products from './pages/Products';
import Professionals from './pages/Professionals';
import Financial from './pages/Financial';
import Orientation from './pages/Orientation';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import StudioSettings from './pages/StudioSettings';
import PublicBooking from './pages/PublicBooking';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota Pública - Página de Agendamento */}
        <Route path="/booking/:slug" element={<PublicBooking />} />
        
        {/* Rotas Administrativas - Com Layout */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/services" element={<Services />} />
              <Route path="/products" element={<Products />} />
              <Route path="/professionals" element={<Professionals />} />
              <Route path="/financial" element={<Financial />} />
              <Route path="/orientation" element={<Orientation />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/studio-settings" element={<StudioSettings />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
