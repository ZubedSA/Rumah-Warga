'use client';

import React from 'react';
import Link from 'next/link';
import { AddLetterForm } from '@/features/letters/components/add-letter-form';

export default function NewLetterPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/letters" className="text-sm text-muted-foreground hover:underline mb-2 block">
          &larr; Kembali ke Surat Menyurat
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Buat Pengajuan Surat</h1>
      </div>

      <div className="border rounded-lg p-6 bg-white shadow-sm max-w-2xl">
        <AddLetterForm />
      </div>
    </div>
  );
}
