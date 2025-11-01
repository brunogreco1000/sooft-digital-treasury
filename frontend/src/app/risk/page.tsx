'use client';
import { useEffect } from 'react';
import { RiskProvider, useRisk } from '../../../context/RiskContext';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';

function RiskPageContent() {
  const { risks, fetchRisks, loading, error } = useRisk();

  useEffect(() => {
    fetchRisks();
  }, []);

  if (loading) return <p className="p-6 text-white">Cargando riesgos...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!risks) return <p className="p-6 text-white">No hay información de riesgos.</p>;

  const riskLevels = [
    { label: 'Riesgo de Mercado', value: risks.marketRisk },
    { label: 'Riesgo de Crédito', value: risks.creditRisk },
    { label: 'Riesgo de Liquidez', value: risks.liquidityRisk },
    { label: 'Riesgo Operacional', value: risks.operationalRisk },
  ];

  const getVariant = (value: number) =>
    value < 30 ? 'success' : value < 70 ? 'warning' : 'error';

  return (
    <section className="max-w-4xl mx-auto mt-10 p-6 flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-white mb-4">Riesgos</h1>
      <p className="text-gray-300">Última actualización: {new Date(risks.lastUpdated).toLocaleString()}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {riskLevels.map((risk) => (
          <Card key={risk.label} title={risk.label}>
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">{risk.value}%</span>
              <Badge label={risk.value < 30 ? 'Bajo' : risk.value < 70 ? 'Medio' : 'Alto'} variant={getVariant(risk.value)} />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default function RiskPage() {
  return (
    <RiskProvider>
      <RiskPageContent />
    </RiskProvider>
  );
}
