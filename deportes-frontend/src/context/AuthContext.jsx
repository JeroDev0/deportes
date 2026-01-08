import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContextInstance';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        setUser(parsedUserData);
        setIsAuthenticated(true);
      } catch (e) {
        // Si hay error al parsear, limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Función para determinar la ruta de perfil según el modelType
  const getProfileRoute = (userId) => {
    if (!user) return '/';
    
    switch (user.modelType) {
      case 'deportista':
        return `/profile/${userId || user.id}`;
      case 'scout':
        return `/scout-profile/${userId || user.id}`;
      case 'sponsor':
        return `/sponsor-profile/${userId || user.id}`;
      case 'club':
        return `/club-profile/${userId || user.id}`;
      default:
        return '/';
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated,
      loading,
      getProfileRoute 
    }}>
      {children}
    </AuthContext.Provider>
  );
}