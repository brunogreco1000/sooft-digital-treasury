// frontend/services/transfersService.ts
import api from './axios';

export interface TransferData {
  concept: string;
  description: string;
  amount: number;
  currency?: string;
  recipient?: string;
  status?: 'pendiente' | 'aprobado' | 'fallido';
}

export const getTransfers = async () => {
  const res = await api.get<TransferData[]>('/transfers', { withCredentials: true });
  return res.data;
};

export const getTransferById = async (id: string) => {
  const res = await api.get<TransferData>(`/transfers/${id}`, { withCredentials: true });
  return res.data;
};

export const createTransfer = async (data: TransferData) => {
  const res = await api.post<TransferData>('/transfers', data, { withCredentials: true });
  return res.data;
};

export const updateTransferStatus = async (id: string, status: TransferData['status']) => {
  const res = await api.patch<TransferData>(`/transfers/${id}/status`, { status }, { withCredentials: true });
  return res.data;
};

export const deleteTransfer = async (id: string) => {
  const res = await api.delete(`/transfers/${id}`, { withCredentials: true });
  return res.data;
};
