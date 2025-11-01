// frontend/components/ui/Badge.tsx
'use client';
import clsx from 'clsx';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'error';
  className?: string;
}

const colors = {
  primary: 'bg-blue-600 text-white',
  success: 'bg-green-600 text-white',
  warning: 'bg-yellow-400 text-black',
  error: 'bg-red-600 text-white',
};

export default function Badge({ label, variant = 'primary', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'px-2 py-1 rounded-full text-sm font-semibold inline-block',
        colors[variant],
        className
      )}
    >
      {label}
    </span>
  );
}
