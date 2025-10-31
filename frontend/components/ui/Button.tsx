// components/ui/Button.tsx
'use client';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export const Button = ({ className, variant = 'primary', ...props }: ButtonProps) => {
  const base = 'px-4 py-2 rounded text-white font-semibold transition-colors';
  const color = {
    primary: 'bg-blue-600 hover:bg-blue-700',
    secondary: 'bg-gray-600 hover:bg-gray-700',
    danger: 'bg-red-600 hover:bg-red-700',
  }[variant];

  return <button className={clsx(base, color, className)} {...props} />;
};
