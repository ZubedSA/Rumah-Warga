import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export const useGetLetterTemplates = () => {
  return useQuery({
    queryKey: ['letterTemplates'],
    queryFn: async () => {
      const response = await apiClient.get('/letter-templates');
      return response as any as any[];
    },
  });
};

export const useCreateLetterTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiClient.post('/letter-templates', data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['letterTemplates'] });
    },
  });
};

export const useUpdateLetterTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; name?: string; content?: string; isActive?: boolean }) => {
      const response = await apiClient.patch(`/letter-templates/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['letterTemplates'] });
    },
  });
};

export const useDeleteLetterTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.delete(`/letter-templates/${id}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['letterTemplates'] });
    },
  });
};
