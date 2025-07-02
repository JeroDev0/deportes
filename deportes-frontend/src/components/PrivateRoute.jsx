import { useAuth } from '../context/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

function PrivateRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirige a login y guarda la ruta previa para volver después
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default PrivateRoute;