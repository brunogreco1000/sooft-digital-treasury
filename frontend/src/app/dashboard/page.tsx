'use client';

import { useEffect } from 'react';
import { useDashboard } from '../../../context/DashboardContext';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import Chart from '../../../components/ui/Chart';
import Alert from '../../../components/ui/Alert';

interface Movement {
  _id: string;
  concept: string;
  amount: number;
  date?: string;
  type?: 'ingreso' | 'egreso';
  status?: 'pendiente' | 'aprobado' | 'fallido';
}

export default function DashboardPage() {
  const { summary, movements, loading, error, fetchDashboard } = useDashboard();

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Filtrar solo movimientos con fechas válidas para el gráfico
  const validMovements = movements.filter(
    m => m.date && !isNaN(new Date(m.date).getTime())
  );

  const chartData = {
    labels: validMovements.map(m => new Date(m.date!).toLocaleDateString()),
    datasets: [
      {
        label: 'Ingresos',
        data: validMovements.map(m => (m.type === 'ingreso' ? m.amount : 0)),
        borderColor: 'rgb(34,197,94)',
        backgroundColor: 'rgba(34,197,94,0.3)',
        tension: 0.3,
      },
      {
        label: 'Egresos',
        data: validMovements.map(m => (m.type === 'egreso' ? m.amount : 0)),
        borderColor: 'rgb(239,68,68)',
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
        <p className="text-gray-300">¡Aún no hay movimientos para tu cuenta!</p>
      ) : (
        <>
          {/* Alerta de saldo negativo */}
          {summary.balance < 0 && (
            <Alert message="Saldo negativo, revise sus movimientos" type="warning" />
          )}

          {/* Tarjetas resumen */}
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

          {/* Tabla de movimientos */}
          <Card title="Movimientos">
            {movements.length === 0 ? (
              <p className="text-gray-300">No tienes transferencias aún.</p>
            ) : (
              <Table
                headers={['Concepto', 'Monto', 'Fecha', 'Tipo', 'Estado']}
                data={movements}
                renderRow={(m) => (
                  <tr
                    key={m._id}
                    className={
                      m.status === 'fallido'
                        ? 'bg-red-100 dark:bg-red-800'
                        : undefined
                    }
                  >
                    <td className="px-6 py-4">{m.concept}</td>
                    <td className="px-6 py-4">
                      {m.amount.toLocaleString('es-AR', { style: 'currency', currency: 'USD' })}
                    </td>
                    <td className="px-6 py-4">
                      {m.date && !isNaN(new Date(m.date).getTime())
                        ? new Date(m.date).toLocaleDateString()
                        : 'Fecha inválida'}
                    </td>
                    <td className="px-6 py-4">{m.type ?? 'N/A'}</td>
                    <td className="px-6 py-4">{m.status ?? 'N/A'}</td>
                  </tr>
                )}
              />
            )}
          </Card>

          {/* Gráfico de movimientos */}
          <Card title="Gráfico de Movimientos">
            {validMovements.length === 0 ? (
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
