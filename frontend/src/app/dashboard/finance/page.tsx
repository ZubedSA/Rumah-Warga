'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OverviewTab from './components/OverviewTab';
import IncomeTab from './components/IncomeTab';
import ExpenseTab from './components/ExpenseTab';
import DuesTab from './components/DuesTab';
import CashbookTab from './components/CashbookTab';
import ReportsTab from './components/ReportsTab';
import { Wallet } from 'lucide-react';

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-14 h-14 shrink-0 bg-accent rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
          <Wallet className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Manajemen Keuangan</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Transparansi dan pengelolaan kas lingkungan</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Scrollable Tabs Wrapper */}
        <div className="w-full overflow-x-auto hide-scrollbar border-b border-slate-200 mb-8">
          <TabsList className="flex h-auto gap-2 bg-transparent justify-start w-max pb-4 px-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-full px-5 py-2.5 whitespace-nowrap text-sm font-bold transition-all duration-300">Ringkasan</TabsTrigger>
            <TabsTrigger value="income" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-full px-5 py-2.5 whitespace-nowrap text-sm font-bold transition-all duration-300">Kas Masuk</TabsTrigger>
            <TabsTrigger value="expense" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-full px-5 py-2.5 whitespace-nowrap text-sm font-bold transition-all duration-300">Kas Keluar</TabsTrigger>
            <TabsTrigger value="dues" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-full px-5 py-2.5 whitespace-nowrap text-sm font-bold transition-all duration-300">Iuran Warga</TabsTrigger>
            <TabsTrigger value="cashbook" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-full px-5 py-2.5 whitespace-nowrap text-sm font-bold transition-all duration-300">Buku Kas</TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md rounded-full px-5 py-2.5 whitespace-nowrap text-sm font-bold transition-all duration-300">Laporan</TabsTrigger>
          </TabsList>
        </div>

        <div className="mt-6">
          <TabsContent value="overview"><OverviewTab /></TabsContent>
          <TabsContent value="income"><IncomeTab /></TabsContent>
          <TabsContent value="expense"><ExpenseTab /></TabsContent>
          <TabsContent value="dues"><DuesTab /></TabsContent>
          <TabsContent value="cashbook"><CashbookTab /></TabsContent>
          <TabsContent value="reports"><ReportsTab /></TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
