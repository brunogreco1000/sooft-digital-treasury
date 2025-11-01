'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import RiskForm from '../../../components/forms/RiskForm';
import Alert from '../../../components/ui/Alert';

interface Risk {
  _id: string;
  category: string;
  riskLevel: 'Bajo' | 'Medio' | 'Alto';
  notes?: string;
  createdAt: string;
}

export default function RiskPage() {
  const { user, loading } = useAuth();
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loadingRisks, setLoadingRisks] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchRisks = async () => {
    if (!user) return;
    setLoadingRisks(true);
    try {
      const res = await fetch('/api/risk', { credentials: 'include' });
      if (!res.ok) throw new Error('Error al obtener riesgos');
      const data = await res.json();
      setRisks(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al cargar los riesgos.');
    } finally {
      setLoadingRisks(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) return;
    fetchRisks();
  }, [user, loading]);

  if (loading || !user) return <p className="text-center mt-10 text-gray-700">Cargando...</p>;

  return (
    <section className="max-w-6xl mx-auto mt-10 p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-2">Gestión de Riesgos</h1>
      <p className="mb-4 text-gray-700">Aquí podrás registrar y revisar tus riesgos financieros.</p>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6 hover:bg-blue-700"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Cerrar formulario' : 'Registrar nuevo riesgo'}
      </button>

      {showForm && <RiskForm onSuccess={fetchRisks} />}

      {error && <Alert message={error} type="error" onClose={() => setError(null)} />}

      <Card title="Tus riesgos">
        {loadingRisks ? (
          <p className="text-gray-500">Cargando riesgos...</p>
        ) : risks.length === 0 ? (
          <p className="text-gray-700">Aún no tienes riesgos registrados.</p>
        ) : (
          <Table
            headers={['Categoría', 'Nivel de Riesgo', 'Notas', 'Fecha']}
            data={risks}
            renderRow={(r) => (
              <tr key={r._id} className="hover:bg-gray-100">
                <td className="px-6 py-2">{r.category}</td>
                <td className="px-6 py-2">{r.riskLevel}</td>
                <td className="px-6 py-2">{r.notes || '-'}</td>
                <td className="px-6 py-2">
                  {new Date(r.createdAt).toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </td>
              </tr>
            )}
          />
        )}
      </Card>
    </section>
  );
}
