'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import api from '../services/axios';

export interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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

  const login = async (credentials: { username: string; password: string }) => {
    try {
      const res = await api.post('/auth/login', credentials);
      setUser(res.data.user);
    } catch (error: any) {
      setUser(null);
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  const loginWithGoogle = () => {
    window.location.href = 'http://localhost:3001/auth/google?redirect=/auth/google/callback?redirect=/dashboard';
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout', {});
      setUser(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
