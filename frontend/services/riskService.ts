// frontend/services/riskService.ts
import api from './axios';

export interface RiskMetrics {
  marketRisk: number;
  creditRisk: number;
  liquidityRisk: number;
  operationalRisk: number;
  lastUpdated: string;
}

export const getRiskMetrics = async () => {
  const res = await api.get<RiskMetrics>('/risks', { withCredentials: true });
  return res.data;
};

export const updateRiskMetrics = async (metrics: Partial<RiskMetrics>) => {
  const res = await api.patch<RiskMetrics>('/risks', metrics, { withCredentials: true });
  return res.data;
};
