'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import api from '../services/axios';

export type UserRole = 'Admin' | 'Tesorero' | 'Contabilidad';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  twoFAEnabled?: boolean; // indica si el usuario tiene 2FA activo
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { username: string; password: string; twoFACode?: string }) => Promise<void>;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  isAuthorized: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user info
  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Login con soporte opcional de 2FA
  const login = async (credentials: { username: string; password: string; twoFACode?: string }) => {
    try {
      const res = await api.post('/auth/login', credentials);
      setUser(res.data.user);

      // Si el backend indica que se requiere 2FA, manejar flujo separado
      if (res.data.require2FA) {
        throw new Error('2FA required'); // UI puede detectar y pedir código
      }

    } catch (error: any) {
      setUser(null);
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  // Login con Google OAuth
  const loginWithGoogle = () => {
    window.location.href = 'http://localhost:3001/auth/google?redirect=/auth/google/callback?redirect=/dashboard';
  };

  // Logout
  const logout = async () => {
    try {
      await api.post('/auth/logout', {});
      setUser(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  // Función para chequear permisos por rol
  const isAuthorized = (roles: UserRole[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, logout, fetchUser, isAuthorized }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para consumir AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
