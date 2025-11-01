'use client';
import { useState } from 'react';
import Alert from '../ui/Alert';

interface RiskFormProps {
  onSuccess: () => void;
}

export default function RiskForm({ onSuccess }: RiskFormProps) {
  const [category, setCategory] = useState('');
  const [riskLevel, setRiskLevel] = useState<'Bajo' | 'Medio' | 'Alto'>('Bajo');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ category, riskLevel, notes }),
      });
      if (!res.ok) throw new Error('Error al crear riesgo');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded shadow-md flex flex-col gap-4 max-w-md mx-auto">
      {error && <Alert message={error} type="error" onClose={() => setError(null)} />}
      <div>
        <label className="font-semibold mb-1 block">Categoría</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
      </div>
      <div>
        <label className="font-semibold mb-1 block">Nivel de Riesgo</label>
        <select
          value={riskLevel}
          onChange={(e) => setRiskLevel(e.target.value as 'Bajo' | 'Medio' | 'Alto')}
          className="border p-2 rounded w-full"
        >
          <option value="Bajo">Bajo</option>
          <option value="Medio">Medio</option>
          <option value="Alto">Alto</option>
        </select>
      </div>
      <div>
        <label className="font-semibold mb-1 block">Notas</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Guardar Riesgo
      </button>
    </form>
  );
}
