'use client';
import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faCircle } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../context/AuthContext';
import axios from '../../../services/axios';
import { useRouter, useSearchParams } from 'next/navigation';

export default function RegisterPage() {
  const { login, fetchUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const userRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    userRef.current?.focus();

    // 🔹 Detectar si viene de Google OAuth y actualizar contexto
    const googleSuccess = searchParams.get('google');
    if (googleSuccess) {
      fetchUser(); // Hace fetch a /auth/me y actualiza user
    }
  }, [searchParams]);

  // Validaciones
  const usernameValid = /^[A-Za-z0-9]{3,20}$/.test(username);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordValid = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
  const passwordsMatch = password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMsg('');

    if (!usernameValid || !emailValid || !passwordValid || !passwordsMatch) {
      setErrMsg('Por favor corrige los errores antes de enviar.');
      errRef.current?.focus();
      return;
    }

    try {
      await axios.post('/auth/register', { username, email, password }, { withCredentials: true });
      await login({ username, password }); // Actualiza user en contexto
      router.push('/dashboard');
    } catch (error: any) {
      setErrMsg(error.response?.data?.message || 'Error al registrarse.');
      errRef.current?.focus();
    }
  };

  // Registro con Google → apunta a callback de frontend
  const handleGoogleRegister = () => {
  const params = new URLSearchParams({ redirect: '/dashboard' });
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google?${params.toString()}`;
};


  return (
    <section className="flex justify-center mt-10">
      <div className="bg-gray-900 text-white border-2 border-gray-700 rounded-lg p-8 max-w-md w-full shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

        {errMsg && (
          <p ref={errRef} className="text-red-500 mb-4" aria-live="assertive">
            {errMsg}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block font-semibold mb-1">Username</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                id="username"
                ref={userRef}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                aria-invalid={!usernameValid ? true : undefined}
                aria-describedby="username-desc"
                className="border p-2 rounded w-full bg-gray-800 text-white placeholder-gray-400"
                placeholder="Ingrese username"
              />
              <FontAwesomeIcon
                icon={username ? (usernameValid ? faCheck : faTimes) : faCircle}
                className={usernameValid ? 'text-green-500' : username ? 'text-red-500' : 'text-gray-400'}
              />
            </div>
            <p id="username-desc" className="text-sm text-gray-400">3-20 caracteres, solo letras y números</p>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block font-semibold mb-1">Email</label>
            <div className="flex items-center gap-2">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!emailValid ? true : undefined}
                aria-describedby="email-desc"
                className="border p-2 rounded w-full bg-gray-800 text-white placeholder-gray-400"
                placeholder="Ingrese su email"
              />
              <FontAwesomeIcon
                icon={email ? (emailValid ? faCheck : faTimes) : faCircle}
                className={emailValid ? 'text-green-500' : email ? 'text-red-500' : 'text-gray-400'}
              />
            </div>
            <p id="email-desc" className="text-sm text-gray-400">Ej: correo@ejemplo.com</p>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block font-semibold mb-1">Password</label>
            <div className="flex items-center gap-2">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!passwordValid ? true : undefined}
                aria-describedby="password-desc"
                className="border p-2 rounded w-full bg-gray-800 text-white placeholder-gray-400"
                placeholder="Ingrese su contraseña"
              />
              <FontAwesomeIcon
                icon={password ? (passwordValid ? faCheck : faTimes) : faCircle}
                className={passwordValid ? 'text-green-500' : password ? 'text-red-500' : 'text-gray-400'}
              />
            </div>
            <p id="password-desc" className="text-sm text-gray-400">Mínimo 6 caracteres, al menos 1 letra y 1 número</p>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block font-semibold mb-1">Confirm Password</label>
            <div className="flex items-center gap-2">
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                aria-invalid={!passwordsMatch ? true : undefined}
                aria-describedby="confirm-desc"
                className="border p-2 rounded w-full bg-gray-800 text-white placeholder-gray-400"
                placeholder="Repita su contraseña"
              />
              <FontAwesomeIcon
                icon={confirmPassword ? (passwordsMatch ? faCheck : faTimes) : faCircle}
                className={passwordsMatch ? 'text-green-500' : confirmPassword ? 'text-red-500' : 'text-gray-400'}
              />
            </div>
            <p id="confirm-desc" className="text-sm text-gray-400">Debe coincidir con la contraseña</p>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors mt-4"
          >
            Register
          </button>

          {/* Botón Google */}
          <button
            type="button"
            onClick={handleGoogleRegister}
            className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-colors mt-2"
          >
            Registrarse con Google
          </button>
        </form>
      </div>
    </section>
  );
}
