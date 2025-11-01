'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/axios';
import { useAuth } from './AuthContext';

interface Payment {
  _id: string;
  concept: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
  status: 'pendiente' | 'aprobado' | 'fallido';
  recipient?: string; // opcional, para compatibilidad con workflow
}

interface PaymentsContextType {
  payments: Payment[];
  loading: boolean;
  error: string | null;
  fetchPayments: () => Promise<void>;
  addPayment: (payment: Omit<Payment, '_id' | 'status'>) => Promise<void>;
  updatePaymentStatus: (id: string, status: Payment['status']) => Promise<void>;
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

  const addPayment = async (payment: Omit<Payment, '_id' | 'status'>) => {
    if (!user) return;
    try {
      const res = await api.post('/payments', payment, { withCredentials: true });
      setPayments(prev => [res.data, ...prev]);
    } catch (err: any) {
      console.error('Error al agregar pago:', err);
      throw err;
    }
  };

  const updatePaymentStatus = async (id: string, status: Payment['status']) => {
    try {
      const res = await api.patch(`/payments/${id}/status`, { status }, { withCredentials: true });
      setPayments(prev => prev.map(p => (p._id === id ? { ...p, status } : p)));
    } catch (err) {
      console.error('Error al actualizar estado del pago:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [user]);

  return (
    <PaymentsContext.Provider value={{ payments, loading, error, fetchPayments, addPayment, updatePaymentStatus }}>
      {children}
    </PaymentsContext.Provider>
  );
};

export const usePayments = () => {
  const context = useContext(PaymentsContext);
  if (!context) throw new Error('usePayments debe estar dentro de PaymentsProvider');
  return context;
};
