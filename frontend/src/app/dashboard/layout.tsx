'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Mail, Wallet, ShieldCheck, Bell, Settings, LogOut, Home, FileText, User } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useGetNotifications, useMarkNotificationAsRead } from '@/features/notifications/api/use-notifications';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const accessToken = useAuthStore(state => state.accessToken);
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const [profile, setProfile] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  const { data: notifications } = useGetNotifications(!!accessToken);
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const unreadCount = notifications?.filter((n: any) => !n.isRead).length || 0;

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (accessToken) {
      apiClient.get('/auth/profile', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      .then(res => {
        setProfile(res);
        if ((res as any).role === 'WARGA') {
          router.replace('/portal');
        } else if ((res as any).role === 'SUPER_ADMIN') {
          router.replace('/superadmin');
        }
      })
      .catch(err => console.error('Failed to fetch profile in layout:', err));
    }
  }, [accessToken, router]);

  const role = profile?.role || user?.role;

  const handleNotificationClick = (notif: any) => {
    if (!notif.isRead) {
      markAsRead(notif.id);
    }
    try {
      if (notif.type) {
        const data = JSON.parse(notif.type);
        if (data.letterId) {
          const basePath = role === 'WARGA' ? '/portal/letters' : '/dashboard/letters';
          router.push(`${basePath}/${data.letterId}`);
          return;
        }
      }
    } catch (e) {
      console.log('Notification type is not JSON:', notif.type);
    }
    if (notif.title === 'Pengajuan Surat Baru' || notif.message.includes('mengajukan permohonan')) {
      const basePath = role === 'WARGA' ? '/portal/letters' : '/dashboard/letters';
      router.push(basePath);
    }
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    ...(role !== 'WARGA' ? [{ href: '/dashboard/citizens', label: 'Data Warga', icon: Users }] : []),
    { href: '/dashboard/letters', label: role === 'WARGA' ? 'Surat Saya' : 'Persuratan', icon: FileText },
    ...(role !== 'WARGA' ? [{ href: '/dashboard/finance', label: 'Keuangan', icon: Wallet }] : []),
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

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden font-sans text-foreground">
      
      {/* Mobile Top Header */}
      <header className="md:hidden h-20 bg-white flex items-center justify-between px-6 z-50 sticky top-0 shadow-[0_4px_24px_rgb(0,0,0,0.03)] rounded-b-3xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-violet flex items-center justify-center shadow-violet-soft">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-800">RumahWarga</span>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="relative p-2 text-slate-400 hover:text-primary transition-colors hover-lift outline-none">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white shadow-sm ring-2 ring-white animate-in zoom-in duration-300">
                  {unreadCount}
                </span>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-2xl p-2 border-slate-100 shadow-xl max-h-[400px] overflow-y-auto">
              <div className="font-black text-slate-800 text-lg px-3 pt-2">Notifikasi</div>
              <DropdownMenuSeparator className="my-2" />
              {notifications && notifications.length > 0 ? (
                notifications.map((notif: any) => (
                  <DropdownMenuItem 
                    key={notif.id} 
                    className={`flex flex-col items-start px-4 py-3 rounded-xl mb-1 cursor-pointer transition-colors ${!notif.isRead ? 'bg-slate-50' : ''}`}
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className={`text-sm font-bold ${!notif.isRead ? 'text-slate-800' : 'text-slate-600'}`}>{notif.title}</span>
                      {!notif.isRead && <span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{notif.message}</p>
                    <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wider">{new Date(notif.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-slate-500 text-sm font-medium">Belum ada notifikasi</div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="h-6 w-[1px] bg-slate-200"></div>

          <div className="w-10 h-10 rounded-full border-2 border-primary/20 p-0.5">
            <Link href="/dashboard/settings" className="w-full h-full rounded-full bg-gradient-violet text-white flex items-center justify-center font-bold text-sm shadow-inner cursor-pointer hover:opacity-90">
              {isMounted ? (profile?.name || user?.name || 'U')[0].toUpperCase() : 'U'}
            </Link>
          </div>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-[280px] bg-white flex-col z-20 shadow-[4px_0_24px_rgb(0,0,0,0.02)]">
        <div className="h-32 flex items-center px-10">
          <div className="text-2xl font-black text-slate-800 flex items-center gap-3 tracking-tight">
            <div className="w-12 h-12 rounded-[1.2rem] bg-gradient-violet flex items-center justify-center shadow-violet-soft">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            Rumah<span className="text-primary">Warga</span>.
          </div>
        </div>
        
        <nav className="flex-1 px-6 py-4 space-y-3">
          <div className="text-[11px] font-bold text-slate-400 mb-6 px-4 uppercase tracking-[0.2em]">Menu Utama</div>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(`${item.href}/`));
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
                <item.icon className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-8">
          <Link href="/dashboard/settings" className="flex items-center gap-4 px-5 py-4 rounded-3xl text-sm font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all duration-300 group">
            <Settings className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
            Pengaturan
          </Link>
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
              {!isMounted ? 'Memuat...' : (profile?.tenant?.name || 'Menunggu Sinkronisasi...')}
            </h2>
            <p className="text-sm text-slate-500 font-medium mt-1">
              {!isMounted ? 'Memuat...' : (profile?.villageName ? `Desa/Kelurahan ${profile.villageName}` : 'Sinkronisasi profil...')}
            </p>
          </div>
          <div className="flex items-center space-x-6 bg-white px-6 py-3 rounded-full shadow-[0_4px_24px_rgb(0,0,0,0.03)]">
            <DropdownMenu>
              <DropdownMenuTrigger className="relative p-2 text-slate-400 hover:text-primary transition-colors hover-lift outline-none">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white shadow-sm ring-2 ring-white animate-in zoom-in duration-300">
                    {unreadCount}
                  </span>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 rounded-2xl p-2 border-slate-100 shadow-xl max-h-[400px] overflow-y-auto">
                <div className="font-black text-slate-800 text-lg px-3 pt-2">Notifikasi</div>
                <DropdownMenuSeparator className="my-2" />
                {notifications && notifications.length > 0 ? (
                  notifications.map((notif: any) => (
                    <DropdownMenuItem 
                      key={notif.id} 
                      className={`flex flex-col items-start px-4 py-3 rounded-xl mb-1 cursor-pointer transition-colors ${!notif.isRead ? 'bg-slate-50' : ''}`}
                      onClick={() => handleNotificationClick(notif)}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className={`text-sm font-bold ${!notif.isRead ? 'text-slate-800' : 'text-slate-600'}`}>{notif.title}</span>
                        {!notif.isRead && <span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{notif.message}</p>
                      <span className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wider">{new Date(notif.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-slate-500 text-sm font-medium">Belum ada notifikasi</div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <Link href="/dashboard/settings" className="flex items-center space-x-4 cursor-pointer group hover-lift">
              <div className="text-right">
                <div className="text-sm font-black text-slate-800 group-hover:text-primary transition-colors">
                  {!isMounted ? 'Memuat...' : (profile?.name || user?.name || 'User')}
                </div>
                <div className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">
                  {!isMounted ? 'USER' : (profile?.role === 'SUPER_ADMIN' ? 'Admin Utama' : (profile?.role || user?.role || 'User'))}
                </div>
              </div>
              <div className="w-12 h-12 rounded-full p-0.5 border-2 border-primary/20 group-hover:border-primary/50 transition-colors bg-white shadow-sm">
                <div className="w-full h-full rounded-full bg-gradient-violet text-white flex items-center justify-center font-bold text-lg shadow-inner">
                  {isMounted ? (profile?.name || user?.name || 'U')[0].toUpperCase() : 'U'}
                </div>
              </div>
            </Link>
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
        <nav className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 flex items-center justify-between px-2 py-2">
          {[...navItems, { href: '/dashboard/settings', label: 'Pengaturan', icon: Settings }].map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(`${item.href}/`));
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
