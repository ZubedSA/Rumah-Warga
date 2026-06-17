'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGetLetter, useUpdateLetterStatus } from '@/features/letters/api/use-letters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, Printer, X, User, FileText, CheckCircle2, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function LetterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const letterId = params.id as string;
  
  const { data: letter, isLoading } = useGetLetter(letterId);
  const { mutate: updateStatus, isPending } = useUpdateLetterStatus();

  const [isWADialogOpen, setIsWADialogOpen] = React.useState(false);
  const [waMessage, setWaMessage] = React.useState('');

  const handleOpenWADialog = () => {
    const defaultMsg = `Halo ${letter?.citizen?.name}, saya dari Pengurus RT/RW ingin menanyakan beberapa detail tambahan terkait pengajuan ${letter?.template?.name} Anda. 

Khususnya mengenai: `;
    setWaMessage(defaultMsg);
    setIsWADialogOpen(true);
  };

  const handleSendWA = () => {
    const phone = letter?.citizen?.phone;
    if (!phone) {
      toast.error('Nomor HP warga tidak tersedia.');
      return;
    }
    
    let formattedPhone = phone.replace(/\D/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '62' + formattedPhone.substring(1);
    }
    
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(waMessage)}`, '_blank');
    setIsWADialogOpen(false);
  };

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
        <Button onClick={() => router.push('/dashboard/letters')} variant="outline" className="mt-6 rounded-full">
          Kembali ke Persuratan
        </Button>
      </div>
    );
  }

  const handleUpdateStatus = (status: string) => {
    updateStatus(
      { id: letterId, status },
      {
        onSuccess: () => toast.success(`Status surat diperbarui menjadi ${status}`),
        onError: (err: any) => toast.error(`Gagal: ${err.response?.data?.message || err.message}`)
      }
    );
  };

  const handlePrint = () => {
    // Navigasi ke halaman cetak di tab baru
    window.open(`/print/letter/${letterId}`, '_blank');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none px-4 py-1.5 rounded-xl">Menunggu Verifikasi</Badge>;
      case 'APPROVED':
        return <Badge variant="default" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none px-4 py-1.5 rounded-xl shadow-none">Diproses</Badge>;
      case 'READY_FOR_PICKUP':
        return <Badge variant="default" className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none px-4 py-1.5 rounded-xl shadow-none">Siap Diambil</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive" className="bg-rose-100 text-rose-700 hover:bg-rose-200 border-none px-4 py-1.5 rounded-xl shadow-none">Ditolak</Badge>;
      case 'COMPLETED':
        return <Badge variant="default" className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none px-4 py-1.5 rounded-xl shadow-none">Selesai</Badge>;
      default:
        return <Badge variant="outline" className="px-4 py-1.5 rounded-xl">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex items-center justify-between bg-white p-4 rounded-[2rem] shadow-sm">
        <Link 
          href="/dashboard/letters" 
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors px-4 py-2 rounded-xl hover:bg-slate-50"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
        <div className="pr-4">{getStatusBadge(letter.status)}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Detail Pemohon (Kiri) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2rem] p-6 shadow-sm">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">Informasi Pemohon</h3>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-accent text-primary font-black text-xl flex items-center justify-center">
                {letter.citizen?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h4 className="font-black text-slate-800 text-lg tracking-tight">{letter.citizen?.name}</h4>
                <p className="text-sm font-bold text-slate-400">NIK: {letter.citizen?.nik}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Tempat/Tgl Lahir</span>
                <p className="font-medium text-slate-700 text-sm">{letter.citizen?.birthPlace}, {new Date(letter.citizen?.birthDate).toLocaleDateString('id-ID')}</p>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Alamat (RT/RW)</span>
                <p className="font-medium text-slate-700 text-sm">RT {letter.citizen?.rt} / RW {letter.citizen?.rw}</p>
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Pekerjaan</span>
                <p className="font-medium text-slate-700 text-sm">{letter.citizen?.occupation}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Surat (Kanan) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2rem] p-6 shadow-sm">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-6">Detail Surat</h3>
            
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
                      <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block mb-1">Catatan Pemohon</span>
                      <p className="text-sm font-medium text-amber-900">{letter.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Aksi Pengurus */}
            <div className="border-t border-slate-50 pt-6">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Aksi Dokumen</h3>
              
              <div className="flex flex-wrap gap-3">
                {letter.status === 'PENDING' && (
                  <>
                    <div className="flex gap-3 w-full">
                      <Button 
                        onClick={() => handleUpdateStatus('APPROVED')}
                        disabled={isPending}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-6 shadow-sm"
                      >
                        <Check className="w-4 h-4 mr-2" /> Setujui Surat
                      </Button>
                      <Button 
                        onClick={() => handleUpdateStatus('REJECTED')}
                        disabled={isPending}
                        variant="outline"
                        className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 border-rose-200 rounded-full px-6"
                      >
                        <X className="w-4 h-4 mr-2" /> Tolak
                      </Button>
                    </div>

                    <div className="w-full mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
                      <span className="text-xs font-bold text-slate-400">Butuh Informasi Tambahan?</span>
                      <div>
                        <Button 
                          onClick={handleOpenWADialog}
                          className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-full px-6 font-bold border border-emerald-200/50 shadow-sm"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" /> Tanya Detail via WhatsApp
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                {letter.status === 'APPROVED' && (
                  <Button 
                    onClick={() => handleUpdateStatus('READY_FOR_PICKUP')}
                    disabled={isPending}
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Tandai Siap Diambil
                  </Button>
                )}

                {letter.status === 'READY_FOR_PICKUP' && (
                  <Button 
                    onClick={() => handleUpdateStatus('COMPLETED')}
                    disabled={isPending}
                    className="bg-slate-800 hover:bg-slate-900 text-white rounded-full px-6 shadow-sm"
                  >
                    <Check className="w-4 h-4 mr-2" /> Tandai Selesai (Diserahkan)
                  </Button>
                )}

                {/* Tombol Cetak selalu ada jika bukan ditolak, tapi idealnya dicetak setelah disetujui */}
                {(letter.status === 'APPROVED' || letter.status === 'READY_FOR_PICKUP' || letter.status === 'COMPLETED') && (
                  <Button 
                    onClick={handlePrint}
                    className="bg-slate-800 hover:bg-slate-900 text-white rounded-full px-6 shadow-sm"
                  >
                    <Printer className="w-4 h-4 mr-2" /> Cetak PDF / A4
                  </Button>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Dialog Tanya WA */}
      <Dialog open={isWADialogOpen} onOpenChange={setIsWADialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-0 overflow-hidden border-0 bg-white">
          <div className="p-6 md:p-8 space-y-6">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-black text-slate-800 flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-emerald-500" />
                Tanya Detail via WhatsApp
              </DialogTitle>
              <DialogDescription className="text-slate-500 font-medium">
                Tulis pertanyaan konfirmasi untuk dikirimkan ke WhatsApp warga.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="wa-message" className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pesan WhatsApp</Label>
                <Textarea 
                  id="wa-message" 
                  className="min-h-[150px] rounded-xl bg-slate-50 border-transparent hover:border-slate-200 focus:bg-white transition-colors p-4 font-medium text-slate-700 resize-none leading-relaxed"
                  value={waMessage}
                  onChange={(e) => setWaMessage(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="p-6 md:p-8 pt-0 bg-slate-50/50 flex flex-col md:flex-row gap-3">
            <Button type="button" variant="outline" onClick={() => setIsWADialogOpen(false)} className="rounded-full w-full md:w-auto font-bold border-slate-200 hover:bg-slate-100">
              Batal
            </Button>
            <Button onClick={handleSendWA} className="rounded-full w-full md:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-sm">
              Kirim ke WhatsApp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
