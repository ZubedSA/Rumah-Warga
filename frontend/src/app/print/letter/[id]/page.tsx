'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useGetLetter } from '@/features/letters/api/use-letters';
import { ShieldCheck } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api-client';

export default function LetterPrintPage() {
  const params = useParams();
  const letterId = params.id as string;
  const { data: letter, isLoading } = useGetLetter(letterId);
  
  const accessToken = useAuthStore(state => state.accessToken);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (accessToken) {
      apiClient.get('/auth/profile', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      .then(res => setProfile(res))
      .catch(err => console.error('Failed to fetch profile:', err));
    }
  }, [accessToken]);

  useEffect(() => {
    // Otomatis trigger print ketika data selesai diload
    if (!isLoading && letter && profile) {
      const timer = setTimeout(() => {
        window.print();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, letter, profile]);

  if (isLoading || !profile) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-medium">Mempersiapkan dokumen cetak...</p>
      </div>
    );
  }

  if (!letter) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <p className="text-rose-500 font-medium">Surat tidak ditemukan.</p>
      </div>
    );
  }

  const today = new Date().toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Data dinamis dari profile tenant (jika ada) atau fallback
  const tenantName = profile?.tenant?.name || 'RUKUN TETANGGA 001';
  const villageName = profile?.villageName || 'Desa Percontohan';
  const districtName = profile?.districtName || 'Kecamatan Contoh';
  const regencyName = profile?.regencyName || 'Kabupaten Teladan';
  const provinceName = profile?.provinceName || 'Provinsi Maju';

  return (
    <div className="bg-white min-h-screen text-black">
      {/* 
        A4 Format Constraints 
        Di layar monitor dibungkus div max-w-4xl, saat di-print (media print) lebarnya 100%
      */}
      <div className="max-w-[210mm] mx-auto bg-white p-[20mm] min-h-[297mm] shadow-lg print:shadow-none print:p-0 print:m-0 print:max-w-full">
        
        {/* KOP SURAT */}
        <div className="border-b-4 border-double border-black pb-4 mb-8 flex items-center justify-between">
          <div className="w-24 h-24 flex items-center justify-center border-2 border-black rounded-full overflow-hidden shrink-0">
             {/* Logo Placeholder - bisa diganti img logo desa nanti */}
             <ShieldCheck className="w-12 h-12 text-black" />
          </div>
          <div className="flex-1 text-center px-4">
            <h1 className="text-2xl font-black uppercase tracking-widest leading-tight">
              Pemerintah Kabupaten/Kota {regencyName}
            </h1>
            <h2 className="text-xl font-bold uppercase tracking-wider leading-tight">
              Kecamatan {districtName}
            </h2>
            <h3 className="text-lg font-bold uppercase tracking-wider leading-tight">
              {villageName}
            </h3>
            <p className="text-sm font-medium mt-1">
              {tenantName}
            </p>
          </div>
        </div>

        {/* JUDUL SURAT */}
        <div className="text-center mb-10">
          <h2 className="text-xl font-black uppercase underline decoration-2 underline-offset-4 tracking-wider">
            {letter.template?.name || 'Surat Pengantar'}
          </h2>
          <p className="text-sm mt-1">Nomor: {letter.letterNumber || '........................................'}</p>
        </div>

        {/* ISI SURAT */}
        <div className="space-y-6 text-justify text-[12pt] leading-relaxed">
          <p>
            Yang bertanda tangan di bawah ini Pengurus {tenantName}, {villageName}, Kecamatan {districtName}, Kabupaten {regencyName}, menerangkan dengan sebenarnya bahwa:
          </p>

          <table className="w-full ml-8">
            <tbody>
              <tr>
                <td className="w-48 py-1">Nama Lengkap</td>
                <td className="w-4 py-1">:</td>
                <td className="font-bold py-1">{letter.citizen?.name}</td>
              </tr>
              <tr>
                <td className="py-1">NIK</td>
                <td className="py-1">:</td>
                <td className="py-1">{letter.citizen?.nik}</td>
              </tr>
              <tr>
                <td className="py-1">Tempat, Tgl Lahir</td>
                <td className="py-1">:</td>
                <td className="py-1">{letter.citizen?.birthPlace}, {new Date(letter.citizen?.birthDate).toLocaleDateString('id-ID')}</td>
              </tr>
              <tr>
                <td className="py-1">Jenis Kelamin</td>
                <td className="py-1">:</td>
                <td className="py-1">{letter.citizen?.gender === 'LAKI_LAKI' ? 'Laki-Laki' : 'Perempuan'}</td>
              </tr>
              <tr>
                <td className="py-1">Pekerjaan</td>
                <td className="py-1">:</td>
                <td className="py-1">{letter.citizen?.occupation}</td>
              </tr>
              <tr>
                <td className="py-1">Agama</td>
                <td className="py-1">:</td>
                <td className="py-1">{letter.citizen?.religion}</td>
              </tr>
              <tr>
                <td className="py-1">Alamat</td>
                <td className="py-1">:</td>
                <td className="py-1">RT {letter.citizen?.rt} / RW {letter.citizen?.rw}, {villageName}</td>
              </tr>
            </tbody>
          </table>

          <p className="whitespace-pre-wrap">
            {(() => {
              const content = letter.template?.content;
              const isDefault = !content || content === '<p>Template standar</p>' || content.trim() === '';
              
              if (!isDefault) {
                if (content.includes('[Keperluan]')) {
                  const parts = content.split('[Keperluan]');
                  return (
                    <>
                      {parts[0]}
                      <strong>{letter.notes || 'Administrasi / Sesuai Keperluan'}</strong>
                      {parts[1]}
                    </>
                  );
                }
                return content;
              }
              
              return (
                <>
                  Orang tersebut di atas benar-benar warga kami yang berdomisili di alamat tersebut. 
                  Surat keterangan ini dibuat sebagai syarat untuk keperluan: <strong>{letter.notes || 'Administrasi / Sesuai Keperluan'}</strong>.
                </>
              );
            })()}
          </p>

          <p>
            Demikian surat keterangan ini kami buat dengan sebenarnya agar dapat dipergunakan sebagaimana mestinya.
          </p>
        </div>

        {/* BAGIAN TANDA TANGAN */}
        <div className="mt-20 flex justify-end">
          <div className="text-center w-64">
            <p className="text-[12pt] mb-2">{villageName}, {today}</p>
            <p className="text-[12pt] font-bold">Ketua RT / Pengurus</p>
            <div className="h-24"></div> {/* Space for signature */}
            <p className="text-[12pt] font-bold underline decoration-1 underline-offset-4 uppercase">
              {profile?.name || '..............................'}
            </p>
          </div>
        </div>

      </div>

      {/* Style for printing specifically */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body {
            background-color: white !important;
            margin: 0;
            padding: 0;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      `}} />
    </div>
  );
}
