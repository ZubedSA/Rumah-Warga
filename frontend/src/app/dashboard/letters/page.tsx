'use client';

import React, { useState, useMemo } from 'react';
import { useGetLetters } from '@/features/letters/api/use-letters';
import { columns } from '@/features/letters/components/columns';
import { MobileLetterCards } from '@/features/letters/components/mobile-letter-cards';
import { DataTable } from '@/components/ui/data-table';
import { AddLetterForm } from '@/features/letters/components/add-letter-form';
import { FileText, Plus, Search, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function LettersPage() {
  const { data: letters, isLoading } = useGetLetters();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredLetters = useMemo(() => {
    if (!letters) return [];
    
    return letters.filter((letter) => {
      if (statusFilter !== 'ALL' && letter.status !== statusFilter) {
        return false;
      }
      
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        const citizenMatch = letter.citizen?.name?.toLowerCase().includes(lowerQuery);
        const templateMatch = letter.template?.name?.toLowerCase().includes(lowerQuery);
        if (!citizenMatch && !templateMatch) {
          return false;
        }
      }
      
      return true;
    });
  }, [letters, searchQuery, statusFilter]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 bg-white p-6 md:p-8 rounded-[2rem] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center">
            <FileText className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Surat Menyurat</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Kelola dan proses pengajuan surat administrasi warga.</p>
          </div>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger render={<Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 h-12 font-bold shadow-sm w-full md:w-auto" />}>
            <Plus className="w-5 h-5 mr-2" />
            Ajukan Surat Baru
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-6 md:p-8 border-0">
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

      <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm">
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 w-full flex items-center bg-slate-50/50 p-1.5 rounded-2xl border border-slate-100">
            <div className="pl-3 pr-2 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <Input 
              placeholder="Cari pemohon atau jenis surat..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 shadow-none text-slate-700 placeholder:text-slate-400"
            />
          </div>
          <div className="w-full sm:w-[200px]">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-slate-50/50 border-slate-100 rounded-2xl h-[52px]">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <SelectValue placeholder="Semua Status" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                <SelectItem value="ALL">Semua Status</SelectItem>
                <SelectItem value="PENDING">Menunggu</SelectItem>
                <SelectItem value="APPROVED">Diproses</SelectItem>
                <SelectItem value="READY_FOR_PICKUP">Siap Diambil</SelectItem>
                <SelectItem value="COMPLETED">Selesai</SelectItem>
                <SelectItem value="REJECTED">Ditolak</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
              <DataTable columns={columns} data={filteredLetters} />
            </div>
            <div className="block md:hidden">
              <MobileLetterCards letters={filteredLetters} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
