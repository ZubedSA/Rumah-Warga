'use client';

import React, { useState, useMemo } from 'react';
import { useGetCitizens } from '@/features/citizens/api/use-citizens';
import { columns } from '@/features/citizens/components/columns';
import { MobileCitizenCards } from '@/features/citizens/components/mobile-citizen-cards';
import { DataTable } from '@/components/ui/data-table';
import { AddCitizenForm } from '@/features/citizens/components/add-citizen-form';
import { Users, Plus, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export default function CitizensPage() {
  const { data: citizens, isLoading } = useGetCitizens();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCitizens = useMemo(() => {
    if (!citizens) return [];
    if (!searchQuery) return citizens;
    const lowerQuery = searchQuery.toLowerCase();
    return citizens.filter((citizen) => 
      citizen.name.toLowerCase().includes(lowerQuery) || 
      citizen.nik.toLowerCase().includes(lowerQuery)
    );
  }, [citizens, searchQuery]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 shrink-0 bg-accent rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
            <Users className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Data Warga</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Kelola informasi demografis dan status administrasi warga.</p>
          </div>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger className="flex items-center justify-center gap-2 bg-gradient-violet text-white px-6 py-3 rounded-full text-sm font-bold hover:opacity-90 shadow-violet-soft transition-opacity w-full sm:w-auto">
            <Plus className="w-5 h-5" /> Tambah Warga
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-[2rem] p-8 border-none shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-black text-slate-800 tracking-tight">Tambah Data Warga</DialogTitle>
            </DialogHeader>
            <AddCitizenForm onSuccess={() => setIsModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm">
        <div className="mb-6 flex items-center bg-slate-50/50 p-1.5 rounded-2xl border border-slate-100 max-w-md">
          <div className="pl-3 pr-2 text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <Input 
            placeholder="Cari nama atau NIK..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 shadow-none text-slate-700 placeholder:text-slate-400"
          />
        </div>
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-4 border-indigo-100 border-t-primary rounded-full animate-spin"></div>
              <p className="text-sm font-bold text-slate-400 tracking-widest uppercase animate-pulse">Memuat Data...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden">
            <div className="hidden md:block">
              <DataTable columns={columns} data={filteredCitizens} />
            </div>
            <div className="block md:hidden">
              <MobileCitizenCards citizens={filteredCitizens} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
