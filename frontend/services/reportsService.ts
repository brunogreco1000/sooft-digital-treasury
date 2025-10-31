// frontend/services/reportsService.ts
import api from './axios';

export const getPaymentsReport = async () => {
  const res = await api.get('/payments', { withCredentials: true });
  return res.data;
};

export const getTransfersReport = async () => {
  const res = await api.get('/transfers', { withCredentials: true });
  return res.data;
};
