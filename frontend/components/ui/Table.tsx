// components/ui/Table.tsx
'use client';
import clsx from 'clsx';

interface TableProps<T> {
  headers: string[];
  data: T[];
  renderRow: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export default function Table<T>({ headers, data, renderRow, className }: TableProps<T>) {
  return (
    <div className={clsx('overflow-x-auto', className)}>
      <table className="min-w-full divide-y divide-gray-200 bg-white dark:bg-gray-800 rounded-lg shadow-sm text-gray-900 dark:text-gray-100">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.length > 0 ? (
            data.map((item, index) => renderRow(item, index))
          ) : (
            <tr>
              <td colSpan={headers.length} className="px-6 py-4 text-center text-gray-400 dark:text-gray-500">
                No hay datos disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
