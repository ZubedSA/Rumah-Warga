'use client';

import React from 'react';
import { MessageCircle, Save, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function WhatsAppSettingsPage() {
  const [template, setTemplate] = React.useState('');

  React.useEffect(() => {
    const saved = localStorage.getItem('whatsapp_confirmation_template');
    if (saved) {
      setTemplate(saved);
    } else {
      setTemplate('Halo {{nama_warga}}, pengajuan surat {{jenis_surat}} Anda sudah *Selesai* dan Siap Diambil di balai RW/RT.\n\nMohon membawa KTP saat pengambilan. Terima kasih.');
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('whatsapp_confirmation_template', template);
    toast.success('Template pesan WhatsApp berhasil disimpan!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-3xl shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-slate-100 max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
            <MessageCircle className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800">Konfirmasi WhatsApp</h2>
            <p className="text-sm font-medium text-slate-500">
              Atur template pesan untuk konfirmasi surat yang sudah siap diambil.
            </p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700">Template Pesan Konfirmasi Surat Selesai</Label>
            <Textarea 
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="min-h-[200px] resize-none rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm"
              placeholder="Ketikkan template pesan di sini..."
            />
          </div>

          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-bold mb-1">Gunakan kode berikut untuk mengisi data otomatis:</p>
              <ul className="list-disc pl-4 space-y-1 font-medium opacity-80">
                <li><code>{`{{nama_warga}}`}</code> - Akan diganti dengan nama pemohon</li>
                <li><code>{`{{jenis_surat}}`}</code> - Akan diganti dengan jenis surat pengantar</li>
                <li><code>{`{{nomor_surat}}`}</code> - Akan diganti dengan nomor surat (jika ada)</li>
              </ul>
            </div>
          </div>
          
          <Button onClick={handleSave} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-8 shadow-sm font-bold">
            <Save className="w-4 h-4 mr-2" /> Simpan Pengaturan WA
          </Button>
        </div>
      </div>
    </div>
  );
}
