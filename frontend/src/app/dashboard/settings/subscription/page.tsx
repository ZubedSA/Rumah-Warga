'use client';

import React from 'react';
import { Crown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SubscriptionSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 p-8 rounded-3xl shadow-[0_4px_24px_rgb(0,0,0,0.1)] border border-slate-800 relative overflow-hidden">
        {/* Dekorasi BG */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gradient-to-br from-primary/30 to-violet-500/0 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            
            <div className="w-24 h-24 bg-gradient-to-br from-amber-300 to-amber-500 rounded-3xl flex items-center justify-center shadow-lg shrink-0">
              <Crown className="w-12 h-12 text-white" />
            </div>
            
            <div className="text-center md:text-left flex-1">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-400 uppercase tracking-widest mb-3">
                Paket Aktif
              </span>
              <h2 className="text-3xl font-black text-white mb-2">PRO / Enterprise</h2>
              <p className="text-sm font-medium text-slate-400 mb-6">
                Akses penuh ke seluruh fitur premium RumahWarga tanpa batas data warga dan surat menyurat.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  Data Warga Tanpa Batas
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  Notifikasi WhatsApp
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  Pencetakan Surat Otomatis
                </div>
                <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  Laporan Keuangan Ekspor
                </div>
              </div>
              
              <Button className="bg-white hover:bg-slate-100 text-slate-900 rounded-full px-8 shadow-sm font-bold w-full sm:w-auto">
                Kelola Tagihan
              </Button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
