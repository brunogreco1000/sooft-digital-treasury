'use client';
import { useState, FormEvent } from 'react';
import { usePayments } from '../../context/PaymentsContext';
import { Button } from '../ui/Button';
import Alert from '../ui/Alert';

interface PaymentFormProps {
  onSuccess?: () => void;
}

export default function PaymentForm({ onSuccess }: PaymentFormProps) {
  const { addPayment } = usePayments();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [concept, setConcept] = useState('');
  const [description, setDescription] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!recipient || !amount || !date || !concept || !description) {
      setError('Todos los campos son obligatorios');
      return;
    }
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('El monto debe ser un número positivo');
      return;
    }

    setSubmitting(true);
    try {
      await addPayment({ recipient, amount: Number(amount), date, concept, description, currency });
      setRecipient('');
      setAmount('');
      setDate('');
      setConcept('');
      setDescription('');
      onSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar el pago');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      {error && <Alert message={error} type="error" onClose={() => setError('')} />}
      <input
        type="text"
        placeholder="Destinatario"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="p-2 rounded bg-gray-800 text-white border border-gray-700"
      />
      <input
        type="number"
        placeholder="Monto"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="p-2 rounded bg-gray-800 text-white border border-gray-700"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="p-2 rounded bg-gray-800 text-white border border-gray-700"
      />
      <input
        type="text"
        placeholder="Concepto"
        value={concept}
        onChange={(e) => setConcept(e.target.value)}
        className="p-2 rounded bg-gray-800 text-white border border-gray-700"
      />
      <input
        type="text"
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="p-2 rounded bg-gray-800 text-white border border-gray-700"
      />
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        className="p-2 rounded bg-gray-800 text-white border border-gray-700"
      >
        <option value="USD">USD</option>
        <option value="ARS">ARS</option>
        <option value="EUR">EUR</option>
      </select>
      <Button type="submit" disabled={submitting} className="mt-2 w-full">
        {submitting ? 'Registrando...' : 'Registrar Pago'}
      </Button>
    </form>
  );
}
