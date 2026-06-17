'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/authStore';
import { TransactionFormModal } from './TransactionFormModal';
import Swal from 'sweetalert2';

export default function IncomeTab() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const accessToken = useAuthStore(state => state.accessToken);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/finance/transactions?type=INCOME', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setTransactions(res as any);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) fetchTransactions();
  }, [accessToken]);

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Hapus Transaksi?',
      text: 'Data yang dihapus tidak dapat dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f43f5e',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        await apiClient.delete(`/finance/transactions/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        fetchTransactions();
        Swal.fire({ icon: 'success', title: 'Terhapus!', timer: 1500, showConfirmButton: false });
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Gagal menghapus', text: 'Terjadi kesalahan sistem' });
      }
    }
  };

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
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Kas Masuk</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Kelola seluruh pemasukan kas RT/RW</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Cari transaksi..." className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm font-bold w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <button 
            onClick={() => { setSelectedTx(null); setIsModalOpen(true); }}
            className="flex items-center justify-center gap-2 bg-gradient-violet text-white px-5 py-2.5 rounded-full text-sm font-bold hover:opacity-90 shadow-violet-soft transition-opacity w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" /> Tambah
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">No. Transaksi</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Keterangan</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Nominal</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-sm font-medium">
                  Belum ada transaksi kas masuk
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">{formatDate(tx.date)}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-500">{tx.transactionNumber || '-'}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600 max-w-[200px] truncate">{tx.description}</td>
                  <td className="px-6 py-4 text-sm font-black text-emerald-600 text-right">+{formatCurrency(tx.amount)}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => { setSelectedTx(tx); setIsModalOpen(true); }}
                        className="p-2 text-slate-400 hover:text-primary transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(tx.id)}
                        className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <TransactionFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type="INCOME"
        transaction={selectedTx}
        onSuccess={fetchTransactions}
      />
    </div>
  );
}
