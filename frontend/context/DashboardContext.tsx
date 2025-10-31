// frontend/context/DashboardContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import api from '../services/axios';
import { useAuth } from './AuthContext';

interface Transfer {
  _id: string;
  concept: string;
  amount: number;
  date: string;
}

interface DashboardSummary {
  totalIngresos: number;
  totalEgresos: number;
  balance: number;
}

interface DashboardContextType {
  summary: DashboardSummary | null;
  movements: Transfer[];
  loading: boolean;
  error: string | null;
  fetchDashboard: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [movements, setMovements] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get('/dashboard/me', { withCredentials: true });
      setSummary(res.data.summary);
      setMovements(res.data.movements);
      setError(null);
    } catch (err: any) {
      console.error('Error al obtener dashboard:', err.response?.status);
      setError(err.response?.status === 403 ? 'No autorizado' : 'Error al cargar dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [user]);

  return (
    <DashboardContext.Provider value={{ summary, movements, loading, error, fetchDashboard }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard debe estar dentro de DashboardProvider');
  return context;
};
