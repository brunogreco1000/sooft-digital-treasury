'use client';
import { useState, useEffect } from 'react';
import api from '../../../services/axios';
import { useAuth } from '../../../context/AuthContext';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import TransferForm from '../../../components/forms/TransferForm';
import Alert from '../../../components/ui/Alert';

interface Transfer {
  _id: string;
  recipient: string;
  concept: string;
  description?: string;
  amount: number;
  date: string;
  type?: 'ingreso' | 'egreso';
}

export default function CashFlowPage() {
  const { user, loading } = useAuth();

  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [saldo, setSaldo] = useState(0);
  const [loadingTransfers, setLoadingTransfers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchTransfers = async () => {
    if (!user) return;
    setLoadingTransfers(true);
    try {
      const res = await api.get<Transfer[]>('/transfers', { withCredentials: true });
      const data = res.data || [];
      setTransfers(data);
      setError(null);

      // Calcular saldo: ingresos suman, egresos restan
      const total = data.reduce((acc, t) => {
        if (t.type === 'ingreso') return acc + t.amount;
        return acc - t.amount; // egreso
      }, 0);
      setSaldo(total);
    } catch (err: any) {
      setError('Ocurrió un error al cargar el flujo de caja.');
      setTransfers([]);
      setSaldo(0);
    } finally {
      setLoadingTransfers(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) return;
    fetchTransfers();
  }, [user, loading]);

  if (loading || !user) return <p className="text-center mt-10 text-gray-700">Cargando...</p>;

  return (
    <section className="max-w-6xl mx-auto mt-10 p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-2">Flujo de Caja</h1>
      <p className="mb-4 text-gray-700">
        Aquí podrás ver ingresos, egresos y saldo disponible. También puedes crear nuevas transferencias.
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

      <Card title={`Saldo disponible: $${saldo.toFixed(2)}`}>
        {loadingTransfers ? (
          <p className="text-gray-500">Cargando movimientos...</p>
        ) : transfers.length === 0 ? (
          <p className="text-gray-700">Aún no tienes movimientos registrados.</p>
        ) : (
          <Table
            headers={['Fecha', 'Destinatario', 'Concepto', 'Descripción', 'Monto']}
            data={transfers}
            renderRow={(t) => (
              <tr key={t._id}>
                <td className="px-6 py-4">{new Date(t.date).toLocaleString()}</td>
                <td className="px-6 py-4">{t.recipient}</td>
                <td className="px-6 py-4">{t.concept}</td>
                <td className="px-6 py-4">{t.description || '-'}</td>
                <td className="px-6 py-4">${t.amount.toFixed(2)}</td>
              </tr>
            )}
          />
        )}
      </Card>
    </section>
  );
}