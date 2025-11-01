'use client';
import { useEffect } from 'react';
import { usePayments } from '../../../context/PaymentsContext';
import Table from '../../../components/ui/Table';
import Badge from '../../../components/ui/Badge';
import Card from '../../../components/ui/Card';
import PaymentForm from '../../../components/forms/PaymentForm';

export default function PaymentsPageContent() {
  const { payments, fetchPayments, loading } = usePayments();

  useEffect(() => {
    fetchPayments();
  }, []);

  const headers = ['Fecha', 'Monto', 'Destinatario', 'Estado'];

  return (
    <section className="max-w-4xl mx-auto mt-10 p-6 text-white flex flex-col gap-6">
      <h1 className="text-3xl font-bold mb-6">Pagos</h1>

      <Card title="Registrar nuevo pago">
        <PaymentForm onSuccess={fetchPayments} />
      </Card>

      <Card title="Últimos pagos">
        {loading ? (
          <p>Cargando pagos...</p>
        ) : (
          <Table
            headers={headers}
            data={payments}
            renderRow={(p) => (
              <tr key={p._id} className="border-b border-gray-800">
                <td className="p-2">{new Date(p.date).toLocaleDateString()}</td>
                <td className="p-2">
                  {p.currency} {p.amount}
                </td>
                <td className="p-2">{p.recipient}</td>
                <td className="p-2">
                  <Badge
                    label={p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                    variant={
                      p.status === 'pendiente'
                        ? 'warning'
                        : p.status === 'aprobado'
                        ? 'success'
                        : 'error'
                    }
                  />
                </td>
              </tr>
            )}
          />
        )}
      </Card>
    </section>
  );
}
