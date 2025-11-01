// components/layout/Navbar.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import {
  Home,
  FileText,
  DollarSign,
  BarChart2,
  User,
  LogIn,
  UserPlus,
  LogOut,
  CreditCard,
  Shield,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const links = user
    ? [
        { href: '/dashboard', label: 'Dashboard', icon: <BarChart2 size={18} /> },
        { href: '/cash-flow', label: 'Flujo de Caja', icon: <DollarSign size={18} /> },
        { href: '/transfers', label: 'Transferencias', icon: <CreditCard size={18} /> },
        { href: '/payments', label: 'Pagos', icon: <DollarSign size={18} /> },
        { href: '/reports', label: 'Reportes', icon: <FileText size={18} /> },
        { href: '/risk', label: 'Riesgos', icon: <Shield size={18} /> },
        { href: '/profile', label: 'Perfil', icon: <User size={18} /> },
      ]
    : [
        { href: '/', label: 'Home', icon: <Home size={18} /> },
        { href: '/about', label: 'Acerca', icon: <FileText size={18} /> },
        { href: '/contact', label: 'Contacto', icon: <User size={18} /> },
        { href: '/login', label: 'Login', icon: <LogIn size={18} /> },
        { href: '/register', label: 'Registrarse', icon: <UserPlus size={18} /> },
      ];

  return (
    <nav className="bg-gray-900 shadow p-3 flex justify-end items-center">
      <ul className="flex gap-4 flex-wrap items-center">
        {links.map((link) => (
          <li
            key={link.href}
            className={clsx(
              'flex items-center gap-1 px-3 py-1 rounded transition-colors',
              pathname === link.href
                ? 'bg-gray-700 text-white'
                : 'text-gray-100 hover:bg-gray-800'
            )}
          >
            <Link href={link.href} className="flex items-center gap-1">
              {link.icon}
              <span>{link.label}</span>
            </Link>
          </li>
        ))}

        {user && (
          <li>
            <button
              onClick={logout}
              className="flex items-center gap-1 px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}
