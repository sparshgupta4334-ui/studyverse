'use client';
import { useEffect, useState } from 'react';
import { reportsApi } from '@/lib/api';
import { formatCurrency } from '@/lib/constants';
import { MonthlyBarChart, MonthlyLineChart } from '@/components/Charts';
import { Download, BarChart2, TrendingUp } from 'lucide-react';

interface MonthlyData { month: string; credit: number; debit: number; }

export default function ReportsPage() {
  const [monthly, setMonthly] = useState<MonthlyData[]>([]);
  const [summary, setSummary] = useState<{ total_receivable: number; total_payable: number; total_transactions: number; total_customers: number } | null>(null);
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      reportsApi.monthly(year),
      reportsApi.summary(from || undefined, to || undefined),
    ]).then(([mRes, sRes]) => {
      if (mRes.data.success) setMonthly(mRes.data.data ?? []);
      if (sRes.data.success && sRes.data.data) setSummary(sRes.data.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [year, from, to]);

  const handleExport = async (type: 'csv' | 'pdf') => {
    try {
      const res = type === 'csv'
        ? await reportsApi.exportCsv(from || undefined, to || undefined)
        : await reportsApi.exportPdf(from || undefined, to || undefined);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `report.${type}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch { alert('Export failed'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-500 text-sm mt-0.5">Analytics and insights for your business</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => handleExport('csv')} className="btn-outline text-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> CSV
          </button>
          <button onClick={() => handleExport('pdf')} className="btn-outline text-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Customers', value: summary.total_customers.toString(), color: 'text-blue-600' },
            { label: 'Total Transactions', value: summary.total_transactions.toString(), color: 'text-purple-600' },
            { label: 'Total Receivable', value: formatCurrency(summary.total_receivable), color: 'text-green-600' },
            { label: 'Total Payable', value: formatCurrency(summary.total_payable), color: 'text-red-600' },
          ].map((s) => (
            <div key={s.label} className="card text-center">
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-3 items-end mb-5">
          <div>
            <label className="label text-xs">From</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="input-field w-auto" />
          </div>
          <div>
            <label className="label text-xs">To</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="input-field w-auto" />
          </div>
          <div>
            <label className="label text-xs">Year</label>
            <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="input-field w-auto">
              {[2024, 2023, 2022].map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setChartType('bar')}
              className={`p-1.5 rounded ${chartType === 'bar' ? 'bg-white shadow text-primary' : 'text-gray-500'}`}
              title="Bar chart"
            >
              <BarChart2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`p-1.5 rounded ${chartType === 'line' ? 'bg-white shadow text-primary' : 'text-gray-500'}`}
              title="Line chart"
            >
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h2 className="font-semibold text-gray-900 mb-4">Monthly Overview — {year}</h2>
        {loading ? (
          <div className="h-[300px] bg-gray-50 rounded-lg animate-pulse" />
        ) : monthly.length ? (
          chartType === 'bar' ? <MonthlyBarChart data={monthly} /> : <MonthlyLineChart data={monthly} />
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">No data available</div>
        )}
      </div>
    </div>
  );
}
