// frontend/components/ui/Chart.tsx
'use client';
import { ReactNode } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ChartProps {
  data: any;
  options?: any;
  className?: string;
}

export default function Chart({ data, options, className }: ChartProps) {
  return (
    <div className={className}>
      <Line data={data} options={options} />
    </div>
  );
}
