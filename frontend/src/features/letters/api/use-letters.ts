import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export const useGetLetters = () => {
  return useQuery({
    queryKey: ['letters'],
    queryFn: async () => {
      const response = await apiClient.get('/letters');
      return response as any as any[];
    },
  });
};

export const useGetLetter = (id: string) => {
  return useQuery({
    queryKey: ['letters', id],
    queryFn: async () => {
      const response = await apiClient.get(`/letters/${id}`);
      return response as any;
    },
    enabled: !!id,
  });
};

export const useCreateLetter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post('/letters', data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['letters'] });
    },
  });
};

export const useUpdateLetterStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiClient.patch(`/letters/${id}`, { status });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['letters'] });
    },
  });
};
