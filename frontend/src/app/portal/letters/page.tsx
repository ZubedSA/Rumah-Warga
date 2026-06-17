'use client';

import React from 'react';
import { useGetLetters } from '@/features/letters/api/use-letters';
import { columns } from '@/features/letters/components/columns';
import { MobileLetterCards } from '@/features/letters/components/mobile-letter-cards';
import { DataTable } from '@/components/ui/data-table';
import { AddLetterForm } from '@/features/letters/components/add-letter-form';
import { FileText, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function PortalLettersPage() {
  const { data: letters, isLoading } = useGetLetters();
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-6 rounded-3xl shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-[1.2rem] bg-accent flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">Surat Saya</h1>
            <p className="text-xs text-slate-500 font-medium mt-1 max-w-[200px]">Riwayat dan pengajuan surat Anda.</p>
          </div>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger render={<Button className="bg-gradient-violet hover:opacity-90 text-white rounded-full px-6 h-12 font-bold shadow-violet-soft w-full md:w-auto transition-opacity" />}>
            <Plus className="w-5 h-5 mr-2" />
            Ajukan Surat
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-[2.5rem] p-6 md:p-8 border-0 shadow-2xl">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-black text-slate-800 flex items-center gap-2">
                <FileText className="w-6 h-6 text-primary" />
                Ajukan Surat Baru
              </DialogTitle>
            </DialogHeader>
            <AddLetterForm onSuccess={() => setIsAddModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-slate-100">
        <h2 className="text-sm font-bold text-slate-800 tracking-widest uppercase mb-4 px-2">Riwayat Pengajuan</h2>
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-indigo-100 border-t-primary rounded-full animate-spin"></div>
              <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase animate-pulse">Memuat Data...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden">
            <div className="hidden md:block">
              <DataTable columns={columns} data={letters || []} />
            </div>
            <div className="block md:hidden">
              <MobileLetterCards letters={letters || []} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
