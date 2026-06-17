import React from 'react';
import { FileText, ArrowRight, Bell, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export function CitizenDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Welcome Card */}
      <div className="bg-gradient-violet rounded-[2.5rem] p-6 sm:p-8 md:p-10 relative overflow-hidden shadow-violet-soft text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 bg-white/10 flex items-center justify-center">
                 <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium text-white/80">Portal Warga</p>
            </div>
            <div className="mt-6 mb-2">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">Selamat Datang!</h1>
              <p className="text-sm sm:text-base text-white/80 font-medium mt-3 max-w-lg">
                Pantau status pengajuan surat Anda dan ikuti perkembangan terbaru di lingkungan RT Anda.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 md:mt-10 bg-white rounded-3xl p-2 flex items-center justify-between relative z-20">
          <Link href="/dashboard/letters" className="flex-1 bg-slate-50 hover:bg-primary/5 transition-colors p-4 rounded-2xl flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-sm md:text-base group-hover:text-primary transition-colors">Surat Saya</h3>
                <p className="text-xs font-bold text-slate-400">Ajukan surat baru</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>

      <div className="pt-4">
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Pengumuman RT Terkini</h3>
          <Link href="#" className="text-sm font-bold text-primary">Lihat semua</Link>
        </div>
        <div className="bg-[#0B0A1A] rounded-[2rem] p-6 sm:p-8 relative overflow-hidden text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary opacity-30 blur-3xl rounded-full"></div>
          <div className="absolute top-4 right-8 w-12 h-12 bg-[#FFB800] rounded-full hidden sm:block"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-4 h-4 text-[#FFB800]" />
              <span className="text-xs font-bold text-[#FFB800] uppercase tracking-wider">Info Penting</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight mb-2">Kerja Bakti Minggu Ini</h2>
            <p className="text-sm font-medium text-white/70 max-w-sm">Dapatkan info selengkapnya untuk kegiatan pembersihan gorong-gorong dan lingkungan sekitar.</p>
          </div>
        </div>
      </div>
      
    </div>
  );
}
