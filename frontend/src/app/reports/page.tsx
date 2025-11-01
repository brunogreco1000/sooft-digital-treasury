'use client';
import { useState, useEffect } from 'react';
import api from '../../../services/axios';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface Movimiento {
  _id: string;
  date: string;
  recipient: string;
  concept: string;
  description?: string;
  amount: number;
  currency: string;
  type: 'ingreso' | 'egreso';
  status: 'pendiente' | 'aprobado' | 'fallido';
  reference?: string;
  notes?: string;
}

export default function ReportsPage() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMovimientos() {
      try {
        const res = await api.get<Movimiento[]>('/transfers', { withCredentials: true });
        setMovimientos(res.data || []);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los reportes. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    }
    fetchMovimientos();
  }, []);

  const formatCurrency = (amount: number, currency = 'ARS') =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency }).format(amount);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  // Saldo acumulado
  const movimientosConSaldo = movimientos.reduce<Movimiento[]>((acc, m, i) => {
    const prevSaldo = acc[i - 1]?.amount ?? 0;
    const saldo = m.type === 'ingreso' ? prevSaldo + m.amount : prevSaldo - m.amount;
    acc.push({ ...m, amount: saldo });
    return acc;
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Reporte de Movimientos Financieros', 14, 15);
    doc.setFontSize(12);
    doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 25);

    let y = 40;
    movimientos.forEach((item) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(
        `${formatDate(item.date)} | ${item.recipient} | ${item.concept} | ${item.description || '-'} | ${formatCurrency(item.amount, item.currency)} | ${item.type} | ${item.status}`,
        14,
        y
      );
      y += 8;
    });

    doc.save('reporte_movimientos.pdf');
  };

  const generateExcel = () => {
    const wsData = movimientos.map((item) => ({
      Fecha: formatDate(item.date),
      Destinatario: item.recipient,
      Concepto: item.concept,
      Descripción: item.description || '-',
      Monto: formatCurrency(item.amount, item.currency),
      Tipo: item.type,
      Estado: item.status,
      Referencia: item.reference || '-',
      Notas: item.notes || '-',
    }));
    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Movimientos');
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'reporte_movimientos.xlsx');
  };

  if (loading) return <p className="text-center mt-10 text-gray-700">Cargando reportes...</p>;
  if (error)
    return (
      <p className="text-center mt-10 text-red-500 bg-red-50 p-4 rounded-lg max-w-lg mx-auto">
        {error}
      </p>
    );

  return (
    <section className="max-w-6xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Reportes Financieros</h1>

      <Card title="Movimientos Financieros">
        {movimientos.length === 0 ? (
          <p className="text-gray-400 text-center">No hay movimientos registrados aún.</p>
        ) : (
          <>
            <p className="text-gray-400 mb-4">
              Descarga tus movimientos en PDF o Excel para análisis y respaldo contable.
            </p>

            <Table
              headers={[
                'Fecha y Hora',
                'Destinatario',
                'Concepto',
                'Descripción',
                'Monto',
                'Tipo',
                'Estado',
                'Referencia',
                'Notas',
              ]}
              data={movimientos}
              renderRow={(mov) => (
                <tr key={mov._id} className="hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-2">{formatDate(mov.date)}</td>
                  <td className="px-6 py-2">{mov.recipient}</td>
                  <td className="px-6 py-2">{mov.concept || 'Sin concepto'}</td>
                  <td className="px-6 py-2">{mov.description || '-'}</td>
                  <td className="px-6 py-2">{formatCurrency(mov.amount, mov.currency)}</td>
                  <td className="px-6 py-2">{mov.type}</td>
                  <td className="px-6 py-2">{mov.status}</td>
                  <td className="px-6 py-2">{mov.reference || '-'}</td>
                  <td className="px-6 py-2">{mov.notes || '-'}</td>
                </tr>
              )}
            />

            <div className="flex flex-wrap gap-4 mt-6 justify-center">
              <button
                onClick={generatePDF}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all shadow-md"
              >
                Generar PDF
              </button>
              <button
                onClick={generateExcel}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all shadow-md"
              >
                Generar Excel
              </button>
            </div>
          </>
        )}
      </Card>
    </section>
  );
}
