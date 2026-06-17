'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, FileText, MessageCircle, Crown, Settings } from 'lucide-react';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    { href: '/dashboard/settings', label: 'Profil Akun', icon: User, exact: true },
    { href: '/dashboard/settings/letters', label: 'Surat', icon: FileText, exact: false },
    { href: '/dashboard/settings/whatsapp', label: 'WhatsApp', icon: MessageCircle, exact: false },
    { href: '/dashboard/settings/subscription', label: 'Langganan', icon: Crown, exact: false },
  ];

  return (
    <div className="space-y-6 pb-24 md:pb-0">
      
      {/* Header Pengaturan */}
      <div className="flex items-center gap-4 mb-2">
        <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 shrink-0">
          <Settings className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Pengaturan</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Kelola preferensi dan integrasi sistem Anda</p>
        </div>
      </div>

      {/* Navigation Tabs (Scrollable on Mobile) */}
      <div className="relative">
        <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          {tabs.map((tab) => {
            const isActive = tab.exact 
              ? pathname === tab.href 
              : pathname?.startsWith(tab.href);
            
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                  isActive 
                    ? 'bg-slate-800 text-white shadow-md' 
                    : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100 shadow-sm'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {tab.label}
              </Link>
            );
          })}
        </div>
        {/* Right fade edge for mobile scrolling indication */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none md:hidden"></div>
      </div>

      {/* Tab Content Area */}
      <div className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {children}
      </div>

    </div>
  );
}
