import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
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
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/booking/:slug" element={<PublicBooking />} />
        
        {/* Rotas protegidas */}
        <Route path="/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="clients" element={<Clients />} />
          <Route path="services" element={<Services />} />
          <Route path="products" element={<Products />} />
          <Route path="professionals" element={<Professionals />} />
          <Route path="financial" element={<Financial />} />
          <Route path="orientation" element={<Orientation />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="studio-settings" element={<StudioSettings />} />
        </Route>

        {/* Rota não encontrada */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
