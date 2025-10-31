'use client';
import { useState, useEffect } from 'react';
import api from '../../../services/axios';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import TransferForm from '../../../components/forms/TransferForm';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';

export default function TransfersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [transfers, setTransfers] = useState<any[]>([]);
  const [loadingTransfers, setLoadingTransfers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Redirigir si no hay usuario
  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  const fetchTransfers = async () => {
    if (!user) return;
    setLoadingTransfers(true);
    try {
      const res = await api.get('/transfers', { withCredentials: true });
      setTransfers(res.data);
      setError(null);
    } catch (err: any) {
      console.error('Error al obtener transferencias:', err.response?.status);
      if (err.response?.status === 403) {
        setError('No autorizado. Por favor inicia sesión nuevamente.');
      } else {
        setError('Ocurrió un error al cargar las transferencias.');
      }
      setTransfers([]);
    } finally {
      setLoadingTransfers(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, [user]);

  if (loading || !user) {
    return <p className="text-center mt-10 text-gray-700">Cargando...</p>;
  }

  return (
    <section className="max-w-6xl mx-auto mt-10 p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Transferencias</h1>
      <p className="mb-6 text-gray-700">
        Aquí podrás crear nuevas transferencias y revisar tus transferencias recientes.
      </p>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6 hover:bg-blue-700"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Cerrar formulario' : 'Crear nueva transferencia'}
      </button>

      {showForm && <TransferForm onSuccess={() => { setShowForm(false); fetchTransfers(); }} />}

      {loadingTransfers ? (
        <p className="text-gray-500">Cargando transferencias...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : transfers.length === 0 ? (
        <Card title="Tus transferencias">
          <p className="text-gray-700">¡Aún no tienes transferencias! Usa el botón de arriba para crear tu primera.</p>
        </Card>
      ) : (
        <Card title="Tus transferencias">
          <Table
            headers={['Concepto', 'Monto', 'Fecha']}
            data={transfers}
            renderRow={(t: any) => (
              <tr key={t._id}>
                <td className="px-6 py-4">{t.concept}</td>
                <td className="px-6 py-4">${t.amount}</td>
                <td className="px-6 py-4">{new Date(t.date).toLocaleDateString()}</td>
              </tr>
            )}
          />
        </Card>
      )}
    </section>
  );
}
