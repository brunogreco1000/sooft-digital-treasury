// frontend/context/PaymentsContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/axios';
import { useAuth } from './AuthContext';

interface Payment {
  _id: string;
  concept: string;
  description: string;
  amount: number;
  date: string;
}

interface PaymentsContextType {
  payments: Payment[];
  loading: boolean;
  error: string | null;
  fetchPayments: () => Promise<void>;
  addPayment: (payment: Omit<Payment, '_id'>) => Promise<void>;
}

const PaymentsContext = createContext<PaymentsContextType | undefined>(undefined);

export const PaymentsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get('/payments', { withCredentials: true });
      setPayments(res.data);
      setError(null);
    } catch (err: any) {
      console.error('Error al obtener pagos:', err.response?.status);
      setError(err.response?.status === 403 ? 'No autorizado' : 'Error al cargar pagos');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const addPayment = async (payment: Omit<Payment, '_id'>) => {
    if (!user) return;
    try {
      const res = await api.post('/payments', payment, { withCredentials: true });
      setPayments(prev => [res.data, ...prev]);
    } catch (err: any) {
      console.error('Error al agregar pago:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [user]);

  return (
    <PaymentsContext.Provider value={{ payments, loading, error, fetchPayments, addPayment }}>
      {children}
    </PaymentsContext.Provider>
  );
};

export const usePayments = () => {
  const context = useContext(PaymentsContext);
  if (!context) throw new Error('usePayments debe estar dentro de PaymentsProvider');
  return context;
};
