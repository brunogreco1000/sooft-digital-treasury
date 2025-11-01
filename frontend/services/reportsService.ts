// frontend/services/reportsService.ts
import api from './axios';

export const getPaymentsReport = async () => {
  const res = await api.get('/reports/payments', { withCredentials: true });
  return res.data;
};

export const getTransfersReport = async () => {
  const res = await api.get('/reports/transfers', { withCredentials: true });
  return res.data;
};

export const getPortfolioReport = async () => {
  const res = await api.get('/reports/portfolio', { withCredentials: true });
  return res.data;
};

export const getRiskReport = async () => {
  const res = await api.get('/reports/risks', { withCredentials: true });
  return res.data;
};
