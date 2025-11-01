'use client';
import { useState, useEffect, useMemo } from 'react';
import api from '../../../services/axios';
import { useAuth } from '../../../context/AuthContext';
import Card from '../../../components/ui/Card';
import Alert from '../../../components/ui/Alert';
import MovementsTable from '../../../components/ui/MovementsTable';
import { Movement } from '../../../context/MovementsContext';

interface Transfer {
  _id: string;
  recipient: string;
  concept: string;
  description?: string;
  amount: number;
  date: string;
  // type puede ser undefined en algunos registros antiguos
  type?: 'ingreso' | 'egreso';
  status?: 'pendiente' | 'aprobado' | 'fallido';
  reference?: string;
  notes?: string;
}

export default function CashFlowPage() {
  const { user, loading } = useAuth();

  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loadingTransfers, setLoadingTransfers] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransfers = async () => {
    if (!user) return;
    setLoadingTransfers(true);
    try {
      const res = await api.get<Transfer[]>('/transfers', { withCredentials: true });
      setTransfers(res.data || []);
      setError(null);
    } catch (err: any) {
      setError('Ocurrió un error al cargar el flujo de caja.');
      setTransfers([]);
    } finally {
      setLoadingTransfers(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) return;
    fetchTransfers();
  }, [user, loading]);

  if (loading || !user)
    return <p className="text-center mt-10 text-gray-700">Cargando...</p>;

  // Mapeamos Transfer a Movement
  const movements: Movement[] = useMemo(() => 
    transfers.map(t => ({
      _id: t._id,
      recipient: t.recipient || 'N/A',
      concept: t.concept,
      description: t.description,
      amount: t.amount,
      date: t.date,
      type: t.type || 'egreso', // valor por defecto
      status: t.status,
      reference: t.reference,
      notes: t.notes,
    }))
  , [transfers]);

  return (
    <section className="max-w-6xl mx-auto mt-10 p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-2">Flujo de Caja</h1>
      <p className="mb-4 text-gray-700">Aquí podrás ver ingresos, egresos y saldo disponible.</p>

      {error && <Alert message={error} type="error" onClose={() => setError(null)} />}

      <Card title={`Saldo disponible: $${movements.reduce((acc, m) => m.type === 'ingreso' ? acc + m.amount : acc - m.amount, 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}>
        {loadingTransfers ? (
          <p className="text-gray-500">Cargando movimientos...</p>
        ) : movements.length === 0 ? (
          <p className="text-gray-700">Aún no tienes movimientos registrados.</p>
        ) : (
          <MovementsTable movements={movements} />
        )}
      </Card>
    </section>
  );
}
