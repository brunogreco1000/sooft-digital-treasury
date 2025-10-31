'use client';
import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  title?: string;
  subtitle?: string;
  className?: string;
  children: ReactNode;
}

export default function Card({ title, subtitle, className, children }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow',
        className
      )}
    >
      {title && <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h2>}
      {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{subtitle}</p>}
      <div>{children}</div>
    </div>
  );
}
