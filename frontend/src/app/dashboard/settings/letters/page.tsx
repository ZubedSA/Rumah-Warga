'use client';

import React, { useState } from 'react';
import { useGetLetterTemplates, useCreateLetterTemplate, useUpdateLetterTemplate, useDeleteLetterTemplate } from '@/features/letters/api/use-letter-templates';
import { FileText, Plus, Edit2, Trash2, Loader2, CheckCircle2, Eye, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function LettersSettingsPage() {
  const { data: templates, isLoading } = useGetLetterTemplates();
  const createMutation = useCreateLetterTemplate();
  const updateMutation = useUpdateLetterTemplate();
  const deleteMutation = useDeleteLetterTemplate();

  const [isOpen, setIsOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', content: '', isActive: true });
  const [previewData, setPreviewData] = useState({ name: '', content: '' });

  const handleOpenNew = () => {
    setEditingId(null);
    setFormData({ 
      name: '', 
      content: 'Orang tersebut di atas benar-benar warga kami yang berdomisili di alamat tersebut. Surat keterangan ini dibuat sebagai syarat untuk keperluan: [Keperluan].', 
      isActive: true 
    });
    setIsOpen(true);
  };

  const handleOpenEdit = (template: any) => {
    setEditingId(template.id);
    setFormData({ name: template.name, content: template.content, isActive: template.isActive });
    setIsOpen(true);
  };

  const handleOpenPreview = (template: any) => {
    setPreviewData({ name: template.name, content: template.content });
    setIsPreviewOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Yakin ingin menghapus template ini?')) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success('Template berhasil dihapus'),
        onError: () => toast.error('Gagal menghapus template')
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.content) {
      toast.error('Nama dan isi template wajib diisi');
      return;
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...formData }, {
        onSuccess: () => {
          toast.success('Template berhasil diperbarui');
          setIsOpen(false);
        },
        onError: () => toast.error('Gagal memperbarui template')
      });
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          toast.success('Template berhasil ditambahkan');
          setIsOpen(false);
        },
        onError: () => toast.error('Gagal menambahkan template')
      });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="bg-slate-900 p-8 rounded-3xl shadow-[0_4px_24px_rgb(0,0,0,0.1)] border border-slate-800 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gradient-to-br from-primary/30 to-violet-500/0 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 text-center md:text-left max-w-lg">
          <h2 className="text-xl font-black mb-2 flex items-center justify-center md:justify-start gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Manajemen Kerangka Surat
          </h2>
          <p className="text-sm font-medium text-slate-400">
            Buat format kerangka khusus untuk berbagai jenis surat. Hanya bagian teks paragraf isi surat yang perlu Anda tulis, karena sistem akan secara otomatis membuatkan Kop Surat dan Tanda Tangan saat dicetak.
          </p>
        </div>
        <div className="relative z-10 shrink-0">
          <Button onClick={handleOpenNew} className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 shadow-sm h-12 text-sm font-bold w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" /> Tambah Surat Baru
          </Button>
        </div>
      </div>

      {/* List Templates */}
      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      ) : templates && templates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((tpl) => (
            <div key={tpl.id} className={`bg-white border rounded-2xl p-5 shadow-sm transition-all duration-300 relative group overflow-hidden ${tpl.isActive ? 'border-slate-200 hover:border-primary/50 hover:shadow-md' : 'border-slate-100 opacity-60'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tpl.isActive ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'}`}>
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg" onClick={() => handleOpenPreview(tpl)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg" onClick={() => handleOpenEdit(tpl)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg" onClick={() => handleDelete(tpl.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <h3 className="text-base font-black text-slate-800 tracking-tight mb-1 truncate pr-2">{tpl.name}</h3>
              <div className="flex items-center gap-2 mt-3">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${tpl.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                  {tpl.isActive ? 'Aktif' : 'Nonaktif'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-10 rounded-3xl border border-slate-100 border-dashed text-center">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-700 mb-1">Belum Ada Kerangka Surat</h3>
          <p className="text-sm font-medium text-slate-500 max-w-sm mx-auto">
            Anda belum membuat format surat apapun. Klik tombol tambah di atas untuk memulai.
          </p>
        </div>
      )}

      {/* Dialog Form */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-[2rem] p-0 overflow-hidden border-0">
          <form onSubmit={handleSubmit}>
            <div className="p-6 md:p-8 space-y-6">
              <DialogHeader className="mb-4">
                <DialogTitle className="text-2xl font-black text-slate-800 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-primary" />
                  {editingId ? 'Edit Kerangka Surat' : 'Surat Baru'}
                </DialogTitle>
                <DialogDescription className="text-slate-500 font-medium">
                  Atur nama dan paragraf isi surat di bawah ini.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nama Jenis Surat</Label>
                  <Input 
                    id="name" 
                    placeholder="Contoh: Surat Izin Keramaian" 
                    className="h-12 rounded-xl bg-slate-50 border-transparent hover:border-slate-200 focus:bg-white transition-colors px-4 font-bold text-slate-800"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content" className="text-xs font-bold text-slate-400 uppercase tracking-widest">Isi Paragraf Surat</Label>
                  <Textarea 
                    id="content" 
                    placeholder="Tulis paragraf isi surat di sini..." 
                    className="min-h-[150px] rounded-xl bg-slate-50 border-transparent hover:border-slate-200 focus:bg-white transition-colors p-4 font-medium text-slate-700 resize-none leading-relaxed"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                  />
                  <p className="text-[11px] text-slate-400 font-medium mt-1">Gunakan bahasa baku. Tidak perlu menambahkan kata penutup atau tanda tangan.</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl mt-2 border border-slate-100">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-bold text-slate-800">Status Publikasi</Label>
                    <p className="text-xs font-medium text-slate-500">Warga dapat melihat dan mengajukan surat ini.</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={formData.isActive}
                    onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${formData.isActive ? 'bg-primary' : 'bg-slate-200'}`}
                  >
                    <span className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${formData.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            </div>
            
            <DialogFooter className="p-6 md:p-8 pt-0 bg-slate-50/50 flex flex-col md:flex-row gap-3">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="rounded-full w-full md:w-auto font-bold border-slate-200 hover:bg-slate-100">
                Batal
              </Button>
              <Button type="submit" disabled={isSaving} className="rounded-full w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-bold shadow-sm">
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                {editingId ? 'Simpan Perubahan' : 'Buat Surat'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[700px] rounded-[2rem] p-0 overflow-hidden border-0 bg-slate-100">
          <div className="p-6 md:p-8 space-y-6">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-2xl font-black text-slate-800 flex items-center gap-2">
                <Eye className="w-6 h-6 text-indigo-500" />
                Pratinjau Kertas A4
              </DialogTitle>
              <DialogDescription className="text-slate-500 font-medium">
                Simulasi tampilan surat jika dicetak di kertas A4.
              </DialogDescription>
            </DialogHeader>

            {/* Kertas A4 Mock */}
            <div className="bg-white mx-auto shadow-sm rounded-lg p-8 max-h-[60vh] overflow-y-auto border border-slate-200">
              {/* Kop Surat Mock */}
              <div className="border-b-4 border-double border-slate-800 pb-4 mb-6 text-center">
                <h3 className="text-sm font-bold uppercase">Pemerintah Kabupaten/Kota Contoh</h3>
                <h2 className="text-lg font-black uppercase">Kecamatan Contoh, Desa Contoh</h2>
                <p className="text-xs">Jl. Contoh Alamat No. 123, RT 01/RW 02, Kode Pos 12345</p>
              </div>

              {/* Judul Surat */}
              <div className="text-center mb-8">
                <h1 className="text-xl font-black uppercase underline decoration-2 underline-offset-4">{previewData.name}</h1>
                <p className="text-sm mt-1">Nomor: 145/001/RT.01/2026</p>
              </div>

              {/* Isi Surat */}
              <div className="text-sm text-justify leading-relaxed space-y-4">
                <p>Yang bertanda tangan di bawah ini Pengurus RT 01 / RW 02, menerangkan bahwa:</p>
                <div className="pl-8 space-y-1 my-4">
                  <div className="grid grid-cols-3">
                    <span className="font-semibold">Nama Lengkap</span>
                    <span className="col-span-2">: John Doe</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-semibold">NIK</span>
                    <span className="col-span-2">: 3201234567890001</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-semibold">Tempat, Tgl Lahir</span>
                    <span className="col-span-2">: Jakarta, 01 Januari 1990</span>
                  </div>
                  <div className="grid grid-cols-3">
                    <span className="font-semibold">Alamat</span>
                    <span className="col-span-2">: Jl. Merdeka No. 1, RT 01/02</span>
                  </div>
                </div>
                
                {/* Bagian Paragraf Dinamis */}
                <div className="p-3 bg-amber-50/50 border border-amber-200/50 rounded text-slate-800 whitespace-pre-wrap">
                  {previewData.content === '<p>Template standar</p>' ? (
                    'Orang tersebut di atas benar-benar warga kami yang berdomisili di alamat tersebut. Surat keterangan ini dibuat sebagai syarat untuk keperluan: [Keperluan].'
                  ) : (
                    previewData.content || <span className="text-slate-400 italic">Paragraf kosong...</span>
                  )}
                </div>

                <p>Demikian surat keterangan ini dibuat dengan sebenarnya untuk dapat dipergunakan sebagaimana mestinya.</p>
              </div>

              {/* Tanda Tangan Mock */}
              <div className="mt-12 flex justify-end">
                <div className="text-center text-sm">
                  <p>Desa Contoh, 14 Juni 2026</p>
                  <p className="font-semibold mb-16">Pengurus RT 01 / RW 02</p>
                  <p className="font-black underline">Bapak Fulan</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button type="button" onClick={() => setIsPreviewOpen(false)} className="rounded-full px-8 bg-slate-800 hover:bg-slate-900 text-white font-bold shadow-sm">
                Tutup Pratinjau
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
