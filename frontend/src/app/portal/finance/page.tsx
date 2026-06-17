'use client';

import React, { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, Clock, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/authStore';

export default function PortalFinancePage() {
  const [finances, setFinances] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loadingFinances, setLoadingFinances] = useState(true);
  const accessToken = useAuthStore(state => state.accessToken);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resTx, resSummary] = await Promise.all([
          apiClient.get('/finance/transactions', { headers: { Authorization: `Bearer ${accessToken}` } }),
          apiClient.get('/finance/summary', { headers: { Authorization: `Bearer ${accessToken}` } })
        ]);
        
        const sorted = (resTx as unknown as any[]).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setFinances(sorted);
        setSummary(resSummary);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingFinances(false);
      }
    };
    if (accessToken) fetchData();
  }, [accessToken]);

  const isLoading = loadingFinances;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex items-center gap-4 bg-white p-6 rounded-3xl shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-slate-100">
        <div className="w-12 h-12 rounded-[1.2rem] bg-accent flex items-center justify-center">
          <Wallet className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">Keuangan Lingkungan</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Transparansi dana RT/RW Anda.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-60 items-center justify-center bg-white rounded-3xl shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-slate-100">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-indigo-100 border-t-primary rounded-full animate-spin"></div>
            <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase animate-pulse">Memuat Keuangan...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Saldo Kas Utama */}
          <div className="bg-gradient-violet rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden shadow-violet-soft text-white">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 opacity-80">
                <Wallet className="w-4 h-4" />
                <h3 className="text-sm font-bold tracking-widest uppercase">Saldo Kas Lingkungan</h3>
              </div>
              <p className="text-4xl sm:text-5xl font-black tracking-tight mt-2">
                {formatCurrency(summary?.balance || 0)}
              </p>
            </div>
          </div>

          <h2 className="text-sm font-bold text-slate-800 tracking-widest uppercase mt-8 mb-4 px-2">Transaksi Terakhir</h2>
          <div className="space-y-4">
            {!finances || finances.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-slate-100 shadow-[0_4px_24px_rgb(0,0,0,0.03)]">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-sm font-bold text-slate-500">Belum ada transaksi tercatat</p>
              </div>
            ) : (
              finances.slice(0, 10).map((transaction: any) => (
                <div key={transaction.id} className="bg-white p-5 rounded-3xl shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-slate-100 flex items-center gap-4 hover:-translate-y-1 transition-transform">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    transaction.type === 'INCOME' ? 'bg-emerald-50' : 'bg-rose-50'
                  }`}>
                    {transaction.type === 'INCOME' ? (
                      <TrendingUp className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <TrendingDown className="w-6 h-6 text-rose-500" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-800 truncate">{transaction.description}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase px-2 py-0.5 bg-slate-100 rounded-md">
                        {transaction.category}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
                        <Clock className="w-3 h-3" />
                        {format(new Date(transaction.date), 'dd MMM yyyy', { locale: id })}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`text-sm font-black whitespace-nowrap ${
                    transaction.type === 'INCOME' ? 'text-emerald-500' : 'text-slate-800'
                  }`}>
                    {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
