// frontend/context/PortfolioContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/axios';
import { useAuth } from './AuthContext';

export interface Investment {
  _id: string;
  name: string;
  type: 'Acción' | 'Bono' | 'Fondo' | 'Otro';
  amount: number;
  currency: string;
  date: string;
  riskLevel: 'Bajo' | 'Medio' | 'Alto';
}

interface PortfolioContextType {
  investments: Investment[];
  loading: boolean;
  error: string | null;
  fetchPortfolio: () => Promise<void>;
  addInvestment: (investment: Omit<Investment, '_id'>) => Promise<void>;
  removeInvestment: (id: string) => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get('/portfolio', { withCredentials: true });
      setInvestments(res.data);
      setError(null);
    } catch (err: any) {
      console.error('Error al obtener portafolio:', err);
      setError(err.response?.status === 403 ? 'No autorizado' : 'Error al cargar portafolio');
      setInvestments([]);
    } finally {
      setLoading(false);
    }
  };

  const addInvestment = async (investment: Omit<Investment, '_id'>) => {
    if (!user) return;
    try {
      const res = await api.post('/portfolio', investment, { withCredentials: true });
      setInvestments(prev => [res.data, ...prev]);
    } catch (err) {
      console.error('Error al agregar inversión:', err);
      throw err;
    }
  };

  const removeInvestment = async (id: string) => {
    try {
      await api.delete(`/portfolio/${id}`, { withCredentials: true });
      setInvestments(prev => prev.filter(inv => inv._id !== id));
    } catch (err) {
      console.error('Error al eliminar inversión:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [user]);

  return (
    <PortfolioContext.Provider value={{ investments, loading, error, fetchPortfolio, addInvestment, removeInvestment }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error('usePortfolio debe estar dentro de PortfolioProvider');
  return context;
};
