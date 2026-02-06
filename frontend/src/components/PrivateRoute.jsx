import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  
  console.log('🔐 PrivateRoute - Token:', token ? 'EXISTE' : 'NÃO EXISTE');
  console.log('🔐 PrivateRoute - Renderizando children:', !!children);
  
  if (!token) {
    console.log('🔐 PrivateRoute - Redirecionando para /login');
    return <Navigate to="/login" replace />;
  }
  
  console.log('🔐 PrivateRoute - Permitindo acesso');
  return children;
}

export default PrivateRoute;