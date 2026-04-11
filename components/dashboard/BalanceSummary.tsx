'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface BalanceSummaryProps {
  totalReceivable: number;
  totalPayable: number;
}

export function BalanceSummary({ totalReceivable, totalPayable }: BalanceSummaryProps) {
  const netBalance = totalReceivable - totalPayable;

  return (
    <div className="rounded-xl bg-white border border-gray-200 shadow-sm p-5">
      <h3 className="font-semibold text-gray-800 mb-4">Balance Summary</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg"><TrendingUp size={18} className="text-green-700" /></div>
            <div>
              <p className="text-xs text-green-600 font-medium">Total Receivable</p>
              <p className="text-base font-bold text-green-800">{formatCurrency(totalReceivable)}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg"><TrendingDown size={18} className="text-red-700" /></div>
            <div>
              <p className="text-xs text-red-600 font-medium">Total Payable</p>
              <p className="text-base font-bold text-red-800">{formatCurrency(totalPayable)}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
          <p className="text-sm text-gray-600 font-medium">Net Balance</p>
          <p className={`text-lg font-bold ${netBalance >= 0 ? 'text-green-700' : 'text-red-600'}`}>
            {formatCurrency(Math.abs(netBalance))}
            <span className="text-xs font-normal ml-1">{netBalance >= 0 ? '(to receive)' : '(to pay)'}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
