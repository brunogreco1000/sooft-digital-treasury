// components/layout/Header.tsx
'use client';

import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-blue-700 text-white p-4 shadow flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Image
          src="/sooft.png" // ruta dentro de public
          alt="SOOFT Logo"
          width={40}
          height={40}
          className="rounded"
        />
        <h1 className="text-2xl font-bold">SOOFT Treasury</h1>
      </div>
      {user && <span className="text-white">Bienvenido, {user.username}!</span>}
    </header>
  );
}
