'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldCheck, LayoutDashboard, Building2, LogOut, Settings, Bell, Users, Activity } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api-client';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export default function SuperadminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const accessToken = useAuthStore(state => state.accessToken);
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const [profile, setProfile] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (accessToken) {
      apiClient.get('/auth/profile', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      .then(res => {
        setProfile(res);
        if ((res as any).role !== 'SUPER_ADMIN') {
          router.replace('/dashboard');
        }
      })
      .catch(err => {
          console.error('Failed to fetch profile in superadmin layout:', err);
          router.replace('/login');
      });
    } else {
        router.replace('/');
    }
  }, [accessToken, router, isMounted]);

  const navItems = [
    { href: '/superadmin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/superadmin/tenants', label: 'Daftar Tenant', icon: Building2 },
    { href: '/superadmin/users', label: 'Pengguna', icon: Users },
    { href: '/superadmin/logs', label: 'Log Sistem', icon: Activity },
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden font-sans text-foreground">
      
      {/* Mobile Top Header */}
      <header className="md:hidden h-20 bg-white flex items-center justify-between px-6 z-50 sticky top-0 shadow-[0_4px_24px_rgb(0,0,0,0.03)] rounded-b-3xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-violet flex items-center justify-center shadow-violet-soft">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-800">SuperAdmin</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleLogout} className="p-2 text-rose-500 hover:text-rose-600 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-[280px] bg-white flex-col z-20 shadow-[4px_0_24px_rgb(0,0,0,0.02)]">
        <div className="h-32 flex items-center px-10">
          <div className="text-2xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
            <div className="w-12 h-12 rounded-[1.2rem] bg-gradient-violet flex items-center justify-center shadow-violet-soft">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            Super<span className="text-slate-500">Admin</span>.
          </div>
        </div>
        
        <nav className="flex-1 px-6 py-4 space-y-3">
          <div className="text-[11px] font-bold text-slate-400 mb-6 px-4 uppercase tracking-[0.2em]">Menu Utama</div>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/superadmin' && pathname?.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-5 py-4 rounded-3xl text-sm font-bold transition-all duration-300 group ${
                  isActive
                    ? 'bg-gradient-violet text-white shadow-violet-soft scale-105'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <item.icon className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-8">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 rounded-3xl text-sm font-bold text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-300 group mt-2">
            <LogOut className="w-5 h-5 text-slate-400 group-hover:text-rose-500 transition-colors" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Desktop Header */}
        <header className="hidden md:flex h-28 items-center px-10 justify-between z-10 bg-transparent pt-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              Akses Penuh
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-1">
              Sistem Manajemen RumahWarga
            </p>
          </div>
          <div className="flex items-center space-x-6 bg-white px-6 py-3 rounded-full shadow-[0_4px_24px_rgb(0,0,0,0.03)]">
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-black text-slate-800 transition-colors">
                  {profile?.name || user?.name || 'Admin'}
                </div>
                <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">
                  Super Admin
                </div>
              </div>
              <div className="w-12 h-12 rounded-full p-0.5 border-2 border-slate-200 bg-white shadow-sm">
                <div className="w-full h-full rounded-full bg-gradient-violet text-white flex items-center justify-center font-bold text-lg shadow-inner">
                  {(profile?.name || user?.name || 'S')[0].toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 md:p-10 relative scroll-smooth">
          <div className="max-w-7xl mx-auto pb-28 md:pb-0 animate-in fade-in duration-700">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Floating Bottom Navigation */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
        <nav className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/superadmin' && pathname?.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center justify-center w-[64px] sm:w-[72px] h-[64px] rounded-3xl transition-all duration-300 ${
                  isActive ? 'bg-gradient-violet shadow-violet-soft -translate-y-2' : 'hover:bg-slate-50'
                }`}
              >
                <item.icon className={`w-5 h-5 mb-1 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className={`text-[9px] sm:text-[10px] font-bold ${isActive ? 'text-white' : 'text-slate-400'} truncate px-1 max-w-full text-center leading-tight`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-white shadow-sm" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
