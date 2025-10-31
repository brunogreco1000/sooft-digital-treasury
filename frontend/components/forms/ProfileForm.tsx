'use client';
import { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from '../../services/axios';
import InputField from '../../components/ui/InputField';
import { Button } from '../../components/ui/Button';

export default function ProfileForm() {
  const { user, fetchUser } = useAuth();
  const userRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const usernameValid = /^[A-Za-z0-9]{3,20}$/.test(username);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = password === '' || /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
  const passwordsMatch = password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!usernameValid || !emailValid || !passwordValid || !passwordsMatch) {
      setError('Por favor corrige los campos.');
      return;
    }

    try {
      await axios.put(`/users/${user?.id}`, { username, email }, { withCredentials: true });
      if (password) {
        await axios.post(`/users/${user?.id}/password`, { password }, { withCredentials: true });
      }
      fetchUser(); // Actualiza contexto
      setSuccess('Perfil actualizado correctamente.');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar perfil.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 text-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Editar Perfil</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}

      <InputField label="Username" value={username} onChange={setUsername} valid={usernameValid || username === ''} id="username"/>
      <InputField label="Email" value={email} onChange={setEmail} valid={emailValid || email === ''} id="email"/>
      <InputField label="Nuevo Password" type="password" value={password} onChange={setPassword} valid={passwordValid || password === ''} id="password"/>
      <InputField label="Confirmar Password" type="password" value={confirmPassword} onChange={setConfirmPassword} valid={passwordsMatch || confirmPassword === ''} id="confirmPassword"/>

      <Button type="submit" className="mt-4 w-full">Guardar Cambios</Button>
    </form>
  );
}
