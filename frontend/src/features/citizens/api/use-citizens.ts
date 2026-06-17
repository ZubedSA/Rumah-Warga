import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export const useGetCitizens = () => {
  return useQuery({
    queryKey: ['citizens'],
    queryFn: async () => {
      const response = await apiClient.get('/citizens');
      return response as any as any[]; 
    },
  });
};

export const useGetCitizen = (id: string) => {
  return useQuery({
    queryKey: ['citizens', id],
    queryFn: async () => {
      const response = await apiClient.get(`/citizens/${id}`);
      return response as any;
    },
    enabled: !!id,
  });
};

export const useCreateCitizen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post('/citizens', data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citizens'] });
    },
  });
};

export const useUpdateCitizen = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.patch(`/citizens/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citizens'] });
      queryClient.invalidateQueries({ queryKey: ['citizens', id] });
    },
  });
};
