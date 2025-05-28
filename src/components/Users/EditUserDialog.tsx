
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useUsers } from '@/hooks/useUsers';
import { useClients } from '@/hooks/useClients';
import { UserFormFields } from './UserFormFields';
import { EditUserFormActions } from './EditUserFormActions';

const userSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  department: z.string().optional(),
  role: z.string().min(1, 'Função é obrigatória'),
  client_id: z.string().optional(),
  status: z.enum(['active', 'inactive']),
});

type UserFormData = z.infer<typeof userSchema>;

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  department: string | null;
  role: string;
  client_id: string | null;
  status: 'active' | 'inactive';
}

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

export const EditUserDialog = ({ open, onOpenChange, user }: EditUserDialogProps) => {
  const { updateUser } = useUsers();
  const { clients } = useClients();

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      department: '',
      role: 'user',
      client_id: 'none',
      status: 'active',
    },
  });

  useEffect(() => {
    if (user && open) {
      form.reset({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        department: user.department || '',
        role: user.role || 'user',
        client_id: user.client_id || 'none',
        status: user.status || 'active',
      });
    }
  }, [user, open, form]);

  const onSubmit = async (data: UserFormData) => {
    const formData = {
      ...data,
      phone: data.phone || undefined,
      department: data.department || undefined,
      client_id: data.client_id === 'none' ? undefined : data.client_id,
    };

    const success = await updateUser(user.id, formData);
    if (success) {
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <UserFormFields control={form.control} clients={clients} />
            <EditUserFormActions 
              onCancel={handleCancel}
              isSubmitting={form.formState.isSubmitting}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
