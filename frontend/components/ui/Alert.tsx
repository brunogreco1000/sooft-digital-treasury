'use client';

interface AlertProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose?: () => void;
}

export default function Alert({ message, type = 'info', onClose }: AlertProps) {
  const bgColor =
    type === 'success'
      ? 'bg-green-100 text-green-800'
      : type === 'error'
      ? 'bg-red-100 text-red-800'
      : type === 'warning'
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-blue-100 text-blue-800'; // info por defecto

  return (
    <div className={`${bgColor} p-4 rounded-lg flex justify-between items-center shadow`}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} className="ml-4 font-bold hover:text-gray-600">
          ×
        </button>
      )}
    </div>
  );
}
