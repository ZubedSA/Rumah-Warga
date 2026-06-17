'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, ArrowDownRight, ArrowUpRight, CheckCircle, Clock, FileText } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/authStore';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function OverviewTab() {
  const [summary, setSummary] = useState<any>(null);
  const accessToken = useAuthStore(state => state.accessToken);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await apiClient.get('/finance/summary', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        setSummary(res);
      } catch (e) {
        console.error(e);
      }
    };
    if (accessToken) fetchSummary();
  }, [accessToken]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0);
  };

  const chartData = [
    { name: 'Jan', income: 4000000, expense: 2400000 },
    { name: 'Feb', income: 3000000, expense: 1398000 },
    { name: 'Mar', income: 2000000, expense: 9800000 },
    { name: 'Apr', income: 2780000, expense: 3908000 },
    { name: 'Mei', income: 1890000, expense: 4800000 },
    { name: 'Jun', income: 2390000, expense: 3800000 },
  ];

  const pieData = [
    { name: 'Keamanan', value: 400 },
    { name: 'Kebersihan', value: 300 },
    { name: 'Sosial', value: 300 },
    { name: 'Operasional', value: 200 },
  ];
  const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Main Balance Card */}
        <div className="bg-gradient-violet rounded-3xl p-6 relative overflow-hidden shadow-violet-soft text-white lg:col-span-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium text-white/80">Saldo Kas Saat Ini</p>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
              {summary ? formatCurrency(summary.balance) : 'Rp 0'}
            </h2>
            <p className="text-xs text-white/70 font-medium">Berdasarkan total mutasi kas</p>
          </div>
        </div>

        {/* Income Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_24px_rgb(0,0,0,0.03)] relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full">+12%</span>
          </div>
          <p className="text-sm font-bold text-slate-400 mb-1">Total Pemasukan (Bulan Ini)</p>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            {summary ? formatCurrency(summary.totalIncomeMonth) : 'Rp 0'}
          </h2>
        </div>

        {/* Expense Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_24px_rgb(0,0,0,0.03)] relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-rose-500" />
            </div>
            <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-full">-5%</span>
          </div>
          <p className="text-sm font-bold text-slate-400 mb-1">Total Pengeluaran (Bulan Ini)</p>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            {summary ? formatCurrency(summary.totalExpenseMonth) : 'Rp 0'}
          </h2>
        </div>

        {/* Dues Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_24px_rgb(0,0,0,0.03)] relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-indigo-500" />
            </div>
          </div>
          <p className="text-sm font-bold text-slate-400 mb-1">Total Iuran Masuk (Bulan Ini)</p>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            {summary ? formatCurrency(summary.totalDuesMonth) : 'Rp 0'}
          </h2>
        </div>

        {/* Arrears Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_24px_rgb(0,0,0,0.03)] relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          <p className="text-sm font-bold text-slate-400 mb-1">Total Tunggakan Iuran</p>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            {summary ? formatCurrency(summary.totalArrears) : 'Rp 0'}
          </h2>
        </div>

        {/* TX Count Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_24px_rgb(0,0,0,0.03)] relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
              <FileText className="w-5 h-5 text-slate-500" />
            </div>
          </div>
          <p className="text-sm font-bold text-slate-400 mb-1">Jumlah Transaksi (Bulan Ini)</p>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            {summary?.transactionCountMonth || 0}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cashflow Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_24px_rgb(0,0,0,0.03)] flex flex-col">
          <h3 className="text-lg font-black text-slate-800 tracking-tight mb-6">Pemasukan vs Pengeluaran</h3>
          <div className="h-[300px] w-full min-w-0 flex-1">
            <ResponsiveContainer width="99%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dx={-10} tickFormatter={(value) => `Rp${value / 1000000}M`} />
                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="income" name="Pemasukan" fill="#10b981" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="expense" name="Pengeluaran" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_24px_rgb(0,0,0,0.03)] flex flex-col">
          <h3 className="text-lg font-black text-slate-800 tracking-tight mb-6">Kategori Pengeluaran</h3>
          <div className="h-[300px] w-full min-w-0 flex-1 flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 h-48 md:h-full">
              <ResponsiveContainer width="99%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-4 mt-6 md:mt-0">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-sm font-bold text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-800">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
