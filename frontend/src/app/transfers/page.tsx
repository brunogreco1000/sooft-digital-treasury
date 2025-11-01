'use client';
import { useState, useEffect } from 'react';
import api from '../../../services/axios';
import { useAuth } from '../../../context/AuthContext';
import Card from '../../../components/ui/Card';
import TransferForm from '../../../components/forms/TransferForm';
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
  type: 'ingreso' | 'egreso';
  status?: 'pendiente' | 'aprobado' | 'fallido';
  reference?: string;
  notes?: string;
}

export default function TransfersPage() {
  const { user, loading } = useAuth();

  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loadingTransfers, setLoadingTransfers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchTransfers = async () => {
    if (!user) return;
    setLoadingTransfers(true);
    try {
      const res = await api.get<Transfer[]>('/transfers', { withCredentials: true });
      setTransfers(res.data || []);
      setError(null);
    } catch (err: any) {
      setError('Ocurrió un error al cargar las transferencias.');
      setTransfers([]);
    } finally {
      setLoadingTransfers(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) return;
    fetchTransfers();
  }, [user, loading]);

  if (loading || !user) return <p className="text-center mt-10 text-gray-700">Cargando...</p>;

  // Convertimos Transfer[] a Movement[] sin cambiar date a Date
  const movements: Movement[] = transfers.map(t => ({
    _id: t._id,
    recipient: t.recipient,
    concept: t.concept,
    description: t.description,
    amount: t.amount,
    date: t.date, // <-- mantener como string
    type: t.type,
    status: t.status,
    reference: t.reference,
    notes: t.notes,
  }));

  return (
    <section className="max-w-6xl mx-auto mt-10 p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-2">Transferencias</h1>
      <p className="mb-4 text-gray-700">
        Aquí podrás crear nuevas transferencias y revisar tus transferencias recientes.
      </p>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6 hover:bg-blue-700"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Cerrar formulario' : 'Crear nueva transferencia'}
      </button>

      {showForm && (
        <TransferForm
          onSuccess={() => {
            fetchTransfers();
            setShowForm(false);
          }}
        />
      )}

      {error && <Alert message={error} type="error" onClose={() => setError(null)} />}

      <Card title="Tus transferencias">
        {loadingTransfers ? (
          <p className="text-gray-500">Cargando transferencias...</p>
        ) : transfers.length === 0 ? (
          <p className="text-gray-700">Aún no tienes transferencias registradas.</p>
        ) : (
          <MovementsTable movements={movements} />
        )}
      </Card>
    </section>
  );
}
