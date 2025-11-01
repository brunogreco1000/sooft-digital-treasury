// frontend/components/ui/MovementsTable.tsx
'use client';
import { useState, useMemo } from 'react';
import clsx from 'clsx';
import { Button } from './Button';
import Badge from './Badge';
import * as XLSX from 'xlsx';

// Exportamos la interfaz para que pueda ser usada en otras páginas
export interface Movement {
  _id: string;
  recipient: string;
  concept: string;
  description?: string;
  amount: number;
  date: string;
  type: 'ingreso' | 'egreso';
  status?: 'pendiente' | 'aprobado' | 'fallido';
  reference?: string;
  notes?: string;
}

interface Props {
  movements: Movement[];
}

export default function MovementsTable({ movements }: Props) {
  const [filterType, setFilterType] = useState<'all' | 'ingreso' | 'egreso'>('all');
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filtered = useMemo(() => {
    return movements.filter(m => {
      if (filterType !== 'all' && m.type !== filterType) return false;
      if (search && !m.recipient.toLowerCase().includes(search.toLowerCase())) return false;
      if (startDate && new Date(m.date) < new Date(startDate)) return false;
      if (endDate && new Date(m.date) > new Date(endDate)) return false;
      return true;
    });
  }, [movements, filterType, search, startDate, endDate]);

  const totalIngresos = filtered.filter(m => m.type === 'ingreso').reduce((a, b) => a + b.amount, 0);
  const totalEgresos = filtered.filter(m => m.type === 'egreso').reduce((a, b) => a + b.amount, 0);
  const saldo = totalIngresos - totalEgresos;

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filtered.map(m => ({
        Fecha: new Date(m.date).toLocaleString(),
        Destinatario: m.recipient,
        Concepto: m.concept,
        Descripción: m.description || '-',
        Monto: m.amount,
        Tipo: m.type,
        Estado: m.status || '-',
        Referencia: m.reference || '-',
        Notas: m.notes || '-',
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Movimientos');
    XLSX.writeFile(wb, 'movimientos.xlsx');
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          placeholder="Buscar destinatario..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="p-2 border rounded"
        />
        <select className="p-2 border rounded" value={filterType} onChange={e => setFilterType(e.target.value as any)}>
          <option value="all">Todos</option>
          <option value="ingreso">Ingresos</option>
          <option value="egreso">Egresos</option>
        </select>
        <input type="date" className="p-2 border rounded" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <input type="date" className="p-2 border rounded" value={endDate} onChange={e => setEndDate(e.target.value)} />
        <Button onClick={exportExcel} className="ml-auto">Exportar Excel</Button>
      </div>

      {/* Totales */}
      <div className="flex gap-6">
        <span>Total Ingresos: ${totalIngresos.toLocaleString()}</span>
        <span>Total Egresos: ${totalEgresos.toLocaleString()}</span>
        <span>Saldo: ${saldo.toLocaleString()}</span>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-left">
          <thead className="bg-gray-50">
            <tr>
              {['Fecha', 'Destinatario', 'Concepto', 'Descripción', 'Monto', 'Tipo', 'Estado', 'Referencia', 'Notas'].map(h => (
                <th key={h} className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map(m => (
              <tr key={m._id} className={clsx(m.status === 'fallido' && 'bg-red-100')}>
                <td className="px-6 py-2">{new Date(m.date).toLocaleString()}</td>
                <td className="px-6 py-2">{m.recipient}</td>
                <td className="px-6 py-2">{m.concept}</td>
                <td className="px-6 py-2">{m.description || '-'}</td>
                <td className="px-6 py-2">${m.amount.toLocaleString()}</td>
                <td className="px-6 py-2">
                  <Badge label={m.type} variant={m.type === 'ingreso' ? 'success' : 'error'} />
                </td>
                <td className="px-6 py-2">{m.status || '-'}</td>
                <td className="px-6 py-2">{m.reference || '-'}</td>
                <td className="px-6 py-2">{m.notes || '-'}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-6 py-4 text-center text-gray-400">No hay movimientos que coincidan</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
