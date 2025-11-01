'use client';

import { useState } from 'react';
import InputField from '../ui/InputField';
import { Button } from '../ui/Button';
import Alert from '../ui/Alert';
import api from '../../services/axios';

interface TransferFormProps {
  onSuccess?: () => void;
}

export default function TransferForm({ onSuccess }: TransferFormProps) {
  const [recipient, setRecipient] = useState('');
  const [concept, setConcept] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validaciones frontend
  const recipientValid = recipient.trim().length >= 3;
  const conceptValid = concept.trim().length > 0;
  const amountValid = !isNaN(Number(amount)) && Number(amount) > 0;
  const dateValid = date !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!recipientValid || !conceptValid || !amountValid || !dateValid) {
      setError('Por favor corrige los campos antes de enviar.');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post(
        '/transfers',
        {
          recipient: recipient.trim(),
          concept: concept.trim(),
          description: description.trim(),
          amount: Number(amount),
          type: 'egreso', // por defecto egreso
          date: new Date(date), // <-- convertir string a Date
        },
        { withCredentials: true } // ya lo tienes en api, pero no hace daño
      );

      // Limpiar campos
      setRecipient('');
      setConcept('');
      setDescription('');
      setAmount('');
      setDate('');
      setSuccess('Transferencia creada correctamente.');
      onSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear la transferencia.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-md w-full space-y-4"
    >
      <h2 className="text-xl font-bold mb-2">Nueva Transferencia</h2>

      {error && <Alert message={error} type="error" onClose={() => setError('')} />}
      {success && <Alert message={success} type="success" onClose={() => setSuccess('')} />}

      <InputField
        label="Destinatario"
        value={recipient}
        onChange={setRecipient}
        valid={recipientValid || recipient === ''}
        placeholder="Nombre del destinatario"
        id="recipient"
      />

      <InputField
        label="Concepto"
        value={concept}
        onChange={setConcept}
        valid={conceptValid || concept === ''}
        placeholder="Concepto de la transferencia"
        id="concept"
      />

      <InputField
        label="Descripción"
        value={description}
        onChange={setDescription}
        valid={true} // opcional
        placeholder="Descripción (opcional)"
        id="description"
      />

      <InputField
        label="Monto"
        value={amount}
        onChange={setAmount}
        valid={amountValid || amount === ''}
        placeholder="0.00"
        type="number"
        id="transfer-amount"
      />

      <InputField
        label="Fecha"
        value={date}
        onChange={setDate}
        valid={dateValid || date === ''}
        type="date"
        id="transfer-date"
      />

      <Button type="submit" className="mt-2 w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando...' : 'Enviar Transferencia'}
      </Button>
    </form>
  );
}
