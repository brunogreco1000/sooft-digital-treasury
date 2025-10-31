// frontend/services/transfersService.ts
import api from './axios';

export interface TransferData {
  concept: string;
  description: string;
  amount: number;
}

export const getTransfers = async () => {
  const res = await api.get('/transfers', { withCredentials: true });
  return res.data;
};

export const createTransfer = async (data: TransferData) => {
  const res = await api.post('/transfers', data, { withCredentials: true });
  return res.data;
};

export const deleteTransfer = async (id: string) => {
  const res = await api.delete(`/transfers/${id}`, { withCredentials: true });
  return res.data;
};
