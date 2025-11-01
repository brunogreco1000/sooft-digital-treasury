// frontend/services/paymentsService.ts
import api from './axios';

export interface Payment {
  _id?: string;
  concept: string;
  description: string;
  amount: number;
  currency?: string;
  date?: string;
  status?: 'pendiente' | 'aprobado' | 'fallido';
  recipient?: string;
}

// Obtener todos los pagos
export const getPayments = async () => {
  const res = await api.get<Payment[]>('/payments', { withCredentials: true });
  return res.data;
};

// Obtener pago por ID
export const getPaymentById = async (id: string) => {
  const res = await api.get<Payment>(`/payments/${id}`, { withCredentials: true });
  return res.data;
};

// Crear pago
export const createPayment = async (payment: Payment) => {
  const res = await api.post<Payment>('/payments', payment, { withCredentials: true });
  return res.data;
};

// Actualizar estado del pago
export const updatePaymentStatus = async (id: string, status: Payment['status']) => {
  const res = await api.patch<Payment>(`/payments/${id}/status`, { status }, { withCredentials: true });
  return res.data;
};

// Eliminar pago
export const deletePayment = async (id: string) => {
  const res = await api.delete(`/payments/${id}`, { withCredentials: true });
  return res.data;
};
