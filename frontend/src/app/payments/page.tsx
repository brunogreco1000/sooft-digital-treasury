'use client';
import { useEffect, useState, FormEvent } from 'react';
import axios from '../../../services/axios';

interface Payment {
  id: string;
  date: string;
  amount: number;
  recipient: string;
  status: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch de pagos existentes
  useEffect(() => {
    async function fetchPayments() {
      try {
        const res = await axios.get('/payments', { withCredentials: true });
        setPayments(res.data);
      } catch (err) {
        console.error('Error fetching payments', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, []);

  // Función para registrar un pago
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!recipient || !amount || !date) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('El monto debe ser un número positivo');
      return;
    }

    setSubmitting(true);

    try {
      const res = await axios.post(
        '/payments',
        { recipient, amount: Number(amount), date },
        { withCredentials: true }
      );
      setPayments(prev => [res.data, ...prev]); // Agrega el nuevo pago al inicio
      setRecipient('');
      setAmount('');
      setDate('');
    } catch (err: any) {
      console.error('Error creating payment', err);
      setError(err.response?.data?.message || 'Error al registrar el pago');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-6 text-white-900">Pagos</h1>

      {/* Formulario de registro */}
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Registrar nuevo pago</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Destinatario"
            value={recipient}
            onChange={e => setRecipient(e.target.value)}
            className="p-2 rounded bg-gray-800 text-white border border-gray-700"
          />
          <input
            type="number"
            placeholder="Monto"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="p-2 rounded bg-gray-800 text-white border border-gray-700"
          />
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="p-2 rounded bg-gray-800 text-white border border-gray-700"
          />
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 p-2 rounded hover:bg-blue-700 transition-colors mt-2"
          >
            {submitting ? 'Registrando...' : 'Registrar Pago'}
          </button>
        </form>
      </div>

      {/* Tabla de pagos existentes */}
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Últimos pagos</h2>

        {loading ? (
          <p>Cargando pagos...</p>
        ) : payments.length === 0 ? (
          <p>No hay pagos registrados aún.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-2">Fecha</th>
                <th className="p-2">Monto</th>
                <th className="p-2">Destinatario</th>
                <th className="p-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} className="border-b border-gray-800">
                  <td className="p-2">{new Date(p.date).toLocaleDateString()}</td>
                  <td className="p-2">${p.amount}</td>
                  <td className="p-2">{p.recipient}</td>
                  <td
                    className={`p-2 font-semibold ${
                      p.status === 'Pendiente'
                        ? 'text-yellow-400'
                        : p.status === 'Completado'
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {p.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
