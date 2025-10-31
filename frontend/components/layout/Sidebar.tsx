'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

interface SidebarProps {
  open?: boolean; // para mobile toggle
}

export default function Sidebar({ open = true }: SidebarProps) {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/transfers', label: 'Transferencias' },
    { href: '/payments', label: 'Pagos' },
    { href: '/reports', label: 'Reportes' },
    { href: '/profile', label: 'Perfil' },
  ];

  return (
    <aside
      className={clsx(
        'bg-gray-800 text-white w-64 p-4 space-y-4',
        !open && 'hidden md:block'
      )}
    >
      <h2 className="text-xl font-bold mb-6">SOOFT Treasury</h2>
      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={clsx(
                'block px-3 py-2 rounded hover:bg-gray-700 transition-colors',
                pathname === link.href && 'bg-gray-700 font-semibold'
              )}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
