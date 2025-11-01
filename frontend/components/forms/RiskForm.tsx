'use client';
import { useState } from 'react';
import InputField from '../ui/InputField';
import { Button } from '../ui/Button';
import axios from '../../services/axios';

interface RiskFormProps {
  onSuccess?: () => void;
}

export default function RiskForm({ onSuccess }: RiskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('medio');
  const [error, setError] = useState('');

  const titleValid = title.length >= 3;
  const descriptionValid = description.length >= 5;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!titleValid || !descriptionValid) {
      setError('Por favor completa todos los campos correctamente.');
      return;
    }

    try {
      await axios.post('/risks', { title, description, level }, { withCredentials: true });
      setTitle('');
      setDescription('');
      setLevel('medio');
      onSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al registrar el riesgo.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Registrar Riesgo</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <InputField
        label="Título"
        value={title}
        onChange={setTitle}
        valid={titleValid || title === ''}
        placeholder="Nombre del riesgo"
        id="risk-title"
      />

      <InputField
        label="Descripción"
        value={description}
        onChange={setDescription}
        valid={descriptionValid || description === ''}
        placeholder="Descripción del riesgo"
        id="risk-description"
      />

      <label className="block mt-2 mb-1 font-semibold">Nivel de Riesgo</label>
      <select
        value={level}
        onChange={(e) => setLevel(e.target.value)}
        className="p-2 rounded bg-gray-800 text-white border border-gray-700 w-full"
      >
        <option value="bajo">Bajo</option>
        <option value="medio">Medio</option>
        <option value="alto">Alto</option>
      </select>

      <Button type="submit" className="mt-4 w-full">Registrar Riesgo</Button>
    </form>
  );
}
