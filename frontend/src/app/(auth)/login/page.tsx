'use client';

import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      googleProvider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const response = await apiClient.post('/auth/login', {
        idToken,
      });

      const userObj = (response as any).user;
      setAuth((response as any).accessToken, userObj);
      
      toast.success('Berhasil masuk!');
      
      if (!userObj.isOnboarded) {
        router.push('/onboarding');
      } else if (userObj.role === 'WARGA') {
        router.push('/portal'); // Warga Portal Placeholder
      } else if (userObj.role === 'SUPER_ADMIN') {
        router.push('/superadmin');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error(error);
      toast.error('Gagal masuk. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden font-sans">
      {/* Premium Light Ambient Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/20 rounded-full mix-blend-multiply filter blur-[120px] opacity-60 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-400/20 rounded-full mix-blend-multiply filter blur-[120px] opacity-50 animate-pulse animation-delay-2000"></div>

      <div className="relative z-10 w-[90%] md:w-full max-w-[420px] p-6 sm:p-10 bg-white border border-slate-100 shadow-[0_4px_24px_rgb(0,0,0,0.03)] rounded-[2.5rem] animate-in fade-in duration-700">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-8 group">
            <div className="w-16 h-16 bg-accent rounded-[1.2rem] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 shadow-sm border border-slate-100">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
          </Link>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-3">Selamat Datang</h1>
          <p className="text-slate-500 text-sm font-medium leading-relaxed px-4">
            Masuk untuk mengakses portal manajemen lingkungan Anda.
          </p>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full h-14 text-sm font-bold flex items-center justify-center gap-4 bg-white text-slate-700 border border-slate-200 shadow-sm rounded-full transition-all duration-300 hover:shadow-violet-soft hover:border-primary/30 hover:-translate-y-1 uppercase tracking-wide disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {isLoading ? (
            <span className="flex items-center gap-3">
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></span>
              Memverifikasi...
            </span>
          ) : (
            <>
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Masuk Dengan Google
            </>
          )}
        </button>

        <div className="mt-12 text-center text-[11px] text-slate-400 font-bold tracking-widest uppercase">
          Sistem Keamanan Terenkripsi
        </div>
      </div>
    </div>
  );
}
