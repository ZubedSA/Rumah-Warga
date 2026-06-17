'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Users, ArrowRight } from 'lucide-react';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden font-sans">
      {/* Premium Ambient Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/20 rounded-full mix-blend-multiply filter blur-[120px] opacity-60 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-400/20 rounded-full mix-blend-multiply filter blur-[120px] opacity-50 animate-pulse animation-delay-2000"></div>

      <div className="relative z-10 w-full max-w-4xl p-6">
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <div className="w-16 h-16 bg-accent rounded-[1.2rem] flex items-center justify-center mx-auto shadow-sm border border-slate-100">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-4">Pilih Peran Anda</h1>
          <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-xl mx-auto">
            Selamat datang di RumahWarga. Apakah Anda ingin mendaftarkan lingkungan baru atau bergabung dengan yang sudah ada?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto">
          {/* Create RT Card */}
          <Link href="/onboarding/create" className="group">
            <div className="h-full bg-white border border-slate-100 p-6 md:p-8 rounded-[2.5rem] shadow-[0_4px_24px_rgb(0,0,0,0.03)] hover:shadow-violet-soft hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors"></div>
              <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-3 relative z-10">Daftarkan RT Baru</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 relative z-10">
                Saya adalah Pengurus/Ketua RT yang ingin membuat sistem dan mengelola warga di lingkungan saya.
              </p>
              <div className="flex items-center text-primary font-bold text-sm tracking-wide uppercase group-hover:translate-x-2 transition-transform relative z-10">
                Lanjutkan <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </Link>

          {/* Join RT Card */}
          <Link href="/onboarding/join" className="group">
            <div className="h-full bg-white border border-slate-100 p-6 md:p-8 rounded-[2.5rem] shadow-[0_4px_24px_rgb(0,0,0,0.03)] hover:shadow-violet-soft hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors"></div>
              <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-3 relative z-10">Gabung sebagai Warga</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8 relative z-10">
                Saya adalah warga yang telah mendapatkan Kode Undangan RT dari pengurus lingkungan saya.
              </p>
              <div className="flex items-center text-primary font-bold text-sm tracking-wide uppercase group-hover:translate-x-2 transition-transform relative z-10">
                Lanjutkan <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
