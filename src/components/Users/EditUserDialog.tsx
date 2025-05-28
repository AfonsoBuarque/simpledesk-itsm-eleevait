
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
import { useGroups } from '@/hooks/useGroups';
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
  groups: z.array(z.string()).optional(),
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
  const { updateUser, getUserGroups } = useUsers();
  const { clients } = useClients();
  const { groups } = useGroups();

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      department: '',
      role: 'user',
      client_id: '',
      status: 'active',
      groups: [],
    },
  });

  useEffect(() => {
    if (user && open) {
      // Carregar os grupos do usuário
      const loadUserGroups = async () => {
        try {
          const userGroups = await getUserGroups(user.id);
          
          // Reset do form com valores corretos
          const formData = {
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            department: user.department || '',
            role: user.role || 'user',
            client_id: user.client_id || '',
            status: user.status || 'active',
            groups: userGroups.map(g => g.id),
          };
          
          // Usar setTimeout para garantir que o form está pronto
          setTimeout(() => {
            form.reset(formData);
          }, 100);
          
        } catch (error) {
          console.error('Error loading user groups:', error);
          // Reset form mesmo se grupos falharem
          const formData = {
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            department: user.department || '',
            role: user.role || 'user',
            client_id: user.client_id || '',
            status: user.status || 'active',
            groups: [],
          };
          
          setTimeout(() => {
            form.reset(formData);
          }, 100);
        }
      };

      loadUserGroups();
    }
  }, [user.id, open, getUserGroups, form]);

  const onSubmit = async (data: UserFormData) => {
    const formData = {
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
      phone: data.phone || undefined,
      department: data.department || undefined,
      client_id: data.client_id || undefined,
      groups: data.groups || [],
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
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <UserFormFields 
              control={form.control} 
              clients={clients} 
              groups={groups}
            />
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
