'use client';
import { useState } from 'react';

interface ReportFormProps {
  onGenerate: (startDate: string, endDate: string) => void;
}

export default function ReportForm({ onGenerate }: ReportFormProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return alert('Por favor selecciona ambas fechas.');
    onGenerate(startDate, endDate);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col gap-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">Generar Reporte</h2>

      <div className="flex flex-col">
        <label htmlFor="startDate" className="mb-1 font-semibold">
          Fecha Inicio
        </label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border rounded"
          required
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="endDate" className="mb-1 font-semibold">
          Fecha Fin
        </label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border rounded"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
      >
        Generar
      </button>
    </form>
  );
}
