'use client';

import React from 'react';
import Link from 'next/link';
import { AddCitizenForm } from '@/features/citizens/components/add-citizen-form';

export default function NewCitizenPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/citizens" className="text-sm text-muted-foreground hover:underline mb-2 block">
          &larr; Kembali ke Data Warga
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Tambah Warga Baru</h1>
      </div>

      <div className="border rounded-lg p-6 bg-white shadow-sm max-w-2xl">
        <AddCitizenForm />
      </div>
    </div>
  );
}
