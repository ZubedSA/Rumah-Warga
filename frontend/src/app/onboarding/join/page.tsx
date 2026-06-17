'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Users, ArrowLeft } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function JoinRtPage() {
  const [rtCode, setRtCode] = useState('');
  const [nik, setNik] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);
  const accessToken = useAuthStore(state => state.accessToken);
  const [tenants, setTenants] = useState<any[]>([]);

  useEffect(() => {
    if (accessToken) {
      apiClient.get('/onboarding/tenants', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      .then(res => setTenants(res as any))
      .catch(err => console.error('Failed to fetch tenants', err));
    }
  }, [accessToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rtCode.trim()) {
      toast.error('Kode Lingkungan tidak boleh kosong');
      return;
    }
    if (!nik.trim() || nik.length < 16) {
      toast.error('NIK tidak valid (minimal 16 digit)');
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiClient.post('/onboarding/join-rt', { code: rtCode, nik }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      const newAccessToken = (response as any).accessToken;
      const updatedUser = (response as any).user;
      const tenant = (response as any).tenant;
      
      setAuth(newAccessToken, updatedUser);
      
      toast.success(`Berhasil bergabung dengan ${tenant.name}!`);
      // Redirect to citizen portal
      router.push('/portal');
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message || 'Kode tidak valid. Silakan periksa kembali.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden font-sans p-4 sm:p-6 py-8 md:py-12">
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-400/20 rounded-full mix-blend-multiply filter blur-[120px] opacity-50 animate-pulse animation-delay-2000"></div>
      
      <div className="relative z-10 w-full max-w-[480px]">
        <Link href="/onboarding" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-primary transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Kembali
        </Link>
        
        <div className="bg-white border border-slate-100 p-6 sm:p-10 rounded-[2.5rem] shadow-[0_4px_24px_rgb(0,0,0,0.03)]">
          <div className="w-16 h-16 bg-accent rounded-[1.2rem] flex items-center justify-center mb-8 shadow-sm border border-slate-100">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-3">Gabung Lingkungan</h1>
          <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
            Masukkan Kode Undangan yang diberikan oleh Pengurus RT untuk bergabung.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 tracking-wide uppercase mb-2">Pilih Lingkungan (RT)</label>
              <Select disabled={isLoading} value={rtCode} onValueChange={(val) => setRtCode(val || '')}>
                <SelectTrigger className="w-full h-14 bg-slate-50 border-slate-200 rounded-xl text-sm font-bold focus:ring-primary/20 focus:border-primary">
                  <SelectValue placeholder="Pilih Lingkungan Anda">
                    {rtCode ? tenants.find(t => t.code === rtCode)?.name : "Pilih Lingkungan Anda"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {tenants.map(t => (
                    <SelectItem key={t.code} value={t.code}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 tracking-wide uppercase mb-2">Nomor Induk Kependudukan (NIK)</label>
              <input
                type="text"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                placeholder="Masukkan 16 digit NIK Anda"
                className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800 text-center"
                disabled={isLoading}
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !rtCode.trim()}
              className="w-full h-14 bg-gradient-violet text-white text-sm font-bold uppercase tracking-wide rounded-full shadow-violet-soft hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center"
            >
              {isLoading ? (
                <span className="flex items-center gap-3">
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                  Memverifikasi...
                </span>
              ) : (
                'Gabung Sekarang'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
