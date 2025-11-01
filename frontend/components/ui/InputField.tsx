'use client';
import { forwardRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faCircle } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

interface InputFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  valid?: boolean;
  errorMsg?: string;
  id: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, type = 'text', value, onChange, placeholder, valid, errorMsg, id }, ref) => (
    <div className="mb-4">
      <label htmlFor={id} className="block font-semibold mb-1">{label}</label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type={type}
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-invalid={valid === false}
          className={clsx(
            'border p-2 rounded w-full bg-gray-800 text-white placeholder-gray-400',
            valid === false && 'border-red-500'
          )}
        />
        <FontAwesomeIcon
          icon={value ? (valid ? faCheck : faTimes) : faCircle}
          className={valid ? 'text-green-500' : value ? 'text-red-500' : 'text-gray-400'}
        />
      </div>
      {errorMsg && <p className="text-sm text-red-500 mt-1">{errorMsg}</p>}
    </div>
  )
);

InputField.displayName = 'InputField';
export default InputField;
