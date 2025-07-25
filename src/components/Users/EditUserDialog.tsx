
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
      console.log('EditUserDialog - Loading user data:', user);
      
      const loadUserData = async () => {
        try {
          const userGroups = await getUserGroups(user.id);
          console.log('EditUserDialog - User groups loaded:', userGroups);
          
          const formData = {
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            department: user.department || '',
            role: user.role || 'user',
            client_id: user.client_id || '',
            status: user.status || 'active' as const,
            groups: userGroups.map(g => g.id),
          };
          
          console.log('EditUserDialog - Setting form data:', formData);
          form.reset(formData);
          
        } catch (error) {
          console.error('EditUserDialog - Error loading user data:', error);
          
          const formData = {
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            department: user.department || '',
            role: user.role || 'user',
            client_id: user.client_id || '',
            status: user.status || 'active' as const,
            groups: [],
          };
          
          form.reset(formData);
        }
      };

      loadUserData();
    }
  }, [user.id, open]); // Removidas as dependências que causavam loop

  const onSubmit = async (data: UserFormData) => {
    console.log('EditUserDialog - Submitting user data:', data);
    
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
