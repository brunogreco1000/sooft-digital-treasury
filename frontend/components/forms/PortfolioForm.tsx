'use client';
import { useState } from 'react';
import InputField from '../ui/InputField';
import { Button } from '../ui/Button';
import axios from '../../services/axios';

interface PortfolioFormProps {
  onSuccess?: () => void;
}

export default function PortfolioForm({ onSuccess }: PortfolioFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const nameValid = name.length >= 3;
  const descriptionValid = description.length >= 5;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nameValid || !descriptionValid) {
      setError('Por favor completa todos los campos correctamente.');
      return;
    }

    try {
      await axios.post('/portfolios', { name, description }, { withCredentials: true });
      setName('');
      setDescription('');
      onSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear el portafolio.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Crear Portafolio</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <InputField
        label="Nombre"
        value={name}
        onChange={setName}
        valid={nameValid || name === ''}
        placeholder="Nombre del portafolio"
        id="portfolio-name"
      />

      <InputField
        label="Descripción"
        value={description}
        onChange={setDescription}
        valid={descriptionValid || description === ''}
        placeholder="Descripción del portafolio"
        id="portfolio-description"
      />

      <Button type="submit" className="mt-4 w-full">Crear Portafolio</Button>
    </form>
  );
}
