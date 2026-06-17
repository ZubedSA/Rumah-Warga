'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Download } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/authStore';

export default function CashbookTab() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const accessToken = useAuthStore(state => state.accessToken);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/finance/transactions', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      // Sort ascending to calculate running balance
      const sorted = (res as any as any[]).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      let runningBalance = 0;
      const withBalance = sorted.map(tx => {
        if (tx.type === 'INCOME') runningBalance += tx.amount;
        else runningBalance -= tx.amount;
        return { ...tx, runningBalance };
      });

      // Reverse to show latest first
      setTransactions(withBalance.reverse());
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) fetchTransactions();
  }, [accessToken]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_24px_rgb(0,0,0,0.03)] overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Buku Kas (Mutasi)</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Mutasi transaksi masuk dan keluar beserta saldo berjalan otomatis</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-slate-100 text-slate-600 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-200 transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Deskripsi</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Debit (Masuk)</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Kredit (Keluar)</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right bg-slate-100/50">Saldo Berjalan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm font-medium">
                  Belum ada mutasi transaksi
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">{formatDate(tx.date)}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-800">{tx.category}</p>
                    <p className="text-xs text-slate-500 truncate max-w-[200px]">{tx.description}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-emerald-600 text-right">
                    {tx.type === 'INCOME' ? formatCurrency(tx.amount) : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-rose-600 text-right">
                    {tx.type === 'EXPENSE' ? formatCurrency(tx.amount) : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-primary text-right bg-slate-50/50">
                    {formatCurrency(tx.runningBalance)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
