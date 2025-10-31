// components/layout/Navbar.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const links = user
    ? [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/transfers', label: 'Transferencias' },
        { href: '/payments', label: 'Pagos' },
        { href: '/reports', label: 'Reportes' },
        { href: '/profile', label: 'Perfil' },
      ]
    : [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' },
        { href: '/login', label: 'Login' },
        { href: '/register', label: 'Register' },
      ];

  return (
    <nav className="bg-blue-600 shadow p-2 flex justify-end items-center">
      <ul className="flex gap-4">
        {links.map((link) => (
          <li
            key={link.href}
            className={clsx(
              'px-3 py-1 rounded transition-colors',
              pathname === link.href
                ? 'bg-blue-800 text-white'
                : 'text-white hover:bg-blue-700'
            )}
          >
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}

        {user && (
          <li>
            <button
              onClick={logout}
              className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
