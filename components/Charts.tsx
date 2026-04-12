'use client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { formatCurrency } from '@/lib/constants';

interface MonthlyData {
  month: string;
  credit: number;
  debit: number;
}

interface Props {
  data: MonthlyData[];
  type?: 'bar' | 'line';
}

const formatTick = (paise: number) => {
  const rupees = paise / 100;
  if (rupees >= 100000) return `₹${(rupees / 100000).toFixed(1)}L`;
  if (rupees >= 1000) return `₹${(rupees / 1000).toFixed(0)}K`;
  return `₹${rupees}`;
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number }[]; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-lg text-sm">
        <p className="font-semibold text-gray-800 mb-2">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.name === 'credit' ? '#16a34a' : '#dc2626' }}>
            {p.name === 'credit' ? 'Credit' : 'Debit'}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function MonthlyBarChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
        <YAxis tickFormatter={formatTick} tick={{ fontSize: 12, fill: '#6b7280' }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend formatter={(v) => (v === 'credit' ? 'Credit' : 'Debit')} />
        <Bar dataKey="credit" fill="#1E88E5" radius={[4, 4, 0, 0]} name="credit" />
        <Bar dataKey="debit" fill="#F57C00" radius={[4, 4, 0, 0]} name="debit" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MonthlyLineChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
        <YAxis tickFormatter={formatTick} tick={{ fontSize: 12, fill: '#6b7280' }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend formatter={(v) => (v === 'credit' ? 'Credit' : 'Debit')} />
        <Line type="monotone" dataKey="credit" stroke="#1E88E5" strokeWidth={2} dot={{ r: 4 }} name="credit" />
        <Line type="monotone" dataKey="debit" stroke="#F57C00" strokeWidth={2} dot={{ r: 4 }} name="debit" />
      </LineChart>
    </ResponsiveContainer>
  );
}
