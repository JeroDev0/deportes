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

  /**
   * Retorna la ruta de perfil según el tipo de usuario
   * Sponsor = empresa
   */
  const getProfileRoute = (userId) => {
    if (!user) return '/';

    const id = userId || user.id;

    switch (user.modelType) {
      case 'deportista':
        return `/profile/${id}`;
      case 'scout':
        return `/scout-profile/${id}`;
      case 'sponsor':
        return `/sponsor-profile/${id}`;
      case 'club':
        return `/club-profile/${id}`;
      default:
        return '/';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        loading,
        getProfileRoute,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}