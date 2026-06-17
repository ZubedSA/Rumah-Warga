import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Citizen } from './columns';

export function MobileCitizenCards({ citizens }: { citizens: Citizen[] }) {
  if (!citizens || citizens.length === 0) {
    return (
      <div className="py-12 text-center text-slate-500 text-sm font-medium bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
        Belum ada data warga
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {citizens.map((citizen, index) => {
        // Mendapatkan inisial nama
        const initials = citizen.name
          .split(' ')
          .map((n) => n[0])
          .slice(0, 2)
          .join('')
          .toUpperCase();

        return (
          <div 
            key={citizen.id} 
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
                  {citizen.name}
                </h3>
                <p className="text-xs font-bold text-slate-400 mt-0.5">
                  NIK: <span className="text-slate-500 font-medium">{citizen.nik}</span>
                </p>
                
                {/* Badges / RT RW */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wider">
                    {citizen.gender === 'LAKI_LAKI' ? 'LAKI-LAKI' : 'PEREMPUAN'}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-600 uppercase tracking-wider">
                    RT {citizen.rt} / RW {citizen.rw}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Footer / Action */}
            <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Data Aktif
              </span>
              <Link 
                href={`/dashboard/citizens/${citizen.id}`}
                className="flex items-center text-xs font-bold text-primary hover:text-primary/80 transition-colors"
              >
                Rincian <ChevronRight className="w-3 h-3 ml-0.5" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
