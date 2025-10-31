'use client';
import { useEffect } from 'react';
import { useAuth } from '../../../../../context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';

export default function GoogleCallbackPage() {
  const { fetchUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function handleCallback() {
      try {
        // Espera a que la cookie httpOnly esté disponible
        await fetchUser();

        // Redirige a la URL original si existe
        const redirect = searchParams.get('redirect') || '/';
        router.replace(redirect);
      } catch (err) {
        console.error('Google OAuth fetch failed', err);
        router.replace('/register'); // fallback
      }
    }
    handleCallback();
  }, [fetchUser, router, searchParams]);

  return (
    <p className="text-center mt-10 text-white">
      Autenticando con Google...
    </p>
  );
}
