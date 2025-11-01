// frontend/context/MovementsContext.tsx
'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/axios';
import { useAuth } from './AuthContext';

export interface Movement {
  _id: string;
  date: string;
  recipient: string;
  concept: string;
  description?: string;
  amount: number;
  type: 'ingreso' | 'egreso';
  status?: 'pendiente' | 'aprobado' | 'fallido';
  reference?: string;
  notes?: string;
}

interface MovementsContextType {
  movements: Movement[];
  loading: boolean;
  error: string | null;
  fetchMovements: () => Promise<void>;
  saldo: number;
}

const MovementsContext = createContext<MovementsContextType | undefined>(undefined);

export const MovementsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saldo, setSaldo] = useState(0);

  const fetchMovements = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get<Movement[]>('/transfers', { withCredentials: true });
      const data = res.data || [];
      setMovements(data);
      setSaldo(data.reduce((acc, t) => (t.type === 'ingreso' ? acc + t.amount : acc - t.amount), 0));
      setError(null);
    } catch (err: any) {
      setError('Error al cargar los movimientos.');
      setMovements([]);
      setSaldo(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, [user]);

  return (
    <MovementsContext.Provider value={{ movements, loading, error, fetchMovements, saldo }}>
      {children}
    </MovementsContext.Provider>
  );
};

export const useMovements = () => {
  const context = useContext(MovementsContext);
  if (!context) throw new Error('useMovements debe estar dentro de MovementsProvider');
  return context;
};
