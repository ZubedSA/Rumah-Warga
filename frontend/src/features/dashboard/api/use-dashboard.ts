import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export const useGetDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const response = await apiClient.get('/dashboard/statistics');
      return response as any;
    },
  });
};
