'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api-client';
import { User, MapPin, Loader2, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export default function PortalSettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [phoneInput, setPhoneInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const accessToken = useAuthStore(state => state.accessToken);
  const logout = useAuthStore(state => state.logout);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('/auth/profile', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setProfile(response);
        setPhoneInput((response as any).phone || '');
      } catch (error) {
        console.error('Failed to fetch profile', error);
        toast.error('Gagal memuat data profil');
      } finally {
        setIsLoading(false);
      }
    };

    if (accessToken) {
      fetchProfile();
    }
  }, [accessToken]);

  const handleUpdatePhone = async () => {
    setIsUpdating(true);
    try {
      await apiClient.patch('/auth/profile', { phone: phoneInput }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      toast.success('Nomor WhatsApp berhasil diperbarui');
      setProfile((prev: any) => ({ ...prev, phone: phoneInput }));
    } catch (error) {
      console.error('Failed to update phone', error);
      toast.error('Gagal memperbarui nomor WhatsApp');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Gagal keluar');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6">
        <p>Gagal memuat profil.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      
      <div className="flex items-center gap-4 bg-white p-6 rounded-3xl shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-slate-100 mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-violet flex items-center justify-center text-white text-2xl font-black shadow-violet-soft shrink-0">
          {profile.name?.[0]?.toUpperCase() || 'W'}
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">{profile.name}</h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary mt-1 uppercase tracking-wider">
            {profile.role}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data Diri */}
        <div className="bg-white p-6 rounded-3xl shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-slate-100">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
            <User className="w-4 h-4 text-primary" /> Data Diri
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-slate-400 mb-1">Email</p>
              <p className="text-sm font-bold text-slate-800">{profile.email || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 mb-1">NIK</p>
              <p className="text-sm font-bold text-slate-800">{profile.nik || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 mb-1">No. HP / WhatsApp</p>
              <div className="flex gap-2 mt-1">
                <input 
                  type="text" 
                  value={phoneInput} 
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="Contoh: 08123456789"
                  className="flex-1 h-10 px-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 outline-none focus:border-primary transition-all bg-slate-50 focus:bg-white"
                />
                <button 
                  onClick={handleUpdatePhone}
                  disabled={isUpdating}
                  className="h-10 px-4 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold transition-all shrink-0 flex items-center justify-center disabled:opacity-50"
                >
                  {isUpdating ? '...' : 'Simpan'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Data Wilayah */}
        <div className="bg-white p-6 rounded-3xl shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-slate-100">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" /> Data Wilayah
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-slate-400 mb-1">Lingkungan (RT)</p>
              <p className="text-sm font-bold text-slate-800">{profile.tenant?.name || '-'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-bold text-slate-400 mb-1">RT</p>
                <p className="text-sm font-bold text-slate-800">{profile.rt || '-'}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 mb-1">RW</p>
                <p className="text-sm font-bold text-slate-800">{profile.rw || '-'}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 mb-1">Alamat Lengkap</p>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">{profile.address || '-'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-8 py-4 w-full md:w-auto justify-center bg-rose-50 text-rose-600 rounded-[1.2rem] font-bold hover:bg-rose-100 hover:scale-105 transition-all shadow-sm"
        >
          <LogOut className="w-5 h-5" />
          Keluar dari Akun
        </button>
      </div>
    </div>
  );
}
