'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, ArrowLeft, User, MapPin, Phone, CreditCard, Calendar } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

interface Region {
  id: string;
  nama: string;
}

export default function CreateRtPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    nik: '',
    phone: '',
    gender: 'LAKI_LAKI',
    birthPlace: '',
    birthDate: ''
  });
  
  const [streetAddress, setStreetAddress] = useState('');
  const [rt, setRt] = useState('');
  const [rw, setRw] = useState('');

  const [provinces, setProvinces] = useState<Region[]>([]);
  const [regencies, setRegencies] = useState<Region[]>([]);
  const [districts, setDistricts] = useState<Region[]>([]);
  const [villages, setVillages] = useState<Region[]>([]);

  const [selectedProv, setSelectedProv] = useState<Region | null>(null);
  const [selectedReg, setSelectedReg] = useState<Region | null>(null);
  const [selectedDist, setSelectedDist] = useState<Region | null>(null);
  const [selectedVill, setSelectedVill] = useState<Region | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);
  const accessToken = useAuthStore(state => state.accessToken);

  useEffect(() => {
    fetch('https://ibnux.github.io/data-indonesia/provinsi.json')
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(err => console.error(err));
  }, []);

  const handleProvChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provId = e.target.value;
    const prov = provinces.find(p => p.id === provId) || null;
    setSelectedProv(prov);
    setSelectedReg(null);
    setSelectedDist(null);
    setSelectedVill(null);
    setRegencies([]);
    setDistricts([]);
    setVillages([]);
    if (provId) {
      fetch(`https://ibnux.github.io/data-indonesia/kabupaten/${provId}.json`)
        .then(res => res.json())
        .then(data => setRegencies(data));
    }
  };

  const handleRegChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regId = e.target.value;
    const reg = regencies.find(p => p.id === regId) || null;
    setSelectedReg(reg);
    setSelectedDist(null);
    setSelectedVill(null);
    setDistricts([]);
    setVillages([]);
    if (regId) {
      fetch(`https://ibnux.github.io/data-indonesia/kecamatan/${regId}.json`)
        .then(res => res.json())
        .then(data => setDistricts(data));
    }
  };

  const handleDistChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const distId = e.target.value;
    const dist = districts.find(p => p.id === distId) || null;
    setSelectedDist(dist);
    setSelectedVill(null);
    setVillages([]);
    if (distId) {
      fetch(`https://ibnux.github.io/data-indonesia/kelurahan/${distId}.json`)
        .then(res => res.json())
        .then(data => setVillages(data));
    }
  };

  const handleVillChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const villId = e.target.value;
    const vill = villages.find(p => p.id === villId) || null;
    setSelectedVill(vill);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.nik.trim() || !formData.phone.trim()) {
      toast.error('Mohon lengkapi data diri Anda (Nama, NIK, dan No HP wajib diisi)');
      return;
    }
    if (!selectedProv || !selectedReg || !selectedDist || !selectedVill || !rt.trim() || !rw.trim()) {
      toast.error('Mohon lengkapi data wilayah (Provinsi hingga Desa), RT, dan RW');
      return;
    }

    const fullAddress = `${streetAddress ? streetAddress + ', ' : ''}RT ${rt}/RW ${rw}, Desa/Kelurahan ${selectedVill.nama}, Kecamatan ${selectedDist.nama}, Kabupaten/Kota ${selectedReg.nama}, Provinsi ${selectedProv.nama}`;

    try {
      setIsLoading(true);
      const response = await apiClient.post('/onboarding/create-rt', { 
        profileData: {
          fullName: formData.fullName,
          nik: formData.nik,
          phone: formData.phone,
          address: fullAddress,
          provinceId: selectedProv.id,
          provinceName: selectedProv.nama,
          regencyId: selectedReg.id,
          regencyName: selectedReg.nama,
          districtId: selectedDist.id,
          districtName: selectedDist.nama,
          villageId: selectedVill.id,
          villageName: selectedVill.nama,
          rt: rt,
          rw: rw,
          gender: formData.gender,
          birthPlace: formData.birthPlace,
          birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : undefined
        }
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      const newAccessToken = (response as any).accessToken;
      const updatedUser = (response as any).user;
      const newTenant = (response as any).tenant;
      
      setAuth(newAccessToken, updatedUser);
      
      toast.success(`Berhasil mendaftar! Selamat datang di ${newTenant.name}`);
      router.push('/dashboard');
    } catch (error: any) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Gagal membuat lingkungan. Silakan coba lagi.';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans p-4 sm:p-6 py-8 md:py-12">
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/20 rounded-full mix-blend-multiply filter blur-[120px] opacity-60 animate-pulse"></div>
      
      <div className="relative z-10 w-full max-w-[600px]">
        <Link href="/onboarding" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-primary transition-colors mb-6 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Kembali
        </Link>
        
        <div className="bg-white border border-slate-100 p-6 sm:p-8 md:p-10 rounded-[2rem] shadow-[0_4px_24px_rgb(0,0,0,0.04)]">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
              <ShieldCheck className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Daftarkan Lingkungan</h1>
              <p className="text-slate-500 text-sm font-medium mt-1">Lengkapi data untuk menjadi Admin Utama</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Data Diri Admin */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-primary" /> Data Diri Admin
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-2">Nama Lengkap (Sesuai KTP) *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama lengkap"
                    className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    disabled={isLoading}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1"><CreditCard className="w-3 h-3"/> NIK *</label>
                  <input
                    type="text"
                    name="nik"
                    value={formData.nik}
                    onChange={handleInputChange}
                    placeholder="16 Digit NIK"
                    maxLength={16}
                    className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    disabled={isLoading}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1"><Phone className="w-3 h-3"/> No. HP / WhatsApp *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="08123456789"
                    className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    disabled={isLoading}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Tempat Lahir</label>
                  <input
                    type="text"
                    name="birthPlace"
                    value={formData.birthPlace}
                    onChange={handleInputChange}
                    placeholder="Kota kelahiran"
                    className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center gap-1"><Calendar className="w-3 h-3"/> Tanggal Lahir</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Jenis Kelamin</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    disabled={isLoading}
                  >
                    <option value="LAKI_LAKI">Laki-Laki</option>
                    <option value="PEREMPUAN">Perempuan</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <h3 className="text-xs font-bold text-slate-700 mb-4 border-b pb-2">Wilayah Domisili *</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">Provinsi *</label>
                      <select
                        value={selectedProv?.id || ''}
                        onChange={handleProvChange}
                        className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        disabled={isLoading || provinces.length === 0}
                        required
                      >
                        <option value="">Pilih Provinsi</option>
                        {provinces.map(p => <option key={p.id} value={p.id}>{p.nama}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">Kabupaten/Kota *</label>
                      <select
                        value={selectedReg?.id || ''}
                        onChange={handleRegChange}
                        className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        disabled={isLoading || regencies.length === 0}
                        required
                      >
                        <option value="">Pilih Kabupaten/Kota</option>
                        {regencies.map(r => <option key={r.id} value={r.id}>{r.nama}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">Kecamatan *</label>
                      <select
                        value={selectedDist?.id || ''}
                        onChange={handleDistChange}
                        className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        disabled={isLoading || districts.length === 0}
                        required
                      >
                        <option value="">Pilih Kecamatan</option>
                        {districts.map(d => <option key={d.id} value={d.id}>{d.nama}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">Desa/Kelurahan *</label>
                      <select
                        value={selectedVill?.id || ''}
                        onChange={handleVillChange}
                        className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        disabled={isLoading || villages.length === 0}
                        required
                      >
                        <option value="">Pilih Desa/Kelurahan</option>
                        {villages.map(v => <option key={v.id} value={v.id}>{v.nama}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">RT *</label>
                      <input
                        type="text"
                        value={rt}
                        onChange={(e) => setRt(e.target.value)}
                        placeholder="Contoh: 001"
                        className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">RW *</label>
                      <input
                        type="text"
                        value={rw}
                        onChange={(e) => setRw(e.target.value)}
                        placeholder="Contoh: 002"
                        className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>

                  <label className="block text-xs font-bold text-slate-700 mb-2">Detail Jalan/Perumahan (Opsional)</label>
                  <textarea
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="Masukkan nama jalan, perumahan, blok, atau nomor rumah"
                    rows={2}
                    className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading || !formData.fullName.trim() || !formData.nik.trim()}
              className="w-full h-14 bg-gradient-violet text-white text-sm font-bold uppercase tracking-wide rounded-full shadow-violet-soft hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center mt-4"
            >
              {isLoading ? (
                <span className="flex items-center gap-3">
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                  Memproses Pendaftaran...
                </span>
              ) : (
                'Selesaikan Pendaftaran'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
