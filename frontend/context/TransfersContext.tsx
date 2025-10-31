// frontend/context/TransfersContext.tsx
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

interface TransfersContextType {
  transfers: Transfer[];
  loading: boolean;
  error: string | null;
  fetchTransfers: () => Promise<void>;
  addTransfer: (transfer: Omit<Transfer, '_id'>) => Promise<void>;
}

const TransfersContext = createContext<TransfersContextType | undefined>(undefined);

export const TransfersProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransfers = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get('/payments');
      setTransfers(res.data);
      setError(null);
    } catch (err: any) {
      console.error('Error al obtener transferencias:', err.response?.status);
      setError(err.response?.status === 403 ? 'No autorizado' : 'Error al cargar transferencias');
      setTransfers([]);
    } finally {
      setLoading(false);
    }
  };

  const addTransfer = async (transfer: Omit<Transfer, '_id'>) => {
    if (!user) return;
    try {
      const res = await api.post('/payments', transfer);
      setTransfers(prev => [res.data, ...prev]);
    } catch (err: any) {
      console.error('Error al agregar transferencia:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, [user]);

  return (
    <TransfersContext.Provider value={{ transfers, loading, error, fetchTransfers, addTransfer }}>
      {children}
    </TransfersContext.Provider>
  );
};

export const useTransfers = () => {
  const context = useContext(TransfersContext);
  if (!context) throw new Error('useTransfers debe estar dentro de TransfersProvider');
  return context;
};
