import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('deeptrace_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('deeptrace_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const profile = await authApi.getMe();
          setUser(profile);
          localStorage.setItem('deeptrace_user', JSON.stringify(profile));
        } catch (e) {
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();

    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login({ email, password });
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('deeptrace_token', res.token);
    localStorage.setItem('deeptrace_user', JSON.stringify(res.user));
    return res;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('deeptrace_token');
    localStorage.removeItem('deeptrace_user');
  };

  const isAdmin = user?.role === 'ADMIN';
  const isManager = user?.role === 'MANAGER';
  const isUser = user?.role === 'USER';
  const canManageUsers = isAdmin;
  const canManageCampaigns = isAdmin || isManager;
  const canViewAuditLogs = isAdmin || isManager;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAdmin,
        isManager,
        isUser,
        canManageUsers,
        canManageCampaigns,
        canViewAuditLogs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
