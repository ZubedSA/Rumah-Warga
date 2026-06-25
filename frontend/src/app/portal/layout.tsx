'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Wallet, User, ShieldCheck, Bell } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api-client';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const accessToken = useAuthStore(state => state.accessToken);
  const user = useAuthStore(state => state.user);
  const [profile, setProfile] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (accessToken) {
      apiClient.get('/auth/profile', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      .then(res => setProfile(res))
      .catch(err => console.error('Failed to fetch profile in portal layout:', err));
    }
  }, [accessToken]);

  const navItems = [
    { href: '/portal', label: 'Beranda', icon: Home },
    { href: '/portal/letters', label: 'Surat', icon: FileText },
    { href: '/portal/finance', label: 'Keuangan', icon: Wallet },
    { href: '/portal/settings', label: 'Profil', icon: User },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans text-foreground">
      
      {/* Mobile Top Header */}
      <header className="md:hidden h-20 bg-white flex items-center justify-between px-6 z-50 sticky top-0 shadow-[0_4px_24px_rgb(0,0,0,0.03)] rounded-b-3xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-violet flex items-center justify-center shadow-violet-soft">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-slate-800 leading-none">Portal Warga</span>
            <span className="text-[10px] font-bold text-slate-400 mt-0.5">{isMounted ? (profile?.tenant?.name || 'RT') : '...'}</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-400 hover:text-primary transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full shadow-sm"></span>
          </button>
        </div>
      </header>

      {/* Desktop Top Header (for consistency if viewed on PC) */}
      <header className="hidden md:flex h-24 bg-white items-center justify-between px-10 z-50 sticky top-0 shadow-[0_4px_24px_rgb(0,0,0,0.03)] border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-violet flex items-center justify-center shadow-violet-soft">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-slate-800 leading-none">Portal Warga</span>
            <span className="text-xs font-bold text-slate-400 mt-1">{isMounted ? (profile?.tenant?.name || 'RT') : '...'}</span>
          </div>
        </div>
        
        <nav className="flex items-center space-x-2 bg-slate-50 p-1.5 rounded-full border border-slate-100">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/portal' && pathname?.startsWith(`${item.href}`));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-primary/20 p-0.5">
            <Link href="/portal/settings" className="w-full h-full rounded-full bg-gradient-violet text-white flex items-center justify-center font-bold text-sm shadow-inner cursor-pointer hover:opacity-90">
              {isMounted ? (profile?.name || user?.name || 'U')[0].toUpperCase() : 'U'}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10 pb-28 md:pb-10">
        <div className="flex-1 overflow-y-auto px-6 py-6 md:p-10 relative scroll-smooth">
          <div className="max-w-4xl mx-auto animate-in fade-in duration-700">
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Floating Bottom Navigation */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
        <nav className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 flex items-center justify-between px-2 py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/portal' && pathname?.startsWith(`${item.href}`));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center justify-center w-[72px] h-[64px] rounded-3xl transition-all duration-300 ${
                  isActive ? 'bg-gradient-violet shadow-violet-soft -translate-y-2' : 'hover:bg-slate-50'
                }`}
              >
                <item.icon className={`w-5 h-5 mb-1 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className={`text-[10px] font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>
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
