'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Settings } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

export default function SuperadminTenants() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingSubscription, setIsUpdatingSubscription] = useState(false);
  
  // Subscription Update State
  const [editingTenant, setEditingTenant] = useState<any>(null);
  const [editPlanName, setEditPlanName] = useState('FREE');
  const [editAddMonths, setEditAddMonths] = useState('0');
  
  // Form State
  const [name, setName] = useState('');
  const [type, setType] = useState('RT');
  const [planName, setPlanName] = useState('FREE');
  const [durationMonths, setDurationMonths] = useState('1');

  const accessToken = useAuthStore(state => state.accessToken);

  const fetchTenants = () => {
    setLoading(true);
    apiClient.get('/superadmin/tenants', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    .then(res => {
      setTenants(res as unknown as any[]);
    })
    .catch(err => console.error('Failed to fetch tenants:', err))
    .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (accessToken) {
      fetchTenants();
    }
  }, [accessToken]);

  const handleAddTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Nama wajib diisi');

    setIsSubmitting(true);
    try {
      await apiClient.post('/superadmin/tenants', {
        name,
        type,
        planName,
        durationMonths: parseInt(durationMonths)
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      toast.success('Tenant berhasil ditambahkan!');
      setIsOpen(false);
      setName('');
      fetchTenants();
    } catch (error) {
      console.error(error);
      toast.error('Gagal menambahkan tenant');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTenant) return;

    setIsUpdatingSubscription(true);
    try {
      await apiClient.patch(`/superadmin/tenants/${editingTenant.id}/subscription`, {
        planName: editPlanName,
        additionalMonths: parseInt(editAddMonths) || 0
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      toast.success('Langganan berhasil diperbarui!');
      setEditingTenant(null);
      fetchTenants();
    } catch (error) {
      console.error(error);
      toast.error('Gagal memperbarui langganan');
    } finally {
      setIsUpdatingSubscription(false);
    }
  };

  const handleDeleteTenant = async (id: string, tenantName: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus tenant ${tenantName} beserta SELURUH datanya? Tindakan ini tidak bisa dibatalkan!`)) return;

    try {
      await apiClient.delete(`/superadmin/tenants/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      toast.success('Tenant berhasil dihapus!');
      fetchTenants();
    } catch (error) {
      console.error(error);
      toast.error('Gagal menghapus tenant');
    }
  };

  const getBadgeVariant = (type: string) => {
    switch(type) {
      case 'RT': return 'default';
      case 'RW': return 'secondary';
      case 'PERUMAHAN': return 'outline';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Daftar Tenant</h1>
          <p className="text-slate-500 font-medium mt-1">Kelola semua komunitas, RT, RW, dan Perumahan yang terdaftar.</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger className="bg-gradient-violet hover:opacity-90 text-white rounded-xl shadow-violet-soft hover:shadow-lg transition-all hover:-translate-y-1 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium h-10 px-4 py-2">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Tenant
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-black text-slate-800">Tambah Tenant Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddTenant} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-bold text-slate-700">Nama Tenant</Label>
                <Input 
                  id="name" 
                  placeholder="Cth: RT 01 RW 02 Mawar" 
                  className="rounded-xl border-slate-200"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700">Tipe Tenant</Label>
                <Select value={type} onValueChange={(val) => setType(val || 'RT')}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Pilih Tipe" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="RT">RT</SelectItem>
                    <SelectItem value="RW">RW</SelectItem>
                    <SelectItem value="PERUMAHAN">Perumahan</SelectItem>
                    <SelectItem value="DESA">Desa</SelectItem>
                    <SelectItem value="KOMUNITAS">Komunitas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700">Paket Langganan</Label>
                <Select value={planName} onValueChange={(val) => setPlanName(val || 'FREE')}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Pilih Paket" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="FREE">Gratis (FREE)</SelectItem>
                    <SelectItem value="BASIC">Dasar (BASIC)</SelectItem>
                    <SelectItem value="PRO">Profesional (PRO)</SelectItem>
                    <SelectItem value="ENTERPRISE">Perusahaan (ENTERPRISE)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration" className="text-sm font-bold text-slate-700">Durasi (Bulan)</Label>
                <Input 
                  id="duration" 
                  type="number"
                  min="1"
                  className="rounded-xl border-slate-200"
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-6 font-bold mt-4" disabled={isSubmitting}>
                {isSubmitting ? 'Menyimpan...' : 'Simpan Tenant'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-[2rem] p-4 sm:p-6 shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 hover:bg-transparent">
                <TableHead className="font-bold text-slate-400 uppercase tracking-wider text-xs">Nama</TableHead>
                <TableHead className="font-bold text-slate-400 uppercase tracking-wider text-xs">Kode</TableHead>
                <TableHead className="font-bold text-slate-400 uppercase tracking-wider text-xs">Tipe</TableHead>
                <TableHead className="font-bold text-slate-400 uppercase tracking-wider text-xs">Langganan</TableHead>
                <TableHead className="font-bold text-slate-400 uppercase tracking-wider text-xs text-right">Pengguna</TableHead>
                <TableHead className="font-bold text-slate-400 uppercase tracking-wider text-xs text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-4 border-indigo-100 border-t-primary rounded-full animate-spin"></div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Memuat Data</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : tenants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center">
                    <p className="text-sm font-bold text-slate-500">Belum ada tenant yang terdaftar.</p>
                  </TableCell>
                </TableRow>
              ) : (
                tenants.map((tenant) => {
                  const subscription = tenant.subscriptions?.[0];
                  return (
                  <TableRow key={tenant.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors group cursor-pointer">
                    <TableCell className="font-black text-slate-800 py-4 group-hover:text-primary transition-colors">{tenant.name}</TableCell>
                    <TableCell>
                      <span className="font-mono text-[10px] sm:text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{tenant.code}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(tenant.type) as any} className="font-bold tracking-wide">{tenant.type}</Badge>
                    </TableCell>
                    <TableCell>
                       {subscription ? (
                         <div className="flex flex-col">
                           <span className="font-black text-slate-700 text-xs">{subscription.planName}</span>
                           <span className="text-[10px] font-bold text-slate-400">
                             Hingga {new Date(subscription.endDate).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                           </span>
                         </div>
                       ) : (
                         <span className="text-xs font-bold text-slate-400">-</span>
                       )}
                    </TableCell>
                    <TableCell className="text-right font-black text-slate-700">{tenant._count?.users || 0}</TableCell>
                    <TableCell className="text-right">
                       <div className="flex justify-end gap-2">
                         <Dialog open={editingTenant?.id === tenant.id} onOpenChange={(open) => {
                           if (open) {
                             setEditingTenant(tenant);
                             setEditPlanName(subscription?.planName || 'FREE');
                             setEditAddMonths('0');
                           } else {
                             setEditingTenant(null);
                           }
                         }}>
                           <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium w-10 h-10 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors rounded-xl">
                             <Settings className="w-4 h-4" />
                           </DialogTrigger>
                           <DialogContent className="sm:max-w-[425px] rounded-3xl">
                             <DialogHeader>
                               <DialogTitle className="text-xl font-black text-slate-800">Ubah Langganan</DialogTitle>
                             </DialogHeader>
                             <form onSubmit={handleUpdateSubscription} className="space-y-4 mt-4">
                               <div className="space-y-2">
                                 <Label className="text-sm font-bold text-slate-700">Paket Langganan</Label>
                                 <Select value={editPlanName} onValueChange={(val) => setEditPlanName(val || 'FREE')}>
                                   <SelectTrigger className="rounded-xl">
                                     <SelectValue placeholder="Pilih Paket" />
                                   </SelectTrigger>
                                   <SelectContent className="rounded-xl">
                                     <SelectItem value="FREE">Gratis (FREE)</SelectItem>
                                     <SelectItem value="BASIC">Dasar (BASIC)</SelectItem>
                                     <SelectItem value="PRO">Profesional (PRO)</SelectItem>
                                     <SelectItem value="ENTERPRISE">Perusahaan (ENTERPRISE)</SelectItem>
                                   </SelectContent>
                                 </Select>
                               </div>

                               <div className="space-y-2">
                                 <Label htmlFor="addMonths" className="text-sm font-bold text-slate-700">Tambah Durasi (Bulan)</Label>
                                 <Input 
                                   id="addMonths" 
                                   type="number"
                                   min="0"
                                   placeholder="0 = Hanya ubah paket"
                                   className="rounded-xl border-slate-200"
                                   value={editAddMonths}
                                   onChange={(e) => setEditAddMonths(e.target.value)}
                                 />
                               </div>

                               <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-6 font-bold mt-4" disabled={isUpdatingSubscription}>
                                 {isUpdatingSubscription ? 'Menyimpan...' : 'Simpan Perubahan'}
                               </Button>
                             </form>
                           </DialogContent>
                         </Dialog>

                         <Button 
                           variant="ghost" 
                           size="icon"
                           onClick={() => handleDeleteTenant(tenant.id, tenant.name)}
                           className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors rounded-xl"
                         >
                           <Trash2 className="w-4 h-4" />
                         </Button>
                       </div>
                    </TableCell>
                  </TableRow>
                )})
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
