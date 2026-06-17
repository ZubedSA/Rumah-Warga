'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useGetCitizen } from '@/features/citizens/api/use-citizens';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EditCitizenForm } from '@/features/citizens/components/edit-citizen-form';

export default function CitizenDetailPage() {
  const params = useParams();
  const citizenId = params.id as string;
  const { data: citizen, isLoading } = useGetCitizen(citizenId);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (isLoading) {
    return <div className="p-6">Memuat data warga...</div>;
  }

  if (!citizen) {
    return <div className="p-6">Data warga tidak ditemukan.</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/dashboard/citizens" className="text-sm text-muted-foreground hover:underline mb-2 block">
          &larr; Kembali ke Data Warga
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">{citizen.name}</h1>
          <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>Edit Warga</Button>
        </div>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-[2rem] p-8 border-none shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-black text-slate-800 tracking-tight">Edit Data Warga</DialogTitle>
          </DialogHeader>
          <EditCitizenForm citizen={citizen} onSuccess={() => setIsEditModalOpen(false)} />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-6 bg-white shadow-sm space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">Informasi Pribadi</h2>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <span className="text-muted-foreground">NIK</span>
            <span className="col-span-2 font-medium">{citizen.nik}</span>
            
            <span className="text-muted-foreground">Tempat, Tgl Lahir</span>
            <span className="col-span-2 font-medium">{citizen.birthPlace}, {new Date(citizen.birthDate).toLocaleDateString('id-ID')}</span>
            
            <span className="text-muted-foreground">Jenis Kelamin</span>
            <span className="col-span-2 font-medium">{citizen.gender === 'LAKI_LAKI' ? 'Laki-Laki' : 'Perempuan'}</span>
            
            <span className="text-muted-foreground">Agama</span>
            <span className="col-span-2 font-medium">{citizen.religion}</span>
            
            <span className="text-muted-foreground">Pekerjaan</span>
            <span className="col-span-2 font-medium">{citizen.occupation}</span>
            
            <span className="text-muted-foreground">Status Perkawinan</span>
            <span className="col-span-2 font-medium">{citizen.maritalStatus.replace('_', ' ')}</span>
            
            <span className="text-muted-foreground">No. WhatsApp</span>
            <span className="col-span-2 font-medium">{citizen.phone || <span className="text-slate-400 italic">Tidak ada</span>}</span>
          </div>
        </div>

        <div className="border rounded-lg p-6 bg-white shadow-sm space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">Informasi Domisili</h2>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <span className="text-muted-foreground">RT / RW</span>
            <span className="col-span-2 font-medium">{citizen.rt} / {citizen.rw}</span>
            
            <span className="text-muted-foreground">Status Keluarga</span>
            <span className="col-span-2 font-medium">
              {citizen.isHeadOfFamily ? <Badge>Kepala Keluarga</Badge> : 'Anggota Keluarga'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
