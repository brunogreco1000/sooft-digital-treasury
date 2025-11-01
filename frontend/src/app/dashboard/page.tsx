'use client';

import { useEffect } from 'react';
import { useDashboard } from '../../../context/DashboardContext';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import Chart from '../../../components/ui/Chart';

interface Movement {
  _id: string;
  concept: string;
  amount: number;
  date: string;
  type?: 'ingreso' | 'egreso'; // puede venir undefined
}

export default function DashboardPage() {
  const { summary, movements, loading, error, fetchDashboard } = useDashboard();

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Datos para gráfico de movimientos
  const chartData = {
    labels: movements.map((m) => new Date(m.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Ingresos',
        data: movements.map((m) => (m.type === 'ingreso' ? m.amount : 0)),
        borderColor: 'rgb(34,197,94)', // verde
        backgroundColor: 'rgba(34,197,94,0.3)',
        tension: 0.3,
      },
      {
        label: 'Egresos',
        data: movements.map((m) => (m.type === 'egreso' ? m.amount : 0)),
        borderColor: 'rgb(239,68,68)', // rojo
        backgroundColor: 'rgba(239,68,68,0.3)',
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' as const },
      title: { display: true, text: 'Movimientos Financieros' },
    },
  };

  return (
    <section className="max-w-6xl mx-auto mt-10 p-6 space-y-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Bienvenido!</h1>

      {loading ? (
        <p className="text-gray-300">Cargando dashboard...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : !summary ? (
        <p className="text-gray-300">
          ¡Parece que eres nuevo aquí! Aún no hay transacciones ni alertas para tu cuenta.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card title="Saldo Actual" subtitle="Balance disponible">
              <p className="text-2xl font-bold">${summary.balance}</p>
            </Card>
            <Card title="Total Ingresos" subtitle="Sumatoria de ingresos">
              <p className="text-2xl font-bold text-green-400">${summary.totalIngresos}</p>
            </Card>
            <Card title="Total Egresos" subtitle="Sumatoria de egresos">
              <p className="text-2xl font-bold text-red-400">${summary.totalEgresos}</p>
            </Card>
          </div>

          <Card title="Movimientos">
            {movements.length === 0 ? (
              <p className="text-gray-300">No tienes transferencias aún.</p>
            ) : (
              <Table
                headers={['Concepto', 'Monto', 'Fecha', 'Tipo']}
                data={movements}
                renderRow={(t) => (
                  <tr key={t._id}>
                    <td className="px-6 py-4">{t.concept}</td>
                    <td className="px-6 py-4">${t.amount}</td>
                    <td className="px-6 py-4">{new Date(t.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{t.type}</td>
                  </tr>
                )}
              />
            )}
          </Card>

          <Card title="Gráfico de Movimientos">
            {movements.length === 0 ? (
              <p className="text-gray-300">No hay movimientos para graficar.</p>
            ) : (
              <Chart data={chartData} options={chartOptions} />
            )}
          </Card>
        </>
      )}
    </section>
  );
}
