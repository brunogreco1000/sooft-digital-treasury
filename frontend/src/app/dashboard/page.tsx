'use client';

import { useState, useEffect } from 'react';
import api from '../../../services/axios';
import { useAuth } from '../../../context/AuthContext';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';

interface Transfer {
  _id: string;
  concept: string;
  amount: number;
  date: string;
}

export default function DashboardPage() {
  const { user, loading: loadingUser } = useAuth();
  const [dashboardData, setDashboardData] = useState<{
    user: { id: string; username: string; email: string };
    movements: Transfer[];
    summary: { totalIngresos: number; totalEgresos: number; balance: number };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      setLoading(true);
      try {
        setError(null);
        const res = await api.get('/dashboard/me', { withCredentials: true });
        setDashboardData(res.data);
      } catch (err: any) {
        console.error('Error al obtener dashboard:', err.response?.status, err.response?.data);
        if (err.response?.status === 403) {
          setError('No autorizado. Por favor inicia sesión nuevamente.');
        } else {
          setError('Ocurrió un error al cargar el dashboard.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  if (loadingUser) return <p className="text-center mt-10 text-gray-700">Cargando usuario...</p>;
  if (!user) return <p className="text-center mt-10 text-gray-700">No hay usuario logueado.</p>;

  return (
    <section className="max-w-6xl mx-auto mt-10 p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Bienvenido, {user.username}!</h1>

      {loading ? (
        <p className="text-gray-500">Cargando dashboard...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : !dashboardData ? (
        <p className="text-gray-700">
          ¡Parece que eres nuevo aquí! Aún no hay transacciones ni alertas para tu cuenta.
        </p>
      ) : (
        <>
          {/* Resumen financiero */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card title="Saldo Actual" subtitle="Balance disponible">
              <p className="text-2xl font-bold">${dashboardData.summary.balance}</p>
            </Card>
            <Card title="Total Ingresos" subtitle="Sumatoria de ingresos">
              <p className="text-2xl font-bold text-green-500">${dashboardData.summary.totalIngresos}</p>
            </Card>
            <Card title="Total Egresos" subtitle="Sumatoria de egresos">
              <p className="text-2xl font-bold text-red-500">${dashboardData.summary.totalEgresos}</p>
            </Card>
          </div>

          {/* Últimas transferencias */}
          <Card title="Últimas Transferencias">
            {dashboardData.movements.length === 0 ? (
              <p className="text-gray-700">No tienes transferencias aún.</p>
            ) : (
              <Table
                headers={['Concepto', 'Monto', 'Fecha']}
                data={dashboardData.movements}
                renderRow={(t) => (
                  <tr key={t._id}>
                    <td className="px-6 py-4">{t.concept}</td>
                    <td className="px-6 py-4">${t.amount}</td>
                    <td className="px-6 py-4">{new Date(t.date).toLocaleDateString()}</td>
                  </tr>
                )}
              />
            )}
          </Card>

          {/* Alertas */}
          <Card title="Alertas">
            <p className="text-gray-700">
              {dashboardData.movements.length === 0
                ? '¡Aún no hay alertas para mostrar!'
                : 'Aquí se mostrarán alertas importantes.'}
            </p>
          </Card>
        </>
      )}
    </section>
  );
}
