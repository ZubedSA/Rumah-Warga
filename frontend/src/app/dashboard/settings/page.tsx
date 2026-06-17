'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api-client';
import { User, MapPin, Loader2, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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

  if (!profile) {
    return (
      <div className="p-6">
        <p>Gagal memuat profil.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data Diri */}
        <div className="bg-white p-6 rounded-3xl shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-slate-100">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
            <User className="w-4 h-4 text-primary" /> Data Diri
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-slate-400 mb-1">Nama Lengkap</p>
              <p className="text-sm font-bold text-slate-800">{profile.name || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 mb-1">Email</p>
              <p className="text-sm font-bold text-slate-800">{profile.email || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 mb-1">NIK</p>
              <p className="text-sm font-bold text-slate-800">{profile.nik || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 mb-1">No. HP</p>
              <p className="text-sm font-bold text-slate-800">{profile.phone || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 mb-1">Peran</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
                {profile.role}
              </span>
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
              <p className="text-xs font-bold text-slate-400 mb-1">Nama Lingkungan</p>
              <p className="text-sm font-bold text-slate-800">{profile.tenant?.name || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 mb-1">Provinsi</p>
              <p className="text-sm font-bold text-slate-800">{profile.provinceName || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 mb-1">Kabupaten/Kota</p>
              <p className="text-sm font-bold text-slate-800">{profile.regencyName || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 mb-1">Kecamatan</p>
              <p className="text-sm font-bold text-slate-800">{profile.districtName || '-'}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 mb-1">Desa/Kelurahan</p>
              <p className="text-sm font-bold text-slate-800">{profile.villageName || '-'}</p>
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

      <div className="flex justify-center pt-6 pb-20 md:pb-6">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-8 py-3 bg-rose-50 text-rose-600 rounded-full font-bold hover:bg-rose-100 hover:scale-105 transition-all shadow-sm"
        >
          <LogOut className="w-5 h-5" />
          Keluar dari Akun
        </button>
      </div>
    </div>
  );
}
