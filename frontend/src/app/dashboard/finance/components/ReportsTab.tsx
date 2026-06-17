'use client';

import React from 'react';
import { Download, FileText, Printer } from 'lucide-react';

export default function ReportsTab() {
  const reports = [
    { title: 'Laporan Pemasukan Bulanan', desc: 'Detail seluruh pemasukan kas per bulan' },
    { title: 'Laporan Pengeluaran Bulanan', desc: 'Detail seluruh pengeluaran kas per bulan' },
    { title: 'Laporan Iuran Warga', desc: 'Rekap status pembayaran iuran warga per RT' },
    { title: 'Laporan Tunggakan', desc: 'Daftar warga yang menunggak iuran' },
    { title: 'Buku Kas Umum (Tahunan)', desc: 'Mutasi debit dan kredit dalam 1 tahun terakhir' },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_24px_rgb(0,0,0,0.03)] overflow-hidden">
      <div className="p-6 md:p-8 border-b border-slate-100">
        <h2 className="text-xl font-black text-slate-800 tracking-tight">Pusat Laporan</h2>
        <p className="text-sm font-medium text-slate-500 mt-1">Unduh atau cetak laporan keuangan untuk keperluan transparansi</p>
      </div>

      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, idx) => (
          <div key={idx} className="border border-slate-100 rounded-[2rem] p-6 hover:shadow-violet-soft hover:border-primary/20 transition-all duration-300 group cursor-pointer bg-slate-50/50 hover:bg-white">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-2">{report.title}</h3>
            <p className="text-sm font-medium text-slate-500 mb-6">{report.desc}</p>
            
            <div className="flex items-center gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-full text-xs font-bold hover:bg-slate-200 transition-colors">
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-full text-xs font-bold hover:bg-slate-200 transition-colors">
                <Download className="w-3.5 h-3.5" /> Excel
              </button>
              <button onClick={handlePrint} className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-full hover:bg-primary/90 transition-colors shadow-sm">
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
