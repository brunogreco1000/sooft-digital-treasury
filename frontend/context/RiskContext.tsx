// frontend/context/RiskContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/axios';
import { useAuth } from './AuthContext';

export interface RiskMetrics {
  marketRisk: number;
  creditRisk: number;
  liquidityRisk: number;
  operationalRisk: number;
  lastUpdated: string;
}

interface RiskContextType {
  risks: RiskMetrics | null;
  loading: boolean;
  error: string | null;
  fetchRisks: () => Promise<void>;
}

const RiskContext = createContext<RiskContextType | undefined>(undefined);

export const RiskProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [risks, setRisks] = useState<RiskMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRisks = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get('/risk', { withCredentials: true });
      setRisks(res.data);
      setError(null);
    } catch (err: any) {
      console.error('Error al obtener riesgos:', err);
      setError(err.response?.status === 403 ? 'No autorizado' : 'Error al cargar riesgos');
      setRisks(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRisks();
  }, [user]);

  return (
    <RiskContext.Provider value={{ risks, loading, error, fetchRisks }}>
      {children}
    </RiskContext.Provider>
  );
};

export const useRisk = () => {
  const context = useContext(RiskContext);
  if (!context) throw new Error('useRisk debe estar dentro de RiskProvider');
  return context;
};
