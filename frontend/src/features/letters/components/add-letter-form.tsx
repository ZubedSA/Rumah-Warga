'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateLetter } from '../api/use-letters';
import { useGetLetterTemplates } from '../api/use-letter-templates';
import { useGetCitizens } from '@/features/citizens/api/use-citizens';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/lib/api-client';

const formSchema = z.object({
  citizenId: z.string().optional(),
  letterTemplateId: z.string().min(1, { message: 'Jenis surat harus dipilih' }),
  notes: z.string().optional(),
});

export function AddLetterForm({ onSuccess }: { onSuccess?: () => void }) {
  const { mutate: createLetter, isPending } = useCreateLetter();
  const { data: citizens = [] } = useGetCitizens();
  const { data: templates = [] } = useGetLetterTemplates();
  const router = useRouter();
  const [profile, setProfile] = React.useState<any>(null);
  const user = useAuthStore(state => state.user);
  const accessToken = useAuthStore(state => state.accessToken);

  React.useEffect(() => {
    if (accessToken) {
      apiClient.get('/auth/profile', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      .then(res => setProfile(res))
      .catch(err => console.error(err));
    }
  }, [accessToken]);

  const role = profile?.role || user?.role;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      citizenId: '',
      letterTemplateId: '',
      notes: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createLetter(values, {
      onSuccess: () => {
        toast.success('Pengajuan surat berhasil dibuat');
        if (onSuccess) onSuccess();
        router.refresh();
      },
      onError: () => {
        toast.error('Gagal membuat pengajuan surat');
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {role !== 'WARGA' && (
          <FormField
            control={form.control}
            name="citizenId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pilih Pemohon (Warga)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Warga...">
                        {field.value ? citizens.find((c: any) => c.id === field.value)?.name : "Pilih Warga..."}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {citizens.map((citizen: any) => (
                      <SelectItem key={citizen.id} value={citizen.id}>
                        {citizen.name} ({citizen.nik})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <FormField
          control={form.control}
          name="letterTemplateId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis Surat Pengantar</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis surat...">
                      {field.value ? templates.find((t: any) => t.id === field.value)?.name : "Pilih jenis surat..."}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {templates.filter((tpl: any) => tpl.isActive).map((tpl: any) => (
                    <SelectItem key={tpl.id} value={tpl.id}>{tpl.name}</SelectItem>
                  ))}
                  {templates.length === 0 && (
                    <SelectItem value="TEMPLATE_SKCK" disabled>Belum ada template aktif</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catatan (Opsional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Keperluan surat..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Menyimpan...' : 'Ajukan Surat'}
        </Button>
      </form>
    </Form>
  );
}
