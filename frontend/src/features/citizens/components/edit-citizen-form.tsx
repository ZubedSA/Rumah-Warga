'use client';

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
import { useUpdateCitizen } from '../api/use-citizens';
import { toast } from 'sonner';

interface EditCitizenFormProps {
  citizen: any;
  onSuccess?: () => void;
}

const formSchema = z.object({
  nik: z.string().min(16, { message: 'NIK harus 16 digit' }).max(16),
  name: z.string().min(2, { message: 'Nama harus diisi' }),
  gender: z.enum(['LAKI_LAKI', 'PEREMPUAN']),
  birthPlace: z.string().min(2),
  birthDate: z.string(),
  religion: z.enum(['ISLAM', 'KRISTEN', 'KATOLIK', 'HINDU', 'BUDHA', 'KONGHUCU', 'LAINNYA']),
  maritalStatus: z.enum(['BELUM_KAWIN', 'KAWIN', 'CERAI_HIDUP', 'CERAI_MATI']),
  occupation: z.string().min(2),
  rt: z.string().min(1),
  rw: z.string().min(1),
  phone: z.string().optional(),
});

export function EditCitizenForm({ citizen, onSuccess }: EditCitizenFormProps) {
  const { mutate: updateCitizen, isPending } = useUpdateCitizen(citizen.id);

  // Helper to format Date string properly for input type="date"
  const formattedDate = citizen.birthDate ? new Date(citizen.birthDate).toISOString().split('T')[0] : '';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nik: citizen.nik || '',
      name: citizen.name || '',
      gender: citizen.gender as any,
      birthPlace: citizen.birthPlace || '',
      birthDate: formattedDate,
      religion: citizen.religion as any,
      maritalStatus: citizen.maritalStatus as any,
      occupation: citizen.occupation || '',
      rt: citizen.rt || '',
      rw: citizen.rw || '',
      phone: citizen.phone || '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Check if any fields actually changed to save bandwidth
    updateCitizen(values, {
      onSuccess: () => {
        toast.success('Data warga berhasil diperbarui');
        onSuccess?.();
      },
      onError: () => {
        toast.error('Gagal memperbarui data warga');
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nik"
            render={({ field }) => (
               <FormItem>
                 <FormLabel>NIK</FormLabel>
                 <FormControl>
                   <Input placeholder="320..." {...field} />
                 </FormControl>
                 <FormMessage />
               </FormItem>
             )}
          />
          <FormField
             control={form.control}
             name="name"
             render={({ field }) => (
               <FormItem>
                 <FormLabel>Nama Lengkap</FormLabel>
                 <FormControl>
                   <Input placeholder="John Doe" {...field} />
                 </FormControl>
                 <FormMessage />
               </FormItem>
             )}
          />
          <FormField
             control={form.control}
             name="gender"
             render={({ field }) => (
               <FormItem>
                 <FormLabel>Jenis Kelamin</FormLabel>
                 <Select onValueChange={field.onChange} value={field.value}>
                   <FormControl>
                     <SelectTrigger>
                       <SelectValue placeholder="Pilih jenis kelamin" />
                     </SelectTrigger>
                   </FormControl>
                   <SelectContent>
                     <SelectItem value="LAKI_LAKI">Laki-Laki</SelectItem>
                     <SelectItem value="PEREMPUAN">Perempuan</SelectItem>
                   </SelectContent>
                 </Select>
                 <FormMessage />
               </FormItem>
             )}
          />
          <FormField
             control={form.control}
             name="birthPlace"
             render={({ field }) => (
               <FormItem>
                 <FormLabel>Tempat Lahir</FormLabel>
                 <FormControl>
                   <Input placeholder="Jakarta" {...field} />
                 </FormControl>
                 <FormMessage />
               </FormItem>
             )}
          />
          <FormField
             control={form.control}
             name="birthDate"
             render={({ field }) => (
               <FormItem>
                 <FormLabel>Tanggal Lahir</FormLabel>
                 <FormControl>
                   <Input type="date" {...field} />
                 </FormControl>
                 <FormMessage />
               </FormItem>
             )}
          />
          <FormField
             control={form.control}
             name="religion"
             render={({ field }) => (
               <FormItem>
                 <FormLabel>Agama</FormLabel>
                 <Select onValueChange={field.onChange} value={field.value}>
                   <FormControl>
                     <SelectTrigger>
                       <SelectValue placeholder="Pilih Agama" />
                     </SelectTrigger>
                   </FormControl>
                   <SelectContent>
                     <SelectItem value="ISLAM">Islam</SelectItem>
                     <SelectItem value="KRISTEN">Kristen</SelectItem>
                     <SelectItem value="KATOLIK">Katolik</SelectItem>
                     <SelectItem value="HINDU">Hindu</SelectItem>
                     <SelectItem value="BUDHA">Budha</SelectItem>
                     <SelectItem value="KONGHUCU">Konghucu</SelectItem>
                     <SelectItem value="LAINNYA">Lainnya</SelectItem>
                   </SelectContent>
                 </Select>
                 <FormMessage />
               </FormItem>
             )}
          />
          <FormField
             control={form.control}
             name="maritalStatus"
             render={({ field }) => (
               <FormItem>
                 <FormLabel>Status Perkawinan</FormLabel>
                 <Select onValueChange={field.onChange} value={field.value}>
                   <FormControl>
                     <SelectTrigger>
                       <SelectValue placeholder="Pilih Status" />
                     </SelectTrigger>
                   </FormControl>
                   <SelectContent>
                     <SelectItem value="BELUM_KAWIN">Belum Kawin</SelectItem>
                     <SelectItem value="KAWIN">Kawin</SelectItem>
                     <SelectItem value="CERAI_HIDUP">Cerai Hidup</SelectItem>
                     <SelectItem value="CERAI_MATI">Cerai Mati</SelectItem>
                   </SelectContent>
                 </Select>
                 <FormMessage />
               </FormItem>
             )}
          />
          <FormField
             control={form.control}
             name="occupation"
             render={({ field }) => (
               <FormItem>
                 <FormLabel>Pekerjaan</FormLabel>
                 <FormControl>
                   <Input placeholder="Wiraswasta" {...field} />
                 </FormControl>
                 <FormMessage />
               </FormItem>
             )}
          />
          <FormField
            control={form.control}
            name="rt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RT</FormLabel>
                <FormControl>
                  <Input placeholder="001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rw"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RW</FormLabel>
                <FormControl>
                  <Input placeholder="002" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor WhatsApp</FormLabel>
                <FormControl>
                  <Input placeholder="08..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </form>
    </Form>
  );
}
