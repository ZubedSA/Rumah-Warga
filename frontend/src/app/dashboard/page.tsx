'use client';

import React from 'react';
import { useAuthStore } from '@/store/authStore';
import { AdminDashboard } from '@/features/dashboard/components/admin-dashboard';
import { CitizenDashboard } from '@/features/dashboard/components/citizen-dashboard';
import { apiClient } from '@/lib/api-client';

export default function DashboardPage() {
  const user = useAuthStore(state => state.user);
  const accessToken = useAuthStore(state => state.accessToken);
  const [profile, setProfile] = React.useState<any>(null);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (accessToken) {
      apiClient.get('/auth/profile', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      .then(res => setProfile(res))
      .catch(err => console.error('Failed to fetch profile:', err));
    }
  }, [accessToken]);

  if (!isMounted) return null;

  const role = profile?.role || user?.role;

  if (role === 'WARGA') {
    return <CitizenDashboard />;
  }

  return <AdminDashboard />;
}
