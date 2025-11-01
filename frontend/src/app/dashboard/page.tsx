'use client';

import { useState, useEffect } from 'react';
import api from '../../../services/axios';
import { useDashboard } from '../../../context/DashboardContext';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';

export default function DashboardPage() {
  const { summary, movements, loading, error, fetchDashboard } = useDashboard();

  useEffect(() => {
    fetchDashboard();
  }, []);

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

          <Card title="Últimas Transferencias">
            {movements.length === 0 ? (
              <p className="text-gray-300">No tienes transferencias aún.</p>
            ) : (
              <Table
                headers={['Concepto', 'Monto', 'Fecha']}
                data={movements}
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

          <Card title="Alertas">
            <p className="text-gray-300">
              {movements.length === 0
                ? '¡Aún no hay alertas para mostrar!'
                : 'Aquí se mostrarán alertas importantes.'}
            </p>
          </Card>
        </>
      )}
    </section>
  );
}
