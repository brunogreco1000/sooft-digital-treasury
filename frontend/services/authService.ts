// frontend/services/authService.ts
import api from './axios';

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export const login = async (data: LoginData) => {
  const res = await api.post('/auth/login', data, { withCredentials: true });
  return res.data;
};

export const loginWithGoogle = () => {
  window.location.href = '/auth/google';
};

export const register = async (data: RegisterData) => {
  const res = await api.post('/auth/register', data, { withCredentials: true });
  return res.data;
};

export const logout = async () => {
  await api.post('/auth/logout', {}, { withCredentials: true });
};

export const getMe = async () => {
  const res = await api.get('/auth/me', { withCredentials: true });
  return res.data;
};
