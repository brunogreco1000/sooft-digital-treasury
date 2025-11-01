// frontend/services/portfolioService.ts
import api from './axios';

export interface Investment {
  _id?: string;
  name: string;
  type: 'Acción' | 'Bono' | 'Fondo' | 'Otro';
  amount: number;
  currency: string;
  date?: string;
  riskLevel?: 'Bajo' | 'Medio' | 'Alto';
}

export const getPortfolio = async () => {
  const res = await api.get<Investment[]>('/portfolio', { withCredentials: true });
  return res.data;
};

export const getInvestmentById = async (id: string) => {
  const res = await api.get<Investment>(`/portfolio/${id}`, { withCredentials: true });
  return res.data;
};

export const addInvestment = async (investment: Omit<Investment, '_id'>) => {
  const res = await api.post<Investment>('/portfolio', investment, { withCredentials: true });
  return res.data;
};

export const removeInvestment = async (id: string) => {
  const res = await api.delete(`/portfolio/${id}`, { withCredentials: true });
  return res.data;
};

export const updateInvestment = async (id: string, data: Partial<Investment>) => {
  const res = await api.patch<Investment>(`/portfolio/${id}`, data, { withCredentials: true });
  return res.data;
};
