'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, X, Download, Share } from 'lucide-react';

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1. Mendaftarkan Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('SW terdaftar:', reg.scope))
        .catch((err) => console.error('Gagal mendaftar SW:', err));
    }

    // 2. Cek apakah sudah dalam mode aplikasi (Standalone PWA)
    const checkStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;

    setIsStandalone(checkStandalone);

    if (checkStandalone) {
      return; // Sudah pakai aplikasi PWA, jangan tampilkan popup
    }

    // Cek apakah pernah ditutup sebelumnya dalam 24 jam terakhir
    const dismissedTime = localStorage.getItem('pwa_prompt_dismissed');
    if (dismissedTime && Date.now() - Number(dismissedTime) < 24 * 60 * 60 * 1000) {
      return;
    }

    // 3. Deteksi perangkat iOS Safari
    const iosCheck = 
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iosCheck);

    // 4. Tangkap event beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 5. Trigger popup otomatis setelah 10 detik di browser biasa
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, 10000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      alert('Untuk pengguna iOS Safari: Tekan tombol Bagikan (Share) lalu pilih "Tambahkan ke Layar Utama" (Add to Home Screen).');
    } else {
      alert('Aplikasi sudah siap dipasang atau browser Anda tidak mendukung pemasangan otomatis. Coba tekan menu browser (3 titik) lalu pilih "Instal Aplikasi".');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa_prompt_dismissed', Date.now().toString());
  };

  if (!showPrompt || isStandalone) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-[calc(100%-3rem)] sm:w-96 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-primary/20 p-6 rounded-3xl shadow-[0_12px_40px_rgba(92,23,229,0.18)] animate-in slide-in-from-bottom-6 fade-in duration-500">
      <button 
        onClick={handleDismiss}
        className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Tutup"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-4 mb-5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#5C17E5] flex items-center justify-center shrink-0 shadow-lg shadow-[#5C17E5]/25">
          <ShieldCheck className="w-7 h-7 text-white" />
        </div>
        <div>
          <h4 className="text-base font-black text-slate-800 dark:text-white leading-tight mb-1">
            Pasang Aplikasi RumahWarga
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            Akses portal administrasi RT & RW lebih ringan, cepat, dan praktis langsung dari layar utama HP Anda.
          </p>
        </div>
      </div>

      {isIOS ? (
        <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-100 dark:border-purple-900/50 text-xs text-purple-700 dark:text-purple-300 flex items-center gap-2">
          <Share className="w-4 h-4 shrink-0" />
          <span>Pengguna iOS: Ketuk <strong>Share</strong> lalu pilih <strong>Add to Home Screen</strong>.</span>
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <button
          onClick={handleInstallClick}
          className="flex-1 h-11 px-4 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#5C17E5] hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-[#5C17E5]/20 hover:scale-[1.02]"
        >
          <Download className="w-4 h-4" />
          Pasang Sekarang
        </button>
        <button
          onClick={handleDismiss}
          className="h-11 px-5 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-300 text-xs font-bold transition-all"
        >
          Nanti
        </button>
      </div>
    </div>
  );
}
