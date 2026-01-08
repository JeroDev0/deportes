import { useAuth } from '../context/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return <div>Cargando...</div>;
  }

  // Si no está autenticado, redirigir a login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ NUEVA LÓGICA: Solo proteger rutas de EDICIÓN
  const currentPath = location.pathname;
  
  // Si es un scout intentando EDITAR un perfil de deportista que no es suyo
  if (user.modelType === 'scout' && currentPath.includes('/profile/') && currentPath.includes('/edit')) {
    return <Navigate to={`/scout-profile/${user.id}`} replace />;
  }
  
  // Si es un deportista intentando EDITAR un perfil de scout que no es suyo
  if (user.modelType === 'deportista' && currentPath.includes('/scout-profile/') && currentPath.includes('/edit')) {
    return <Navigate to={`/profile/${user.id}`} replace />;
  }

  // ✅ Permitir VER cualquier perfil (sin /edit)
  return children;
}

export default PrivateRoute;