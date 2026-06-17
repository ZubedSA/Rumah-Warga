'use client';

import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/store/authStore';
import { Activity, Clock } from 'lucide-react';

export default function SuperadminLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const accessToken = useAuthStore(state => state.accessToken);

  const fetchLogs = () => {
    setLoading(true);
    apiClient.get('/superadmin/logs', {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    .then(res => {
      setLogs(res as unknown as any[]);
    })
    .catch(err => console.error('Failed to fetch logs:', err))
    .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (accessToken) {
      fetchLogs();
    }
  }, [accessToken]);

  const getActionBadgeColor = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes('CREATE') || act.includes('ADD')) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (act.includes('UPDATE') || act.includes('EDIT')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (act.includes('DELETE') || act.includes('REMOVE')) return 'bg-rose-100 text-rose-700 border-rose-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
             <Activity className="w-8 h-8 text-primary" />
             Log Sistem
          </h1>
          <p className="text-slate-500 font-medium mt-1">Jejak audit dan riwayat aktivitas seluruh platform RumahWarga.</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] p-4 sm:p-6 shadow-[0_4px_24px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 hover:bg-transparent">
                <TableHead className="font-bold text-slate-400 uppercase tracking-wider text-xs w-[180px]">Waktu</TableHead>
                <TableHead className="font-bold text-slate-400 uppercase tracking-wider text-xs">Aktor (Pengguna)</TableHead>
                <TableHead className="font-bold text-slate-400 uppercase tracking-wider text-xs">Aksi</TableHead>
                <TableHead className="font-bold text-slate-400 uppercase tracking-wider text-xs">Entitas</TableHead>
                <TableHead className="font-bold text-slate-400 uppercase tracking-wider text-xs">Tenant</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-4 border-indigo-100 border-t-primary rounded-full animate-spin"></div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Memuat Data Log</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center">
                    <p className="text-sm font-bold text-slate-500">Belum ada aktivitas yang tercatat di dalam sistem.</p>
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors group">
                    <TableCell>
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">
                          {new Date(log.createdAt).toLocaleString('id-ID', { 
                            day: '2-digit', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-black text-slate-800 text-sm">{log.user?.name || 'Sistem'}</span>
                        <span className="text-[10px] font-bold text-slate-400">{log.user?.role || 'SYSTEM'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`font-bold tracking-wide text-[10px] ${getActionBadgeColor(log.action)}`}>
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                        {log.entity}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs font-bold text-slate-500">
                        {log.tenant?.name || '-'}
                      </span>
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
