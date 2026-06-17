'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';

export type Letter = {
  id: string;
  status: string;
  letterNumber?: string;
  createdAt: string;
  citizen: { name: string; phone?: string | null };
  template: { name: string };
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'PENDING':
      return <Badge variant="secondary">Menunggu</Badge>;
    case 'APPROVED':
      return <Badge variant="default" className="bg-green-600">Diproses</Badge>;
    case 'READY_FOR_PICKUP':
      return <Badge variant="default" className="bg-blue-600">Siap Diambil</Badge>;
    case 'REJECTED':
      return <Badge variant="destructive">Ditolak</Badge>;
    case 'COMPLETED':
      return <Badge variant="default" className="bg-slate-600">Selesai</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const handleSendWA = (letter: Letter) => {
  const phone = letter.citizen.phone;
  if (!phone) {
    alert('Nomor HP warga tidak tersedia.');
    return;
  }
  
  let template = localStorage.getItem('whatsapp_confirmation_template') || 'Halo {{nama_warga}}, pengajuan surat {{jenis_surat}} Anda sudah *Selesai* dan Siap Diambil di balai RW/RT.\n\nMohon membawa KTP saat pengambilan. Terima kasih.';
  
  template = template.replace(/\{\{nama_warga\}\}/g, letter.citizen.name);
  template = template.replace(/\{\{jenis_surat\}\}/g, letter.template.name);
  template = template.replace(/\{\{nomor_surat\}\}/g, letter.letterNumber || '-');
  
  let formattedPhone = phone.replace(/\D/g, '');
  if (formattedPhone.startsWith('0')) {
    formattedPhone = '62' + formattedPhone.substring(1);
  }
  
  window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(template)}`, '_blank');
};

export const columns: ColumnDef<Letter>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Tanggal',
    cell: ({ row }) => {
      return new Date(row.original.createdAt).toLocaleDateString('id-ID');
    },
  },
  {
    id: 'citizen',
    accessorKey: 'citizen.name',
    header: 'Pemohon',
  },
  {
    id: 'template',
    accessorKey: 'template.name',
    header: 'Jenis Surat',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => getStatusBadge(row.original.status),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const letter = row.original;
      const role = useAuthStore.getState().user?.role;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger render={
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Buka menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          } />
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuItem render={<Link href={role === 'WARGA' ? `/portal/letters/${letter.id}` : `/dashboard/letters/${letter.id}`} />}>
                Lihat Detail
              </DropdownMenuItem>
              {role !== 'WARGA' && letter.status === 'READY_FOR_PICKUP' && (
                <DropdownMenuItem onClick={() => handleSendWA(letter)}>
                  Kirim Konfirmasi WA
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
