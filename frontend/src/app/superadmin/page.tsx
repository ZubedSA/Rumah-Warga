'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Home, ShieldCheck, Bell, Activity } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/authStore';

export default function SuperadminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const accessToken = useAuthStore(state => state.accessToken);

  useEffect(() => {
    if (accessToken) {
      apiClient.get('/superadmin/stats', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      .then(res => {
        setStats(res);
      })
      .catch(err => console.error('Failed to fetch superadmin stats:', err))
      .finally(() => setLoading(false));
    }
  }, [accessToken]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Primary Statistic Card */}
      <div className="bg-gradient-violet rounded-[2.5rem] p-6 sm:p-8 md:p-10 relative overflow-hidden shadow-violet-soft text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black opacity-10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 bg-white/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium text-white/80">Dashboard Utama</p>
            </div>
            <div className="mt-6 mb-2">
              <p className="text-sm text-white/70 font-medium mb-1">Total Pengguna Keseluruhan</p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight">{stats?.totalUsers || 0}</h1>
            </div>
          </div>
          
          <div className="mt-6 md:mt-0 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 cursor-pointer hover:bg-white/20 transition-colors">
             <Bell className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Secondary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 sm:mt-0">
        <div className="bg-white rounded-[2rem] p-4 sm:p-6 shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col items-center justify-center group cursor-default">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[1.2rem] bg-indigo-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-500 mb-1">Total Pengguna</span>
          <span className="text-lg sm:text-xl font-black text-slate-800">{stats?.totalUsers || 0}</span>
        </div>
        
        <div className="bg-white rounded-[2rem] p-4 sm:p-6 shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col items-center justify-center group cursor-default">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[1.2rem] bg-blue-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
            <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-500 mb-1">Total Tenant</span>
          <span className="text-lg sm:text-xl font-black text-slate-800">{stats?.totalTenants || 0}</span>
        </div>
        
        <div className="bg-white rounded-[2rem] p-4 sm:p-6 shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col items-center justify-center group cursor-default">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[1.2rem] bg-emerald-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
            <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-500 mb-1">Status Server</span>
          <span className="text-lg sm:text-xl font-black text-slate-800">Aktif</span>
        </div>
        
        <div className="bg-white rounded-[2rem] p-4 sm:p-6 shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col items-center justify-center group cursor-default">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[1.2rem] bg-rose-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500" />
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-500 mb-1">Keamanan</span>
          <span className="text-lg sm:text-xl font-black text-slate-800">Optimal</span>
        </div>
      </div>

      {/* Analytics Section (Sebaran Tenant) */}
      <div className="pt-6">
        <h3 className="text-xl font-black text-slate-800 tracking-tight mb-6">Sebaran Tipe Tenant</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats?.tenantsByType?.map((t: any) => (
             <div key={t.type} className="bg-white rounded-[2rem] p-6 shadow-[0_4px_24px_rgb(0,0,0,0.02)] border border-slate-100 flex items-center justify-between hover-lift transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-[1.2rem] bg-slate-50 flex items-center justify-center">
                     {t.type === 'RT' || t.type === 'RW' ? <Home className="w-6 h-6 text-slate-600" /> : <Building2 className="w-6 h-6 text-slate-600" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500 tracking-wide uppercase">{t.type}</p>
                    <p className="text-3xl font-black text-slate-800">{t.count}</p>
                  </div>
                </div>
            </div>
          ))}
          {(!stats?.tenantsByType || stats.tenantsByType.length === 0) && (
            <div className="col-span-full p-10 text-center text-slate-500 bg-white rounded-[2rem] border border-slate-100 border-dashed">
              <Building2 className="w-10 h-10 mx-auto text-slate-300 mb-4" />
              <p className="font-medium">Belum ada data tipe tenant</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
