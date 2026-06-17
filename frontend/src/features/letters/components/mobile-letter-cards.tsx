import React from 'react';
import Link from 'next/link';
import { ChevronRight, MessageCircle } from 'lucide-react';
import { Letter, handleSendWA } from './columns';
import { useAuthStore } from '@/store/authStore';

export function MobileLetterCards({ letters }: { letters: Letter[] }) {
  const role = useAuthStore(state => state.user?.role);
  if (!letters || letters.length === 0) {
    return (
      <div className="py-12 text-center text-slate-500 text-sm font-medium bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
        Belum ada data surat menyurat
      </div>
    );
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-slate-100 text-slate-600';
      case 'APPROVED':
        return 'bg-green-100 text-green-700';
      case 'READY_FOR_PICKUP':
        return 'bg-blue-100 text-blue-700';
      case 'REJECTED':
        return 'bg-rose-100 text-rose-700';
      case 'COMPLETED':
        return 'bg-slate-100 text-slate-700';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Menunggu';
      case 'APPROVED': return 'Diproses';
      case 'READY_FOR_PICKUP': return 'Siap Diambil';
      case 'REJECTED': return 'Ditolak';
      case 'COMPLETED': return 'Selesai';
      default: return status;
    }
  };

  return (
    <div className="space-y-4">
      {letters.map((letter) => {
        // Mendapatkan inisial pemohon
        const initials = letter.citizen?.name
          ? letter.citizen.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
          : 'U';

        return (
          <div 
            key={letter.id} 
            className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm relative overflow-hidden group"
          >
            {/* Aksen warna di kiri */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary/20 group-hover:bg-primary transition-colors"></div>
            
            <div className="flex gap-4 items-start">
              {/* Avatar / Initial */}
              <div className="w-12 h-12 shrink-0 bg-accent text-primary font-black rounded-xl flex items-center justify-center text-lg shadow-sm border border-slate-100">
                {initials}
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-black text-slate-800 tracking-tight truncate pr-4">
                  {letter.citizen?.name || 'Tidak diketahui'}
                </h3>
                <p className="text-xs font-bold text-slate-400 mt-0.5 truncate">
                  {letter.template?.name || 'Jenis Surat'}
                </p>
                
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-50 text-slate-500 uppercase tracking-wider border border-slate-100">
                    {new Date(letter.createdAt).toLocaleDateString('id-ID')}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(letter.status)}`}>
                    {getStatusText(letter.status)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Footer / Action */}
            <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[150px]">
                {letter.letterNumber || 'Menunggu Nomor'}
              </span>
              <div className="flex items-center gap-3">
                {role !== 'WARGA' && letter.status === 'READY_FOR_PICKUP' && (
                  <button 
                    onClick={() => handleSendWA(letter)}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-500 hover:text-emerald-600 transition-colors shrink-0"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Kirim WA
                  </button>
                )}
                <Link 
                  href={role === 'WARGA' ? `/portal/letters/${letter.id}` : `/dashboard/letters/${letter.id}`}
                  className="flex items-center text-xs font-bold text-primary hover:text-primary/80 transition-colors shrink-0"
                >
                  Rincian <ChevronRight className="w-3 h-3 ml-0.5" />
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
