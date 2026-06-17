import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/authStore';
import Swal from 'sweetalert2';

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'INCOME' | 'EXPENSE';
  transaction?: any;
  onSuccess: () => void;
}

export function TransactionFormModal({ isOpen, onClose, type, transaction, onSuccess }: TransactionFormModalProps) {
  const [loading, setLoading] = useState(false);
  const token = useAuthStore(state => state.accessToken);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        category: transaction.category,
        amount: transaction.amount.toString(),
        description: transaction.description || '',
        date: new Date(transaction.date).toISOString().split('T')[0]
      });
    } else {
      setFormData({
        category: '',
        amount: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
  }, [transaction, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (transaction) {
        await apiClient.patch(`/finance/transactions/${transaction.id}`, {
          ...formData,
          amount: parseFloat(formData.amount),
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await apiClient.post('/finance/transactions', {
          ...formData,
          type,
          amount: parseFloat(formData.amount),
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      onSuccess();
      onClose();
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: `Data ${type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'} berhasil disimpan.`,
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: error?.response?.data?.message || 'Terjadi kesalahan sistem'
      });
    } finally {
      setLoading(false);
    }
  };

  const categories = type === 'INCOME' 
    ? ['Iuran Warga', 'Sumbangan', 'Subsidi Desa', 'Lainnya']
    : ['Operasional RT', 'Kegiatan Sosial', 'Keamanan', 'Kebersihan', 'Perbaikan Fasilitas', 'Lainnya'];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl p-6 border-none shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-slate-800">
            {transaction ? 'Edit' : 'Tambah'} {type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'}
          </DialogTitle>
          <DialogDescription className="text-sm font-medium text-slate-500">
            Pastikan nominal dan kategori sudah sesuai dengan bukti transaksi.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Tanggal</label>
            <input 
              type="date" 
              required
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Kategori</label>
            <select 
              required
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="" disabled>Pilih Kategori</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Nominal (Rp)</label>
            <input 
              type="number" 
              required
              min="1000"
              placeholder="Contoh: 50000"
              value={formData.amount}
              onChange={e => setFormData({...formData, amount: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700">Keterangan Tambahan</label>
            <textarea 
              placeholder="Tulis rincian atau keterangan singkat..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 h-24 resize-none"
            />
          </div>

          <DialogFooter className="pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-full transition-colors w-full sm:w-auto"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className={`px-5 py-2.5 text-sm font-bold text-white rounded-full transition-all w-full sm:w-auto shadow-sm ${
                type === 'INCOME' 
                  ? 'bg-gradient-violet hover:opacity-90 shadow-violet-soft' 
                  : 'bg-rose-500 hover:bg-rose-600'
              } disabled:opacity-50`}
            >
              {loading ? 'Menyimpan...' : 'Simpan Data'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
