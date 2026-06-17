'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGetLetter } from '@/features/letters/api/use-letters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer, FileText } from 'lucide-react';

export default function PortalLetterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const letterId = params.id as string;
  
  const { data: letter, isLoading } = useGetLetter(letterId);

  if (isLoading) {
    return (
      <div className="p-10 flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-100 border-t-primary rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-slate-400 tracking-widest uppercase animate-pulse">Memuat Detail Surat...</p>
        </div>
      </div>
    );
  }

  if (!letter) {
    return (
      <div className="p-10 text-center">
        <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <FileText className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-slate-700">Surat tidak ditemukan</h2>
        <Button onClick={() => router.push('/portal/letters')} variant="outline" className="mt-6 rounded-full">
          Kembali ke Surat Saya
        </Button>
      </div>
    );
  }

  const handlePrint = () => {
    window.open(`/print/letter/${letterId}`, '_blank');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none px-4 py-1.5 rounded-xl">Menunggu Verifikasi RT</Badge>;
      case 'APPROVED':
        return <Badge variant="default" className="bg-emerald-100 text-emerald-700 border-none px-4 py-1.5 rounded-xl shadow-none">Diproses</Badge>;
      case 'READY_FOR_PICKUP':
        return <Badge variant="default" className="bg-blue-100 text-blue-700 border-none px-4 py-1.5 rounded-xl shadow-none">Siap Diambil di RT</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive" className="bg-rose-100 text-rose-700 border-none px-4 py-1.5 rounded-xl shadow-none">Ditolak</Badge>;
      case 'COMPLETED':
        return <Badge variant="default" className="bg-slate-100 text-slate-700 border-none px-4 py-1.5 rounded-xl shadow-none">Selesai</Badge>;
      default:
        return <Badge variant="outline" className="px-4 py-1.5 rounded-xl">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-10">
      <div className="flex items-center justify-between bg-white p-4 rounded-[2rem] shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-slate-100">
        <Link 
          href="/portal/letters" 
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors px-4 py-2 rounded-xl hover:bg-slate-50"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
        <div className="pr-4">{getStatusBadge(letter.status)}</div>
      </div>

      <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-slate-100">
        <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">Detail Surat Anda</h3>
        
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white text-primary flex items-center justify-center shadow-sm shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-slate-800 text-xl tracking-tight mb-1">{letter.template?.name}</h4>
              <p className="text-sm font-bold text-slate-500 mb-4">
                Diajukan pada: {new Date(letter.createdAt).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              
              {letter.notes && (
                <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block mb-1">Catatan Anda</span>
                  <p className="text-sm font-medium text-amber-900">{letter.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-50">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Status Pengajuan</span>
            <p className="font-medium text-slate-700 text-sm">
              {letter.status === 'PENDING' ? 'Pengajuan Anda sedang menunggu ditinjau oleh Pengurus RT.' :
               letter.status === 'APPROVED' ? 'Pengajuan Anda telah disetujui dan sedang diproses.' :
               letter.status === 'READY_FOR_PICKUP' ? 'Surat Anda sudah selesai diproses dan siap diambil.' :
               letter.status === 'COMPLETED' ? 'Surat Anda telah diserahkan / selesai.' :
               'Pengajuan Anda ditolak oleh Pengurus RT.'}
            </p>
          </div>
        </div>

        {(letter.status === 'APPROVED' || letter.status === 'READY_FOR_PICKUP' || letter.status === 'COMPLETED') && (
          <div className="mt-8">
            <Button 
              onClick={handlePrint}
              className="bg-slate-800 hover:bg-slate-900 text-white rounded-full px-6 shadow-sm w-full sm:w-auto h-12 font-bold"
            >
              <Printer className="w-5 h-5 mr-2" /> Cetak Salinan PDF
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
