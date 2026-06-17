'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ShieldAlert, UserCog } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

export default function SuperadminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Role Update State
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editRole, setEditRole] = useState('WARGA');
  const [isUpdating, setIsUpdating] = useState(false);

  const accessToken = useAuthStore(state => state.accessToken);

  const fetchUsers = () => {
    setLoading(true);
    apiClient.get('/superadmin/users', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    .then(res => {
      setUsers(res as unknown as any[]);
    })
    .catch(err => console.error('Failed to fetch users:', err))
    .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (accessToken) {
      fetchUsers();
    }
  }, [accessToken]);

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (editRole === 'SUPER_ADMIN' && editingUser.role !== 'SUPER_ADMIN') {
      if (!confirm(`PERINGATAN: Anda akan memberikan akses SUPER ADMIN ke ${editingUser.name}. Yakin?`)) return;
    }

    setIsUpdating(true);
    try {
      await apiClient.patch(`/superadmin/users/${editingUser.id}/role`, {
        role: editRole
      }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      toast.success('Hak akses pengguna berhasil diperbarui!');
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error('Gagal memperbarui hak akses pengguna');
    } finally {
      setIsUpdating(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case 'SUPER_ADMIN': return 'bg-rose-100 text-rose-700 hover:bg-rose-200 border-rose-200';
      case 'RW': return 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-indigo-200';
      case 'RT': return 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200';
      case 'SEKRETARIS':
      case 'BENDAHARA': return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Manajemen Pengguna</h1>
          <p className="text-slate-500 font-medium mt-1">Pantau seluruh pengguna dan atur hak akses (Role) secara global.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] p-4 sm:p-6 shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 hover:bg-transparent">
                <TableHead className="font-bold text-slate-400 uppercase tracking-wider text-xs">Pengguna</TableHead>
                <TableHead className="font-bold text-slate-400 uppercase tracking-wider text-xs">Email</TableHead>
                <TableHead className="font-bold text-slate-400 uppercase tracking-wider text-xs">Tenant (Organisasi)</TableHead>
                <TableHead className="font-bold text-slate-400 uppercase tracking-wider text-xs">Role (Hak Akses)</TableHead>
                <TableHead className="font-bold text-slate-400 uppercase tracking-wider text-xs text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-4 border-indigo-100 border-t-primary rounded-full animate-spin"></div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Memuat Data</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center">
                    <p className="text-sm font-bold text-slate-500">Belum ada pengguna yang terdaftar.</p>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-black text-slate-800">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium text-slate-500">{user.email}</span>
                    </TableCell>
                    <TableCell>
                      {user.tenant ? (
                         <div className="flex flex-col">
                           <span className="font-bold text-slate-700 text-xs">{user.tenant.name}</span>
                           <span className="text-[10px] font-bold text-slate-400">{user.tenant.type}</span>
                         </div>
                      ) : (
                        <span className="text-xs font-bold text-slate-400 italic">Tanpa Tenant (Global)</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`font-bold tracking-wide ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <Dialog open={editingUser?.id === user.id} onOpenChange={(open) => {
                         if (open) {
                           setEditingUser(user);
                           setEditRole(user.role);
                         } else {
                           setEditingUser(null);
                         }
                       }}>
                         <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium w-10 h-10 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors rounded-xl">
                           <UserCog className="w-4 h-4" />
                         </DialogTrigger>
                         <DialogContent className="sm:max-w-[425px] rounded-3xl">
                           <DialogHeader>
                             <DialogTitle className="text-xl font-black text-slate-800">Ubah Hak Akses</DialogTitle>
                           </DialogHeader>
                           <form onSubmit={handleUpdateRole} className="space-y-4 mt-4">
                             <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center font-bold text-slate-600 shadow-sm">
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-black text-slate-800">{user.name}</div>
                                  <div className="text-xs font-bold text-slate-500">{user.email}</div>
                                </div>
                             </div>

                             <div className="space-y-2">
                               <Label className="text-sm font-bold text-slate-700">Pilih Role Baru</Label>
                               <Select value={editRole} onValueChange={(val) => setEditRole(val || 'WARGA')}>
                                 <SelectTrigger className="rounded-xl">
                                   <SelectValue placeholder="Pilih Role" />
                                 </SelectTrigger>
                                 <SelectContent className="rounded-xl">
                                   <SelectItem value="WARGA">Warga (WARGA)</SelectItem>
                                   <SelectItem value="RT">Admin RT (RT)</SelectItem>
                                   <SelectItem value="RW">Admin RW (RW)</SelectItem>
                                   <SelectItem value="SEKRETARIS">Sekretaris (SEKRETARIS)</SelectItem>
                                   <SelectItem value="BENDAHARA">Bendahara (BENDAHARA)</SelectItem>
                                   <div className="h-px bg-slate-100 my-1"></div>
                                   <SelectItem value="SUPER_ADMIN" className="text-rose-600 focus:text-rose-700 focus:bg-rose-50">
                                      <div className="flex items-center gap-2">
                                        <ShieldAlert className="w-4 h-4" />
                                        <span>Super Admin (Global)</span>
                                      </div>
                                   </SelectItem>
                                 </SelectContent>
                               </Select>
                             </div>

                             <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-6 font-bold mt-4" disabled={isUpdating}>
                               {isUpdating ? 'Menyimpan...' : 'Simpan Perubahan Role'}
                             </Button>
                           </form>
                         </DialogContent>
                       </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
