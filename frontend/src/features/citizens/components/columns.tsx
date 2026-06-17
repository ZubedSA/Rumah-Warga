'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

export type Citizen = {
  id: string;
  nik: string;
  name: string;
  gender: string;
  rt: string;
  rw: string;
  phone?: string;
};

export const columns: ColumnDef<Citizen>[] = [
  {
    accessorKey: 'nik',
    header: 'NIK',
    cell: ({ row }) => <div className="break-all sm:break-normal max-w-[100px] sm:max-w-none text-xs sm:text-sm">{row.original.nik}</div>,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="px-0 hover:bg-transparent font-bold whitespace-normal text-left h-auto py-1"
        >
          Nama Warga
          <ArrowUpDown className="ml-2 h-4 w-4 shrink-0" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="break-words max-w-[120px] sm:max-w-none whitespace-normal leading-tight">{row.original.name}</div>,
  },
  {
    accessorKey: 'gender',
    header: 'Jenis Kelamin',
    meta: { className: 'hidden md:table-cell' }
  },
  {
    accessorKey: 'rt',
    header: 'RT',
    meta: { className: 'hidden md:table-cell' }
  },
  {
    accessorKey: 'rw',
    header: 'RW',
    meta: { className: 'hidden md:table-cell' }
  },
  {
    accessorKey: 'phone',
    header: 'No. WhatsApp',
    cell: ({ row }) => row.original.phone || <span className="text-slate-400 italic text-xs">Tidak ada</span>
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const citizen = row.original;
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
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(citizen.nik)}
              >
                Salin NIK
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link href={`/dashboard/citizens/${citizen.id}`} />}>
                Lihat Detail
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
