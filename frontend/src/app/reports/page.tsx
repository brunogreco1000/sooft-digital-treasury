'use client';
import { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import api from '../../../services/axios';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';

interface Movimiento {
  fecha: string;
  concepto: string;
  monto: number;
  currency?: string;
}

export default function ReportsPage() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMovimientos() {
      try {
        const res = await api.get('/payments', { withCredentials: true });
        setMovimientos(res.data || []);
      } catch (err) {
        console.error('Error al obtener movimientos:', err);
        setError('No se pudieron cargar los reportes. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    }
    fetchMovimientos();
  }, []);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Reporte de Movimientos Financieros', 14, 15);
    doc.setFontSize(12);
    doc.text(`Generado: ${new Date().toLocaleDateString()}`, 14, 25);

    let y = 40;
    movimientos.forEach((item) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(
        `${new Date(item.fecha).toLocaleDateString()} | ${item.concepto} | ${formatCurrency(
          item.monto
        )}`,
        14,
        y
      );
      y += 8;
    });

    doc.save('reporte_movimientos.pdf');
  };

  const generateExcel = () => {
    const wsData = movimientos.map((item) => ({
      Fecha: new Date(item.fecha).toLocaleDateString(),
      Concepto: item.concepto,
      Monto: item.monto,
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
    <section className="max-w-5xl mx-auto mt-10 p-6">
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
              headers={['Fecha', 'Concepto', 'Monto']}
              data={movimientos}
              renderRow={(mov, idx) => (
                <tr key={idx} className="hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-2">{new Date(mov.fecha).toLocaleDateString()}</td>
                  <td className="px-6 py-2">{mov.concepto}</td>
                  <td className="px-6 py-2">{formatCurrency(mov.monto)}</td>
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
