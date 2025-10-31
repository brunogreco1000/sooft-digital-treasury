'use client';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';


export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();

  const userRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    userRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setErrMsg('Por favor complete todos los campos.');
      errRef.current?.focus();
      return;
    }

    try {
      await login({ username, password });
      setErrMsg('');
      router.push('/dashboard');
    } catch (error: any) {
      setErrMsg(error.message || 'Usuario o contraseña incorrectos.');
      errRef.current?.focus();
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle(); // Asumimos que devuelve el JWT y maneja redirección
      setErrMsg('');
    } catch (error: any) {
      setErrMsg(error.message || 'Error al iniciar sesión con Google.');
      errRef.current?.focus();
    }
  };

  return (
    <section className="flex justify-center mt-10">
      <div className="bg-gray-900 text-white border-2 border-gray-700 rounded-lg p-8 max-w-md w-full shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        {errMsg && (
          <p ref={errRef} className="text-red-500 mb-4" aria-live="assertive">
            {errMsg}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="username" className="block font-semibold mb-1">Username / Email</label>
            <input
              type="text"
              id="username"
              ref={userRef}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingrese username o email"
              className="border p-2 rounded w-full bg-gray-800 text-white placeholder-gray-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-semibold mb-1">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              className="border p-2 rounded w-full bg-gray-800 text-white placeholder-gray-400"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors mt-4"
          >
            Login
          </button>

          {/* Login con Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-colors mt-2"
          >
            Login con Google
          </button>

          {/* Olvidaste tu contraseña */}
          <div className="mt-2 text-sm text-gray-400 text-center">
            <a href="/forgot-password" className="underline hover:text-white">¿Olvidaste tu contraseña?</a>
          </div>
        </form>
      </div>
    </section>
  );
}
