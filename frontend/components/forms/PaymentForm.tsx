// components/forms/PaymentForm.tsx
'use client';
import { useState } from 'react';
import InputField from '../ui/InputField';
import axios from '../../services/axios';
import { Button } from '../ui/Button';

interface PaymentFormProps {
  onSuccess?: () => void;
}

export default function PaymentForm({ onSuccess }: PaymentFormProps) {
  const [concept, setConcept] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const conceptValid = concept.length >= 3;
  const amountValid = !isNaN(Number(amount)) && Number(amount) > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!conceptValid || !amountValid) {
      setError('Por favor corrige los campos antes de enviar.');
      return;
    }

    try {
      await axios.post('/payments', { concept, amount: Number(amount) }, { withCredentials: true });
      setConcept('');
      setAmount('');
      onSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar el pago.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-xl font-bold mb-4">Registrar Pago</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <InputField
        label="Concepto"
        value={concept}
        onChange={setConcept}
        valid={conceptValid || concept === ''}
        placeholder="Descripción del pago"
        id="concept"
      />

      <InputField
        label="Monto"
        value={amount}
        onChange={setAmount}
        valid={amountValid || amount === ''}
        placeholder="0.00"
        type="number"
        id="amount"
      />

      <Button type="submit" className="mt-4 w-full">Registrar Pago</Button>
    </form>
  );
}
