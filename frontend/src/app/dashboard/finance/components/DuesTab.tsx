'use client';

import React, { useState, useEffect } from 'react';
import { Search, CheckCircle, Clock } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/authStore';

export default function DuesTab() {
  const [families, setFamilies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const accessToken = useAuthStore(state => state.accessToken);

  const fetchDues = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/finance/dues', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setFamilies(res as any);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) fetchDues();
  }, [accessToken]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_24px_rgb(0,0,0,0.03)] overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Iuran Warga</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Pantau status pembayaran iuran per Kepala Keluarga</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Cari warga..." className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm font-bold w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <select className="bg-slate-50 border border-slate-200 rounded-full px-4 py-2.5 text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer w-full sm:w-auto">
            <option value="all">Semua Status</option>
            <option value="paid">Lunas</option>
            <option value="unpaid">Menunggak</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kepala Keluarga</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">No. Rumah / Alamat</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tagihan Bulan Ini</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status Pembayaran</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {families.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 text-sm font-medium">
                  Belum ada data warga/keluarga
                </td>
              </tr>
            ) : (
              families.map((family) => {
                const head = family.citizens?.[0];
                const currentDue = family.dues?.[0];
                const isPaid = currentDue?.isPaid;

                return (
                  <tr key={family.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-800">{head?.name || 'Tidak Diketahui'}</p>
                      <p className="text-xs text-slate-500">{head?.phone || '-'}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">{family.address}</td>
                    <td className="px-6 py-4 text-sm font-black text-slate-800">
                      {currentDue ? formatCurrency(currentDue.amount) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">
                          <CheckCircle className="w-3.5 h-3.5" /> Lunas
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600">
                          <Clock className="w-3.5 h-3.5" /> Belum Lunas
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {!isPaid && currentDue && (
                        <button className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-1.5 rounded-full text-xs font-bold transition-colors">
                          Tandai Lunas
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
