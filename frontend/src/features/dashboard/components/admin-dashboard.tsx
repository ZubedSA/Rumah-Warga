import React from 'react';
import { useGetDashboardStats } from '@/features/dashboard/api/use-dashboard';
import { Users, UserPlus, FileText, CheckCircle, Activity, ArrowUpRight, ArrowDownRight, MoreHorizontal, Bell } from 'lucide-react';
import Link from 'next/link';

export function AdminDashboard() {
  const { data: stats, isLoading } = useGetDashboardStats();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-100 border-t-primary rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-slate-400 tracking-widest uppercase animate-pulse">Loading Platform</p>
        </div>
      </div>
    );
  }

  const secondaryCards = [
    {
      title: 'Keluarga',
      value: stats?.totalFamilies || 0,
      icon: UserPlus,
      color: 'text-primary',
      bg: 'bg-accent',
      href: '/dashboard/citizens'
    },
    {
      title: 'Menunggu',
      value: stats?.pendingLetters || 0,
      icon: FileText,
      color: 'text-rose-500',
      bg: 'bg-rose-50',
      href: '/dashboard/letters'
    },
    {
      title: 'Selesai',
      value: stats?.completedLetters || 0,
      icon: CheckCircle,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
      href: '/dashboard/letters'
    },
    {
      title: 'Lainnya',
      value: 'More',
      icon: MoreHorizontal,
      color: 'text-primary',
      bg: 'bg-accent',
      href: '/dashboard/finance'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Primary Statistic Card */}
      <div className="bg-gradient-violet rounded-[2.5rem] p-6 sm:p-8 md:p-10 relative overflow-hidden shadow-violet-soft text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=BapakBudi&backgroundColor=6366f1`} alt="Avatar" className="w-full h-full object-cover bg-white" />
              </div>
              <p className="text-sm font-medium text-white/80">Overview Penduduk</p>
            </div>
            <div className="mt-6 mb-2">
              <p className="text-sm text-white/70 font-medium mb-1">Total Warga Terdaftar</p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight">{stats?.totalCitizens || 0}</h1>
            </div>
          </div>
          
          <div className="mt-6 md:mt-0 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 cursor-pointer hover:bg-white/20 transition-colors">
            <Bell className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Secondary Cards (Moved outside the purple card for better mobile layout) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 sm:mt-0">
        {secondaryCards.map((card, idx) => (
          <Link href={card.href} key={idx} className="bg-white rounded-[2rem] p-4 sm:p-6 shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col items-center justify-center cursor-pointer hover-lift group">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-[1.2rem] ${card.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
              <card.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${card.color}`} />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 mb-1">{card.title}</span>
            <span className="text-lg sm:text-xl font-black text-slate-800">{card.value}</span>
          </Link>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
        <div className="glassmorphism-card rounded-[2rem] p-6 md:p-8 lg:col-span-2 relative overflow-hidden group">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Aktivitas Surat</h3>
            <select className="bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold rounded-full px-4 py-2 outline-none cursor-pointer hover:bg-slate-100 transition-colors">
              <option>Bulan Ini</option>
              <option>Minggu Ini</option>
            </select>
          </div>
          
          <div className="h-[200px] sm:h-[250px] w-full flex items-end gap-2 sm:gap-3 px-1 sm:px-2">
            {[40, 70, 45, 90, 65, 85, 120, 50, 80, 60].map((height, i) => (
              <div key={i} className="flex-1 flex gap-0.5 sm:gap-1 items-end h-full">
                <div className="w-1/2 bg-slate-200 rounded-t-full relative group-hover:bg-slate-300 transition-colors" style={{ height: `${height * 0.6}px` }}></div>
                <div className="w-1/2 bg-primary rounded-t-full relative shadow-sm" style={{ height: `${height}px` }}></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6 text-xs font-bold text-slate-400">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>Mei</span>
            <span>Jun</span>
            <span>Jul</span>
          </div>
          
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-300"></div>
              <span className="text-xs font-bold text-slate-500">Ditolak</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span className="text-xs font-bold text-slate-500">Disetujui</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#1C1243] rounded-[2rem] p-6 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-20 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-6">
                <ArrowDownRight className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium text-white/70 mb-1">Surat Diterima</p>
              <h3 className="text-3xl font-black">{stats?.completedLetters || 0}</h3>
            </div>
          </div>
          
          <div className="bg-primary rounded-[2rem] p-6 text-white relative overflow-hidden shadow-violet-soft">
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-6">
                <ArrowUpRight className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium text-white/80 mb-1">Surat Menunggu</p>
              <h3 className="text-3xl font-black">{stats?.pendingLetters || 0}</h3>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-4">
        <div className="flex justify-between items-center mb-4 px-2">
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Pengumuman RT</h3>
          <Link href="#" className="text-sm font-bold text-primary">Lihat semua</Link>
        </div>
        <div className="bg-[#0B0A1A] rounded-[2rem] p-6 sm:p-8 relative overflow-hidden text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary opacity-30 blur-3xl rounded-full"></div>
          <div className="absolute top-4 right-8 w-12 h-12 bg-[#FFB800] rounded-full hidden sm:block"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-black tracking-tight mb-2">Kerja Bakti Minggu Ini</h2>
            <p className="text-sm font-medium text-white/70 max-w-sm">Dapatkan info selengkapnya untuk kegiatan pembersihan gorong-gorong.</p>
          </div>
        </div>
      </div>
      
    </div>
  );
}
