'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import api from '../services/axios';
import { useAuth } from './AuthContext';

interface Transfer {
  _id: string;
  concept: string;
  amount: number;
  currency: string;
  date: string;
  status: 'pendiente' | 'aprobado' | 'fallido';
  type: 'ingreso' | 'egreso';
}

interface Alert {
  id: string;
  type: 'info' | 'warning' | 'critical';
  message: string;
}

interface ProxVencimiento {
  concepto: string;
  fecha: string;
  monto: number;
}

interface DashboardSummary {
  totalIngresos: number;
  totalEgresos: number;
  balance: number;
  saldoDisponible: number;
  proxVencimientos: ProxVencimiento[];
  alertas: Alert[];
}

interface DashboardContextType {
  summary: DashboardSummary | null;
  movements: Transfer[];
  chartsData: any; // datos para gráficos
  loading: boolean;
  error: string | null;
  fetchDashboard: () => Promise<void>;
  refreshMovements: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [movements, setMovements] = useState<Transfer[]>([]);
  const [chartsData, setChartsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get('/dashboard/me', { withCredentials: true });
      setSummary(res.data.summary);
      setMovements(res.data.movements);
      setChartsData(res.data.chartsData);
      setError(null);
    } catch (err: any) {
      console.error('Error al obtener dashboard:', err.response?.status);
      setError(err.response?.status === 403 ? 'No autorizado' : 'Error al cargar dashboard');
    } finally {
      setLoading(false);
    }
  };

  const refreshMovements = async () => {
    if (!user) return;
    try {
      const res = await api.get('/dashboard/movements', { withCredentials: true });
      setMovements(res.data.movements);
    } catch (err) {
      console.error('Error al refrescar movimientos', err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [user]);

  return (
    <DashboardContext.Provider
      value={{ summary, movements, chartsData, loading, error, fetchDashboard, refreshMovements }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error('useDashboard debe estar dentro de DashboardProvider');
  return context;
};
