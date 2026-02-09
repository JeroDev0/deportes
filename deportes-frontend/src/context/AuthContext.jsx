// src/context/AuthContext.jsx
import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContextInstance';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // ✅ AÑADIDO
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (storedToken && userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        setUser(parsedUserData);
        setToken(storedToken); // ✅ AÑADIDO
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
    setToken(token); // ✅ AÑADIDO
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null); // ✅ AÑADIDO
    setIsAuthenticated(false);
  };

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
      case 'admin':
        return `/admin-panel`;
      default:
        return '/';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token, // ✅ EXPUESTO AL CONTEXTO
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